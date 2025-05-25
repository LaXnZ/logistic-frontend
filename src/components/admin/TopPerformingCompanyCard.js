import React from "react";

function TopCompanyCard({ records }) {
  const companyCount = records.reduce((acc, rec) => {
    if (rec.DeliveryStatus === "Completed") {
      acc[rec.CompanyName] = (acc[rec.CompanyName] || 0) + 1;
    }
    return acc;
  }, {});

  const topCompany = Object.entries(companyCount).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="bg-white p-2 rounded-xl ">
      <h4 className="font-semibold text-lg mb-2">🏆 Top Performing Company</h4>
      {topCompany ? (
        <p>
          <strong>{topCompany[0]}</strong> with <strong>{topCompany[1]}</strong>{" "}
          completed deliveries
        </p>
      ) : (
        <p>No completed deliveries found.</p>
      )}
    </div>
  );
}

export default TopCompanyCard;
