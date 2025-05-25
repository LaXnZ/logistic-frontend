import React, { useEffect, useState } from "react";
import { useApiClient } from "../api/apiClient";
import TopPerformingCompanyCard from "./admin/TopPerformingCompanyCard";

function AdminDashboard() {
  const [records, setRecords] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const { fetchRecords, fetchCompanies } = useApiClient();

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
    <div
      className="p-6 mt-8 rounded-md"
      style={{ borderColor: "black", borderWidth: "0.5px" }}
    >
      <div>
        <div className="flex items-center gap-3 mb-4">
          <label className="text-gray-700 font-medium whitespace-nowrap">
            Filter by Company:
          </label>
          <select
            className="flex-1 border border-gray-300 rounded-sm px-3 py-2"
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="bg-blue-50 p-4 rounded-sm shadow">
            <p className="font-semibold">Total Companies</p>
            <p className="text-xl">{companies.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-sm shadow">
            <p className="font-semibold">Total Records</p>
            <p className="text-xl">{analytics.total}</p>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-2">
            Delivery Status Counts:
          </h4>
          <ul className="list-disc list-inside">
            {Object.entries(analytics.statusCounts).map(([status, count]) => (
              <li key={status}>
                <strong>{status}:</strong> {count}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-2">
            Latest Upload per Company:
          </h4>
          <ul className="list-disc list-inside">
            {Object.entries(analytics.latestUpload).map(([company, date]) => (
              <li key={company}>
                <strong>{company}:</strong> {date}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <p>
            <strong>Most Active Driver:</strong> {analytics.mostActiveDriver}
          </p>
          <p>
            <strong>Most Frequent Route:</strong> {analytics.mostFrequentRoute}
          </p>
        </div>
        <div
          className="p-6 mt-8 rounded-md"
          style={{ borderColor: "black", borderWidth: "0.5px" }}
        >
          {" "}
          <TopPerformingCompanyCard records={records} />
        </div>
        <hr />
      </div>
    </div>
  );
}

export default AdminDashboard;
