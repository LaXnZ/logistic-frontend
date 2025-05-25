import React from "react";
import { useAuth } from "react-oidc-context";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./components/UserDashboard";

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

  if (auth.isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading authentication...
      </div>
    );

  if (auth.error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg">
        Authentication error: {auth.error.message}
      </div>
    );

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1
            className="text-xl font-semibold p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors"
            style={{ borderColor: "black", borderWidth: "0.5px" }}
          >
            XYZ Logistics Portal
          </h1>
          {auth.isAuthenticated && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                👤 {auth.user?.profile.email}
              </span>
              <button
                onClick={signOutRedirect}
                className="px-4 py-1 bg-red-400 text-white rounded hover:bg-red-500"
              >
                Sign Out
              </button>
            </div>
          )}
        </header>

        <main className="p-6">
          <Routes>
            <Route
              path="/"
              element={
                auth.isAuthenticated ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-md text-center space-y-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Welcome to XYZ Logistics
                    </h2>
                    <p className="text-gray-600">
                      Please log in to access your dashboard.
                    </p>
                    <button
                      onClick={() => auth.signinRedirect()}
                      className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Sign In
                    </button>
                  </div>
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                auth.isAuthenticated ? (
                  auth.user?.profile.email === "sumudithalanz@gmail.com" ? (
                    <Dashboard />
                  ) : (
                    <UserDashboard email={auth.user?.profile.email} />
                  )
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
