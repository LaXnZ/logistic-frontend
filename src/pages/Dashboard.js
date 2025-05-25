import React, { useState } from "react";
import FileUpload from "../components/FileUpload";
import RecordsViewer from "../components/RecordsViewer";
import AdminDashboard from "../components/AdminDashboard";
import { useAuth } from "react-oidc-context";

function Dashboard() {
  const auth = useAuth();
  const companyId = auth.user?.profile.email.split("@")[1].split(".")[0];
  const [activeSection, setActiveSection] = useState("analytics");

  const navButtonStyle = (active) =>
    `px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
      active
        ? "bg-green-500 text-white shadow"
        : "bg-green-100 text-green-900 hover:bg-green-200"
    }`;

  return (
    <div className="min-h-screen bg-green-50 py-10 px-4 border border-green-200 rounded-lg ">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome,{" "}
            <span className="text-green-600">{auth.user?.profile.email}</span>
          </h1>
        </header>

        {/* Navigation */}
        <nav className="flex justify-center space-x-4">
          <button
            className={navButtonStyle(activeSection === "analytics")}
            onClick={() => setActiveSection("analytics")}
          >
            📊 Admin Analytics
          </button>
          <button
            className={navButtonStyle(activeSection === "upload")}
            onClick={() => setActiveSection("upload")}
          >
            📤 Upload File
          </button>
          <button
            className={navButtonStyle(activeSection === "records")}
            onClick={() => setActiveSection("records")}
          >
            📋 View Records
          </button>
        </nav>

        {/* Sections */}
        <main className="space-y-10">
          {activeSection === "analytics" && (
            <section className="bg-white p-6 rounded-lg border border-green-200 shadow">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                📊 Admin Analytics
              </h2>
              <AdminDashboard companyId={companyId} />
            </section>
          )}
          {activeSection === "upload" && (
            <section className="bg-white p-6 rounded-lg border border-green-200 shadow">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                📤 Upload File
              </h2>
              <FileUpload companyId={companyId} />
            </section>
          )}
          {activeSection === "records" && (
            <section className="bg-white p-6 rounded-lg border border-green-200 shadow">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                📋 View Records
              </h2>
              <RecordsViewer user={auth.user?.profile} />
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
