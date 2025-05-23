import React, { useEffect, useState, useMemo } from "react";
import { useApiClient } from "../api/apiClient";

function RecordsViewer({ user }) {
  const [records, setRecords] = useState([]);
  const { fetchRecords } = useApiClient();

  // ✅ Company ID mapping based on email domain
  const companyId = useMemo(() => {
    if (!user?.email) return null;

    const email = user.email.toLowerCase();
    const domain = email.split("@")[1];

    const domainToCompanyMap = {
      "gmail.com": "company-b",
      "placeholder.com": "company-b",
      "companyc.com": "company-c",
    };

    return domainToCompanyMap[domain] || "company-b"; // fallback
  }, [user?.email]);

  useEffect(() => {
    const loadRecords = async () => {
      if (!companyId) return;
      try {
        console.log("📡 Fetching records for:", companyId);
        const res = await fetchRecords(companyId);
        const data = res.data;

        let parsedRecords = [];
        if (Array.isArray(data)) {
          parsedRecords = data;
        } else if (typeof data === "string") {
          const parsed = JSON.parse(data);
          parsedRecords = parsed?.records || parsed?.body || [];
        } else if (typeof data === "object") {
          parsedRecords = data?.records || data?.body || [];
        }

        setRecords(Array.isArray(parsedRecords) ? parsedRecords : []);
      } catch (err) {
        console.error("❌ Error fetching records:", err);
      }
    };

    loadRecords();
  }, [companyId, fetchRecords]);

  return (
    <div>
      <h4>Processed Records</h4>
      {records.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Driver ID</th>
              <th>Route</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={i}>
                <td>{r.DriverID}</td>
                <td>{r.Route}</td>
                <td>{r.DeliveryStatus}</td>
                <td>{r.DeliveryDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RecordsViewer;
