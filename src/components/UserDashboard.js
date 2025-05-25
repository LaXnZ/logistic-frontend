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
  const [sortBy, setSortBy] = useState("date"); // default sort
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
      return new Date(b.DeliveryDate) - new Date(a.DeliveryDate); // newest first
    } else if (sortBy === "status") {
      return a.DeliveryStatus.localeCompare(b.DeliveryStatus);
    }
    return 0;
  });

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <div className="text-xl font-bold text-blue-500 text-center py-4">
        {companyDisplayName} Dashboard
      </div>

      {/* Main Content */}
      <main className="px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-10">
          <section className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-4">📤 Upload Your File</h3>
            <FileUpload companyId={companyId} />
          </section>

          <section className="bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">📋 Your Company Records</h3>
            </div>
            <RecordsViewer companyId={companyId} sortedData={sortedRecords} />
          </section>
        </div>
      </main>
    </div>
  );
}

export default UserDashboard;
