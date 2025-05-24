import React from "react";
import FileUpload from "../components/FileUpload";
import RecordsViewer from "../components/RecordsViewer";
import AdminDashboard from "../components/AdminDashboard";
import { useAuth } from "react-oidc-context";

function Dashboard() {
  const auth = useAuth();
  const companyId = auth.user?.profile.email.split("@")[1].split(".")[0];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome,{" "}
            <span className="text-blue-400">{auth.user?.profile.email}</span>
          </h1>
        </header>

        {/* Main Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Admin Dashboard */}
          <div className="lg:w-1/2 w-full">
            <section className="bg-white p-6 rounded-xl shadow-md h-full">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                📊 Admin Analytics
              </h2>
              <AdminDashboard companyId={companyId} />
            </section>
          </div>

          {/* Right: Upload + Records */}
          <div className="lg:w-1/2 w-full flex flex-col gap-8">
            <section className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                📤 Upload Excel File
              </h2>
              <FileUpload companyId={companyId} />
            </section>

            <section className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                📋 View Records
              </h2>
              <RecordsViewer user={auth.user?.profile} />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
