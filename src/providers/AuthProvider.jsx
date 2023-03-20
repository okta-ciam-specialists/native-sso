import { createContext, useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from 'react-router-dom';
import {
  handleOAuthResponse,
  getOAuthUrls
} from '@okta-dfuhriman/okta-auth-js';
import { useOktaAuth } from "@okta-dfuhriman/okta-react";
import axios, { AxiosError } from 'axios';
import qs from 'qs';

import { useLogger, useLogout } from "../hooks";

const {
  VITE_OKTA_CLIENT_ID: clientId,
  VITE_OKTA_SCOPES: SCOPES = 'openid email profile offline_access',
} = import.meta.env;

const scopes = Array.isArray(SCOPES) ? SCOPES : SCOPES.split(' ');

export const AuthProviderContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const history = useHistory();
	const location = useLocation();

	const { authState, oktaAuth } = useOktaAuth();

	const [loading, setLoading] = useState(true);
	const [tokenParams, setTokenParams] = useState();

	const { logger } = useLogger();
	const { logout } = useLogout(oktaAuth);

	const isInit = useRef(false);

	useEffect(() => {
		if (isInit.current) {
			setLoading(false);
			return;
		}

		logout(true);

		logger('initializing app...');

		setLoading(true);

		isInit.current = true;

		const { hash } = location || {};

		if (!hash) {
			return logger('app initialized');
		}

		logger('url fragment detected!');

		const params = new URLSearchParams(hash?.substring(1));

		const deviceSecret =
			params.has('device_secret') && params.get('device_secret');
		const idToken = params.has('id_token') && params.get('id_token');

		logger({ timestamp: null, text: 'removing url fragment...' })

		history.replace(location.origin);

		if (deviceSecret && idToken) {
			logger([
				{ text: 'parsing fragment...' },
				{ timestamp: null, text: `DEVICE_SECRET: ${deviceSecret}` },
				{ timestamp: null, text: `ID_TOKEN: ${idToken}` },
			]);

			logger([{ text: 'SSO detected!' }, { timestamp: null, text: 'initializing SSO...' }]);

			logger('preparing token request params...');

			oktaAuth.token.prepareTokenParams().then(({ state }) => {
				setTokenParams({
					grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
					actor_token_type: 'urn:x-oath:params:oauth:token-type:device-secret',
					subject_token_type: 'urn:ietf:params:oauth:token-type:id_token',
					scope: scopes.join(' '),
					audience: 'https://api',
					client_id: clientId,
					state,
					actor_token: deviceSecret,
					subject_token: idToken,
				});
			});
		}
	}, []);

	useEffect(() => {
		const handleSSO = async () => {
			try {

				logger([{ text: 'tokenParams:' }, { timestamp: null, text: tokenParams }]);

				logger('generating token request...')

				const { tokenUrl } = getOAuthUrls(oktaAuth);

				const url = `${window.location.origin}${new URL(tokenUrl).pathname
					}`;

				const options = {
					method: 'POST',
					url,
					withCredentials: true,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					data: qs.stringify(tokenParams),
				};

				logger(`calling token endpoint: ${url}`);

				const { data } = await axios(options);

				if (data) {
					logger([{ text: 'response received:' }, { timestamp: null, text: data }]);

					logger('parsing OAuthResponse...');

					const { tokens } = await handleOAuthResponse(oktaAuth, tokenParams, { ...data, state: tokenParams?.state });

					if (!!tokens) {
						logger([{ timestamp: null, text: 'found tokens!' }]);

						oktaAuth.tokenManager.setTokens(tokens);

						logger([{ timestamp: null, text: 'setting tokens and updating auth state...' }])
						await oktaAuth.authStateManager.updateAuthState();

						return tokens;
					}
				}

			} catch (error) {

				logger([{ text: 'ERROR' }, { timestamp: null, text: error }]);

				throw error
			}
		};

		if (!!tokenParams) {

			setLoading(true);

			handleSSO().then((tokens) => {
				if (tokens) {
					logger('SSO success!');
				}
			}).catch(error => {

				if (error instanceof AxiosError) {
					const { data, status, statusText } = error?.response || {};

					logger([{ text: 'ERROR' }, { timestamp: null, text: `${status} - ${statusText}` }, { timestamp: null, text: data }]);

				} else {
					logger([{ text: 'ERROR' }, { timestamp: null, text: error }]);
				}
			}).finally(() => {
				setLoading(false);
			});
		}
	}, [oktaAuth, tokenParams]);

	const context = {
		...authState,
		loading,
		oktaAuth,
		setLoading,
		setTokenParams,
		tokenParams,
	};

	return <AuthProviderContext.Provider value={context}>
		{children}
	</AuthProviderContext.Provider>

};