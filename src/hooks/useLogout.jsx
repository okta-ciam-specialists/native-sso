import { useOktaAuth } from '@okta-dfuhriman/okta-react';
import { useAuthProvider, useLogger } from '.';

export const useLogout = (_oktaAuth) => {
	const { authState, oktaAuth = _oktaAuth } = useOktaAuth() || {};
	const { clearLogs, logger } = useLogger();

	const logout = (silent = false) => {

		if (!silent) {
			clearLogs();

			logger([{ text: 'logout initiated...' }, { timestamp: null, text: 'revoking tokens...' }]);
		}

		const revokeTokens = async () => {
			const { accessToken, refreshToken } = authState || {};

			if (accessToken) {
				await oktaAuth.revokeAccessToken(accessToken);
			}

			if (refreshToken) {
				await oktaAuth.revokeRefreshToken(refreshToken);
			}
		};

		revokeTokens().then(() => {

			if (!silent) {
				logger([
					{ text: 'tokens revoked!' },
					{ timestamp: null, text: 'clearing token manager' },
					{ timestamp: null, text: 'Goodbye!' }
				]);
			}

			oktaAuth.tokenManager.clear();
		});
	};

	return { logout };
}