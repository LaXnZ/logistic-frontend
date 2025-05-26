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
      <div className="min-h-screen flex items-center justify-center text-lg text-green-800">
        Authenticating...
      </div>
    );

  if (auth.error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg">
        Authentication error: {auth.error.message}
      </div>
    );

  const groups = auth.user?.profile["cognito:groups"] || [];
  const isAdmin = groups.includes("Admins");

  return (
    <Router>
      <div className="min-h-screen bg-green-50 text-gray-800">
        {/* Header */}
        <header className="bg-white shadow-md border-b border-green-200 p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-green-800 bg-green-100 px-4 py-2 rounded-md border border-green-300">
            XYZ Logistics Portal
          </h1>
          {auth.isAuthenticated && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                👤 {auth.user?.profile.email}
              </span>
              <button
                onClick={signOutRedirect}
                className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Sign Out
              </button>
            </div>
          )}
        </header>

        {/* Main */}
        <main className="p-6">
          <Routes>
            <Route
              path="/"
              element={
                auth.isAuthenticated ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow border border-green-200 text-center space-y-5">
                    <h2 className="text-2xl font-bold text-green-700">
                      Welcome to XYZ Logistics
                    </h2>
                    <p className="text-gray-600">
                      Please sign in to access your dashboard.
                    </p>
                    <button
                      onClick={() => auth.signinRedirect()}
                      className="mt-6 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md text-sm font-medium shadow-md border border-green-600 transition-all"
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
                  isAdmin ? (
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
