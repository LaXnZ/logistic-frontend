import React, { useEffect, useState } from "react";
import { useApiClient } from "../api/apiClient";
import FileUpload from "../components/FileUpload";
import RecordsViewer from "../components/RecordsViewer";

function UserDashboard({ email }) {
  const USER_COMPANY_MAP = {
    "lanzsumuditha@gmail.com": "company-ixs",
    "lanzbutsmurf@gmail.com": "company-b",
  };

  const companyId =
    USER_COMPANY_MAP[email] || email.split("@")[1].split(".")[0];
  const companyDisplayName = companyId.replace(/-/g, " ").toUpperCase();

  const [companyRecords, setCompanyRecords] = useState([]);
  const [sortBy, setSortBy] = useState("date");
  const { fetchRecords } = useApiClient();

  useEffect(() => {
    const loadRecords = async () => {
      try {
        const res = await fetchRecords(companyId);
        const parsed =
          typeof res.data.body === "string"
            ? JSON.parse(res.data.body)
            : res.data.body || res.data;
        setCompanyRecords(parsed.records || []);
      } catch (err) {
        console.error("❌ Error loading user records:", err);
      }
    };

    loadRecords();
  }, [companyId]);

  const sortedRecords = [...companyRecords].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.DeliveryDate) - new Date(a.DeliveryDate);
    } else if (sortBy === "status") {
      return a.DeliveryStatus.localeCompare(b.DeliveryStatus);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-green-50 py-10 px-4 border border-green-200 rounded-lg">
      {/* Header */}
      <header className=" py-6 text-center">
        <h1 className="text-3xl font-bold text-green-600">
          {companyDisplayName} Dashboard
        </h1>
        <p className="text-green-900 text-md mt-1">Welcome to your logistics panel</p>
      </header>

      {/* Main Content */}
      <main className="px-4 py-4">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Upload Section */}
          <section className="bg-white p-6 rounded-xl border border-green-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-green-800">
              📤 Upload Your File
            </h2>
            <FileUpload companyId={companyId} />
          </section>

          {/* Records Section */}
          <section className="bg-white p-6 rounded-xl border border-green-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-green-800">
                📋 Your Company Records
              </h2>
            </div>
            <RecordsViewer companyId={companyId} sortedData={sortedRecords} />
          </section>
        </div>
      </main>
    </div>
  );
}

export default UserDashboard;
