import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function DailyUploadTrendChart({ records }) {
  if (!records || records.length === 0) return null;

  const allDates = records.map((r) => r.DeliveryDate);
  const minDate = new Date(Math.min(...allDates.map((d) => new Date(d))));
  const maxDate = new Date(Math.max(...allDates.map((d) => new Date(d))));

  const [startDate, setStartDate] = useState(
    minDate.toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState(maxDate.toISOString().slice(0, 10));

  // Filter records by date range
  const filteredData = useMemo(() => {
    const dateCounts = {};
    records.forEach((rec) => {
      const date = rec.DeliveryDate;
      if (date >= startDate && date <= endDate) {
        dateCounts[date] = (dateCounts[date] || 0) + 1;
      }
    });

    return Object.entries(dateCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [records, startDate, endDate]);

return (
    <div className="bg-white p-4 rounded-lg border">
        <h4 className="font-semibold text-lg mb-2">📅 Daily Upload Trend</h4>

        <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="text-sm font-medium text-gray-700">Date Range:</span>
            <div className="flex items-center gap-2">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border px-2 py-1 rounded text-sm"
                />
                <span className="text-gray-500">to</span>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border px-2 py-1 rounded text-sm"
                />
            </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
            <LineChart
                data={filteredData}
                margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="date"
                    angle={-45}
                    textAnchor="end"
                    interval="preserveStartEnd"
                    tick={{ fontSize: 12 }}
                    tickFormatter={date => {
                        const d = new Date(date);
                        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                    }}
                />

                <YAxis
                    tick={{ fontSize: 12 }}
                    label={{
                        value: "Deliveries",
                        angle: -90,
                        position: "insideLeft",
                        offset: 10,
                    }}
                />
                <Tooltip
                    labelFormatter={date => {
                        const d = new Date(date);
                        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                    }}
                />
                <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    strokeWidth={2}
                />
            </LineChart>
        </ResponsiveContainer>
    </div>
);
}

export default DailyUploadTrendChart;
