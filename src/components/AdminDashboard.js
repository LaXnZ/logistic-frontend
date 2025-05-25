import React, { useEffect, useState, useRef } from "react";
import { useApiClient } from "../api/apiClient";
import TopPerformingCompanyCard from "./admin/TopPerformingCompanyCard";
import DeliverySuccessRateCard from "./admin/DeliverySuccessRateCard";
import DriverWorkloadCard from "./admin/DriverWorkloadCard";
import DailyUploadTrendChart from "./admin/DailyUploadTrendChart";
import RoutePerformanceSummary from "./admin/RoutePerformanceSummary";
import CompanyContributionShareCard from "./admin/CompanyContributionShareCard";
import StatusProgressBreakdownCard from "./admin/StatusProgressBreakdownCard";
import DeliveryVolumeHeatmap from "./admin/DeliveryVolumeHeatmap";
import PendingDeliveriesAgingReport from "./admin/PendingDeliveriesAgingReport";
import DownloadAnalyticsReportButton from "./admin/DownloadAnalyticsReportButton";

function AdminDashboard() {
  const [records, setRecords] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const { fetchRecords, fetchCompanies } = useApiClient();

  const chartRefs = {
    topCompanyRef: useRef(),
    deliverySuccessRef: useRef(),
    driverWorkloadRef: useRef(),
    dailyUploadTrendRef: useRef(),
    routePerformanceRef: useRef(),
    companyContributionRef: useRef(),
    statusProgressRef: useRef(),
    deliveryVolumeRef: useRef(),
    pendingAgingRef: useRef(),
  };

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const res = await fetchCompanies();
        const body =
          typeof res.data?.body === "string"
            ? JSON.parse(res.data.body)
            : res.data?.body || res.data;
        setCompanies(body?.companies || []);
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
    <div className="p-8 rounded-lg bg-white "  style={{ borderColor: "black", borderWidth: "0.5px" }}>
      <div className="flex items-center gap-4 mb-6">
        <label className="text-gray-700 font-semibold whitespace-nowrap">
          Filter by Company:
        </label>
        <select
          className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          <option value="">-- All Companies --</option>
          {companies.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div id="analytics-section">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          <div className="bg-green-100 p-6 rounded-lg border flex flex-col items-center">
            <p className="font-semibold text-green-900">Total Companies</p>
            <p className="text-3xl font-bold text-green-700 mt-2">{companies.length}</p>
          </div>
          <div className="bg-green-100 p-6 rounded-lg border flex flex-col items-center">
            <p className="font-semibold text-green-900">Total Records</p>
            <p className="text-3xl font-bold text-green-800 mt-2">{analytics.total}</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-3 text-gray-800">Delivery Status Counts</h4>
            <ul className="list-disc list-inside space-y-1 pl-4">
              {Object.entries(analytics.statusCounts).map(([status, count]) => (
                <li key={status} className="text-gray-700">
                  <span className="font-medium">{status}:</span> {count}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3 text-gray-800">Latest Upload per Company</h4>
            <ul className="list-disc list-inside space-y-1 pl-4">
              {Object.entries(analytics.latestUpload).map(([company, date]) => (
                <li key={company} className="text-gray-700">
                  <span className="font-medium">{company}:</span> {date}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-6">
          <div className="bg-green-50 p-4 rounded-lg flex-1 border">
            <p className="text-gray-700">
              <span className="font-semibold">Most Active Driver:</span>{" "}
              <span className="text-green-700">{analytics.mostActiveDriver || "N/A"}</span>
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg flex-1 border">
            <p className="text-gray-700">
              <span className="font-semibold">Most Frequent Route:</span>{" "}
              <span className="text-green-700">{analytics.mostFrequentRoute || "N/A"}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div ref={chartRefs.topCompanyRef}><TopPerformingCompanyCard records={records} /></div>
          <div ref={chartRefs.deliverySuccessRef}><DeliverySuccessRateCard records={records} /></div>
          <div ref={chartRefs.driverWorkloadRef}><DriverWorkloadCard records={records} /></div>
          <div ref={chartRefs.dailyUploadTrendRef}><DailyUploadTrendChart records={records} /></div>
          <div ref={chartRefs.routePerformanceRef}><RoutePerformanceSummary records={records} /></div>
          <div ref={chartRefs.companyContributionRef}><CompanyContributionShareCard records={records} /></div>
          <div ref={chartRefs.statusProgressRef}><StatusProgressBreakdownCard records={records} /></div>
          <div ref={chartRefs.deliveryVolumeRef}><DeliveryVolumeHeatmap records={records} /></div>
          <div ref={chartRefs.pendingAgingRef}><PendingDeliveriesAgingReport records={records} /></div>
        </div>
      </div>

      <DownloadAnalyticsReportButton
        analytics={analytics}
        companies={companies}
        records={records}
        adminEmail="sumudithalanz@gmail.com"
        chartRefs={chartRefs}
      />
    </div>
  );
}

export default AdminDashboard;
