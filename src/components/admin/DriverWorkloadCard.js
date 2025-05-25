import React, { useState } from "react";

function DriverWorkloadCard({ records }) {
  if (!records || records.length === 0) return null;

  const driverCounts = records.reduce((acc, rec) => {
    acc[rec.DriverID] = (acc[rec.DriverID] || 0) + 1;
    return acc;
  }, {});

  const sortedDrivers = Object.entries(driverCounts).sort(
    (a, b) => b[1] - a[1]
  );
  const [filter, setFilter] = useState("top5");

  const filteredDrivers =
    filter === "top5"
      ? sortedDrivers.slice(0, 5)
      : filter === "all"
      ? sortedDrivers
      : sortedDrivers.filter(([driver]) => driver === filter);

  return (
    <div className="bg-white p-6 rounded-lg border border-green-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-green-800">
          🚛 Driver Workload
        </h4>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 text-sm px-3 py-1.5 rounded-md focus:ring-2 focus:ring-green-300"
        >
          <option value="top5">Top 5</option>
          <option value="all">Show All</option>
          {sortedDrivers.map(([driver]) => (
            <option key={driver} value={driver}>
              {driver}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        {filteredDrivers.map(([driver, count]) => (
          <div
            key={driver}
            className="flex justify-between items-center px-4 py-2 bg-green-50 hover:bg-green-100 rounded-md transition"
          >
            <span className="text-green-800 font-medium">{driver}</span>
            <span className="text-green-700 font-semibold">
              {count} deliveries
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DriverWorkloadCard;
