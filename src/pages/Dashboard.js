import React from "react";
import FileUpload from "../components/FileUpload";
import RecordsViewer from "../components/RecordsViewer";
import AdminDashboard from "../components/AdminDashboard";
import { useAuth } from "react-oidc-context";

import { useState } from "react";

function Dashboard() {
  const auth = useAuth();
  const companyId = auth.user?.profile.email.split("@")[1].split(".")[0];
  const [activeSection, setActiveSection] = useState("analytics");

  return (
    <div >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome,{" "}
            <span className="text-blue-400">{auth.user?.profile.email}</span>
          </h1>
        </header>
        {/* Navigation Menu */}
        <nav className="flex justify-center mb-8 space-x-4">
          <button
            className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 border focus:outline-none"
            onClick={() => setActiveSection("analytics")}
          >
            📊 Admin Analytics
          </button>
          <button
            className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 border focus:outline-none"
            onClick={() => setActiveSection("upload")}
          >
            📤 Upload File
          </button>
          <button
            className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 border focus:outline-none"
            onClick={() => setActiveSection("records")}
          >
            📋 View Records
          </button>
        </nav>

        {/* Main Content */}
        <div>
          {activeSection === "analytics" && (
            <section className="bg-white p-6 rounded-lg border mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                📊 Admin Analytics
              </h2>
              <AdminDashboard companyId={companyId} />
            </section>
          )}
          {activeSection === "upload" && (
            <section className="bg-white p-6 rounded-lg border mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                📤 Upload File
              </h2>
              <FileUpload companyId={companyId} />
            </section>
          )}
          {activeSection === "records" && (
            <section className="bg-white p-6 rounded-lg border mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                📋 View Records
              </h2>
              <RecordsViewer user={auth.user?.profile} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
