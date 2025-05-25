import React from "react";

const VALID_COMPANY_IDS = [
  "company-a",
  "company-b",
  "company-c",
  "company-d",
  "company-ixs"
];

function normalizeCompanyName(name) {
  if (!name) return "Unknown";
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}

function DeliverySuccessRateCard({ records }) {
  if (!records || records.length === 0) return null;

  const statusCounts = {};
  const companyStats = {};

  records.forEach((rec) => {
    const status = rec.DeliveryStatus;
    const normalized = normalizeCompanyName(rec.CompanyName);
    const isValid = VALID_COMPANY_IDS.includes(normalized);
    const company = isValid ? normalized : null;

    if (!company) return;

    statusCounts[status] = (statusCounts[status] || 0) + 1;

    if (!companyStats[company]) {
      companyStats[company] = { completed: 0, total: 0 };
    }

    companyStats[company].total += 1;
    if (status === "Completed") {
      companyStats[company].completed += 1;
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
  const overallRate = (overallCompleted / overallTotal) * 100;

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="font-semibold text-lg mb-2">
        
        📊 Delivery Success Rate
      </h3>
      <div className="mb-4 flex items-center gap-2">
        <span className="text-gray-600 font-medium">Overall:</span>
        <span className="text-green-600 font-semibold text-lg">
          {overallRate.toFixed(1)}%
        </span>
      </div>
      <div className="space-y-2">
        {Object.entries(companyStats).map(([company, stats]) => {
          const rate = (stats.completed / stats.total) * 100;
          const label = company.replace(/-/g, " ").toUpperCase();
          return (
            <div
              key={company}
              className="flex items-center justify-between bg-gray-50 rounded px-3 py-2"
            >
              <span className="font-medium text-gray-700">{label}</span>
              <span
                className={`font-semibold ${
                  rate >= 70
                    ? "text-green-600"
                    : rate >= 40
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
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
