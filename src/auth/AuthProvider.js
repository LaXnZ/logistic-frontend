import { AuthProvider } from "react-oidc-context";

const oidcConfig = {
  authority: process.env.REACT_APP_COGNITO_AUTHORITY,
  client_id: process.env.REACT_APP_COGNITO_CLIENT_ID,
  redirect_uri: process.env.REACT_APP_COGNITO_REDIRECT_URI,
  response_type: process.env.REACT_APP_COGNITO_RESPONSE_TYPE,
  scope: process.env.REACT_APP_COGNITO_SCOPE,
};

export const AuthWrapper = ({ children }) => (
  <AuthProvider {...oidcConfig}>{children}</AuthProvider>
);
