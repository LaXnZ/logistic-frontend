import React, { useEffect, useState } from "react";
import { useApiClient } from "../api/apiClient";

function AdminDashboard() {
  const [records, setRecords] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const { fetchRecords, fetchCompanies } = useApiClient();

  // ✅ Load companies first
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const res = await fetchCompanies();
        const body =
          typeof res.data?.body === "string"
            ? JSON.parse(res.data.body)
            : res.data?.body || res.data;

        const list = body?.companies || [];
        setCompanies(list);
      } catch (err) {
        console.error("❌ Failed to load companies:", err);
      }
    };

    loadCompanies();
  }, []);

  // ✅ Load records — for all companies if none selected
  useEffect(() => {
    const loadData = async () => {
      try {
        if (selectedCompany) {
          const res = await fetchRecords(selectedCompany);
          const parsed =
            typeof res.data?.body === "string"
              ? JSON.parse(res.data.body)
              : res.data?.body || res.data;

          setRecords(parsed.records || []);
        } else {
          const allResponses = await Promise.all(companies.map(fetchRecords));
          const allRecords = allResponses.flatMap((r) => {
            const parsed =
              typeof r.data?.body === "string"
                ? JSON.parse(r.data.body)
                : r.data?.body || r.data;

            return Array.isArray(parsed?.records) ? parsed.records : [];
          });
          setRecords(allRecords);
        }
      } catch (err) {
        console.error("❌ Failed to load records:", err);
        setRecords([]);
      }
    };

    if (companies.length > 0) {
      loadData();
    }
  }, [companies, selectedCompany]);

  // 🔍 Calculate analytics from current records
  const getAnalytics = () => {
    const total = records.length;
    const statusCounts = {};
    const latestUpload = {};
    const routeCounts = {};
    const driverCounts = {};

    records.forEach((rec) => {
      if (!rec) return;
      statusCounts[rec.DeliveryStatus] =
        (statusCounts[rec.DeliveryStatus] || 0) + 1;
      driverCounts[rec.DriverID] = (driverCounts[rec.DriverID] || 0) + 1;
      routeCounts[rec.Route] = (routeCounts[rec.Route] || 0) + 1;

      const date = rec.DeliveryDate;
      const company = rec.CompanyName;
      if (!latestUpload[company] || date > latestUpload[company]) {
        latestUpload[company] = date;
      }
    });

    const mostActiveDriver = Object.entries(driverCounts).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0];
    const mostFrequentRoute = Object.entries(routeCounts).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0];

    return {
      total,
      statusCounts,
      latestUpload,
      mostActiveDriver,
      mostFrequentRoute,
    };
  };

  const analytics = getAnalytics();

  return (
    <div>
      <h3>📊 Admin Dashboard</h3>

      <label>
        Filter by Company:{" "}
        <select
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          <option value="">-- All Companies --</option>
          {companies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <div style={{ marginTop: "1rem" }}>
        <p>
          <strong>Total Companies:</strong> {companies.length}
        </p>
        <p>
          <strong>Total Records:</strong> {analytics.total}
        </p>

        <p>
          <strong>Delivery Status Counts:</strong>
        </p>
        <ul>
          {Object.entries(analytics.statusCounts).map(([status, count]) => (
            <li key={status}>
              {status}: {count}
            </li>
          ))}
        </ul>

        <p>
          <strong>Latest Upload per Company:</strong>
        </p>
        <ul>
          {Object.entries(analytics.latestUpload).map(([company, date]) => (
            <li key={company}>
              {company}: {date}
            </li>
          ))}
        </ul>

        <p>
          <strong>Most Active Driver:</strong> {analytics.mostActiveDriver}
        </p>
        <p>
          <strong>Most Frequent Route:</strong> {analytics.mostFrequentRoute}
        </p>
      </div>
    </div>
  );
}

export default AdminDashboard;
