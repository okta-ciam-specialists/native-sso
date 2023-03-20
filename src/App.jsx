import { Route } from 'react-router-dom';
import {
  OktaAuth,
  toRelativeUrl
} from '@okta-dfuhriman/okta-auth-js';
import { Security } from '@okta-dfuhriman/okta-react';

import { HomePage } from './HomePage';
import { AuthProvider } from './providers';

import '@fontsource/public-sans';

const {
  VITE_OKTA_CLIENT_ID: clientId,
  VITE_OKTA_ISSUER: issuer,
  VITE_OKTA_SCOPES: SCOPES = 'openid email profile offline_access',
} = import.meta.env;

const scopes = Array.isArray(SCOPES) ? SCOPES : SCOPES.split(' ');

const oktaAuth = new OktaAuth({
  clientId,
  issuer,
  scopes,
  redirectUri: window.location.origin + '/login/callback',
  services: {
    autoRenew: true,
    autoRemove: true,
    syncStorage: false
  }
});

oktaAuth.start();

// This app uses react-router-dom v5.x because the Okta SDK does not yet support v6 :(
export const App = () => {

  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
  };

  return (
    <Security {...{ oktaAuth, restoreOriginalUri }}>
      <AuthProvider>
        <Route path="*">
          <HomePage />
        </Route>
      </AuthProvider>
    </Security>
  )
};
