import React from "react";

const VALID_COMPANY_IDS = [
  "company-a",
  "company-b",
  "company-c",
  "company-d",
  "company-ixs",
];

function normalizeCompanyName(name) {
  if (!name) return "Unknown";
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}

function DeliverySuccessRateCard({ records }) {
  if (!records || records.length === 0) return null;

  const companyStats = {};

  records.forEach((rec) => {
    const status = rec.DeliveryStatus;
    const normalized = normalizeCompanyName(rec.CompanyName);
    if (!VALID_COMPANY_IDS.includes(normalized)) return;

    if (!companyStats[normalized]) {
      companyStats[normalized] = { completed: 0, total: 0 };
    }

    companyStats[normalized].total += 1;
    if (status === "Completed") {
      companyStats[normalized].completed += 1;
    }
  });

  const overallCompleted = Object.values(companyStats).reduce(
    (sum, c) => sum + c.completed,
    0
  );
  const overallTotal = Object.values(companyStats).reduce(
    (sum, c) => sum + c.total,
    0
  );
  const overallRate = overallTotal > 0 ? (overallCompleted / overallTotal) * 100 : 0;

  return (
    <div className="bg-white p-6 rounded-xl border border-green-100 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-green-800">📊 Delivery Success Rate</h3>

      <div className="mb-5 flex items-center gap-2">
        <span className="text-gray-600 font-medium">Overall:</span>
        <span className="text-green-700 font-semibold text-lg">
          {overallRate.toFixed(1)}%
        </span>
      </div>

      <div className="space-y-3">
        {Object.entries(companyStats).map(([company, stats]) => {
          const rate = (stats.completed / stats.total) * 100;
          const label = company.replace(/-/g, " ").toUpperCase();
          const rateColor =
            rate >= 70
              ? "text-green-700"
              : rate >= 40
              ? "text-yellow-600"
              : "text-red-500";

          return (
            <div
              key={company}
              className="flex items-center justify-between bg-green-50 px-4 py-2 rounded-md border border-green-100"
            >
              <span className="text-gray-800 font-medium">{label}</span>
              <span className={`font-semibold ${rateColor}`}>
                {rate.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DeliverySuccessRateCard;
