import { createContext, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
	handleOAuthResponse,
	getOAuthUrls,
} from '@okta-dfuhriman/okta-auth-js';
import { useOktaAuth } from '@okta-dfuhriman/okta-react';
import axios, { AxiosError } from 'axios';
import qs from 'qs';

import { useLogger } from '../hooks';

const {
	VITE_OKTA_CLIENT_ID: clientId,
	VITE_OKTA_SCOPES: SCOPES = 'openid email profile offline_access',
	VITE_APP_CLIENT_ID: PRIMARY_APP_CLIENT_ID,
	VITE_OKTA_ISSUER: ISSUER,
} = import.meta.env;

const scopes = Array.isArray(SCOPES) ? SCOPES : SCOPES.split(' ');

export const AuthProviderContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const history = useHistory();
	const location = useLocation();
	const { authState, oktaAuth } = useOktaAuth();

	const [loading, setLoading] = useState(true);
	const [tokenParams, setTokenParams] = useState();

	const { clearLogs, logger } = useLogger();

	const isInit = useRef(false);

	useEffect(() => {
		if (isInit.current) {
			setLoading(false);
			return;
		}

		logout(true);

		logger('initializing app...', true);

		setLoading(true);

		isInit.current = true;

		const { hash } = location || {};

		if (!hash) {
			return logger('app initialized', true);
		}

		logger('url fragment detected!', true);

		const params = new URLSearchParams(hash?.substring(1));

		const codeChallenge =
			params.has('code_challenge') && params.get('code_challenge');
		const idToken = params.has('id_token') && params.get('id_token');

		logger('removing url fragment...');

		history.replace(location.origin);

		if (codeChallenge && idToken) {
			logger('parsing fragment', true);
			logger(`CODE_CHALLENGE: ${codeChallenge}`);
			logger(`ID_TOKEN: ${idToken}`);

			logger('SSO detected!', true);
			logger('initializing SSO...');

			logger('fetching deviceSecret...', true);

			const prepareSSO = async () => {
				const options = {
					method: 'POST',
					url: `${window.origin}/sso`,
					data: {
						code_challenge: codeChallenge,
						id_token: idToken,
					},
				};

				const { data } = await axios(options);

				const { device_secret } = data || {};

				if (device_secret) {
					logger(`DEVICE_SECRET: ${device_secret}`);

					logger('preparing token request params...', true);

					const { state } = await oktaAuth.token.prepareTokenParams();

					return { actor_token: device_secret, subject_token: idToken, state };
				}
			};

			prepareSSO().then((p) => {
				setTokenParams({
					grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
					actor_token_type: 'urn:x-oath:params:oauth:token-type:device-secret',
					subject_token_type: 'urn:ietf:params:oauth:token-type:id_token',
					scope: scopes.join(' '),
					audience: 'https://api',
					client_id: clientId,
					...p,
				});
			});
		}
	}, []);

	useEffect(() => {
		const handleSSO = async () => {
			try {
				logger('tokenParams:');
				logger(tokenParams);

				logger('generating token request...', true);

				const { tokenUrl } = getOAuthUrls(oktaAuth);

				const url = `${window.location.origin}${new URL(tokenUrl).pathname}`;

				const options = {
					method: 'POST',
					url,
					withCredentials: true,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					data: qs.stringify(tokenParams),
				};

				logger(`calling token endpoint: ${url}`, true);

				const { data } = await axios(options);

				if (data) {
					logger('response received:');
					logger(data);

					logger('parsing OAuthResponse...', true);

					const { tokens } = await handleOAuthResponse(oktaAuth, tokenParams, {
						...data,
						state: tokenParams?.state,
					});

					if (!!tokens) {
						logger('found tokens!');

						oktaAuth.tokenManager.setTokens(tokens);

						logger('setting tokens and updating auth state...');
						await oktaAuth.authStateManager.updateAuthState();

						return tokens;
					}
				}
			} catch (error) {
				logger('ERROR', true);
				logger(error);

				throw error;
			}
		};

		if (!!tokenParams) {
			setLoading(true);

			handleSSO()
				.then((tokens) => {
					if (tokens) {
						logger('idToken Claims:', true);
						logger(JSON.stringify(tokens?.idToken?.claims, null, 2));
						logger('SSO success!', true);
					}
				})
				.catch((error) => {
					if (error instanceof AxiosError) {
						const { data, status, statusText } = error?.response || {};

						logger('ERROR', true);
						logger(`${status} - ${statusText}`);
						logger(data);
					} else {
						logger('ERROR', true);
						logger(error);
					}
				})
				.finally(() => {
					setLoading(false);
				});
		}
	}, [oktaAuth, tokenParams]);

	const logout = async (silent = false) => {
		if (!silent) {
			clearLogs();

			logger('logout initiated...', true);
			logger('revoking tokens...');
		}

		const { accessToken, refreshToken } = authState || {};

		if (accessToken) {
			await oktaAuth.revokeAccessToken(accessToken);
		}

		if (refreshToken) {
			await oktaAuth.revokeRefreshToken(refreshToken);
		}

		if (tokenParams?.actor_token) {
			const options = {
				method: 'POST',
				url: `${ISSUER}/v1/revoke`,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				data: qs.stringify({
					token: tokenParams.actor_token,
					client_id: PRIMARY_APP_CLIENT_ID,
				}),
			};

			await axios(options);
		}

		if (!silent) {
			logger('tokens revoked!', true);
			logger('clearing token manager...');
			logger('Goodbye!');
		}

		setTokenParams();
		oktaAuth.tokenManager.clear();
	};

	const context = {
		...authState,
		loading,
		logout,
		oktaAuth,
		setLoading,
		setTokenParams,
		tokenParams,
	};

	return (
		<AuthProviderContext.Provider value={context}>
			{children}
		</AuthProviderContext.Provider>
	);
};
