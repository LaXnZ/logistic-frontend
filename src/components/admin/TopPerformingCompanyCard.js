import React from "react";

function TopCompanyCard({ records }) {
  const companyCount = records.reduce((acc, rec) => {
    if (rec.DeliveryStatus === "Completed") {
      acc[rec.CompanyName] = (acc[rec.CompanyName] || 0) + 1;
    }
    return acc;
  }, {});

  const topCompany = Object.entries(companyCount).sort(
    (a, b) => b[1] - a[1]
  )[0];

  return (
    <div className="bg-white p-6 rounded-lg border border-green-100 shadow-sm">
      <h4 className="text-lg font-semibold text-green-800 mb-3">
        🏆 Top Performing Company
      </h4>
      {topCompany ? (
        <div className="text-gray-700">
          <p className="text-sm">
            The company with the highest number of completed deliveries:
          </p>
          <p className="mt-2 text-lg font-bold text-green-700">
            {topCompany[0]}
          </p>
          <p className="text-sm font-medium text-gray-600">
            {topCompany[1]} deliveries completed
          </p>
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No completed deliveries found.</p>
      )}
    </div>
  );
}

export default TopCompanyCard;
