import React, { useState } from "react";

function RoutePerformanceSummary({ records }) {
  if (!records || records.length === 0) return null;

  const routeStats = records.reduce((acc, rec) => {
    const { Route, DeliveryStatus } = rec;
    if (!acc[Route]) acc[Route] = { completed: 0, total: 0 };
    acc[Route].total += 1;
    if (DeliveryStatus === "Completed") acc[Route].completed += 1;
    return acc;
  }, {});

  const sortedRoutes = Object.entries(routeStats).sort(
    (a, b) => b[1].total - a[1].total
  );
  const [filter, setFilter] = useState("top5");

  const filteredRoutes =
    filter === "top5"
      ? sortedRoutes.slice(0, 5)
      : filter === "all"
      ? sortedRoutes
      : sortedRoutes.filter(([route]) => route === filter);

  return (
    <div className="bg-white p-6 rounded-lg border border-green-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-green-800">
          🛣️ Route Performance Summary
        </h4>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 text-sm px-3 py-1 rounded-md focus:ring-2 focus:ring-green-200"
        >
          <option value="top5">Top 5</option>
          <option value="all">Show All</option>
          {sortedRoutes.map(([route]) => (
            <option key={route} value={route}>
              {route}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        {filteredRoutes.map(([route, stats]) => {
          const successRate = ((stats.completed / stats.total) * 100).toFixed(
            1
          );
          return (
            <div
              key={route}
              className="flex justify-between items-center bg-green-50 px-4 py-2 rounded text-sm text-green-900"
            >
              <span className="font-medium">{route}</span>
              <span className="font-semibold">
                {stats.completed}/{stats.total} completed ({successRate}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RoutePerformanceSummary;
