import React from "react";
import { useAuth } from "react-oidc-context";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";

function App() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = process.env.REACT_APP_COGNITO_CLIENT_ID;
    const logoutUri = process.env.REACT_APP_COGNITO_LOGOUT_URI;
    const cognitoDomain = process.env.REACT_APP_COGNITO_DOMAIN;

    auth.removeUser();
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };

  if (auth.isLoading) return <div>Loading authentication...</div>;
  if (auth.error) return <div>Authentication error: {auth.error.message}</div>;

  return (
    <Router>
      <div style={{ padding: "2rem" }}>
        <header style={{ marginBottom: "1rem" }}>
          {auth.isAuthenticated && (
            <>
              <span>👤 {auth.user?.profile.email}</span>
              <button onClick={signOutRedirect} style={{ marginLeft: "1rem" }}>
                Sign Out
              </button>
            </>
          )}
        </header>

        <Routes>
          <Route
            path="/"
            element={
              auth.isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <div>
                  <h2>XYZ Logistics Portal</h2>
                  <p>Please log in to access your dashboard.</p>
                  <button onClick={() => auth.signinRedirect()}>Sign In</button>
                </div>
              )
            }
          />
          <Route
            path="/dashboard"
            element={auth.isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
