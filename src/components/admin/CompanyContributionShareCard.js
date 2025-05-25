import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  
  "#fcd34d", // yellow-300
  "#93c5fd", // blue-300
  "#f9a8d4", // pink-300
  "#c4b5fd", // violet-300
  "#fdba74", // orange-300
  "#a5b4fc", // indigo-300
];

function normalizeCompany(name) {
  return name?.trim()?.toLowerCase()?.replace(/\s+/g, "-");
}

const VALID_COMPANY_IDS = [
  "company-a",
  "company-b",
  "company-c",
  "company-d",
  "company-ixs",
];

function CompanyContributionShareCard({ records }) {
  if (!records || records.length === 0) return null;

  const contribution = {};

  records.forEach((rec) => {
    const norm = normalizeCompany(rec.CompanyName);
    if (!VALID_COMPANY_IDS.includes(norm)) return;
    contribution[norm] = (contribution[norm] || 0) + 1;
  });

  const total = Object.values(contribution).reduce((sum, val) => sum + val, 0);

  const data = Object.entries(contribution).map(([name, count]) => ({
    name: name.replace(/-/g, " ").toUpperCase(),
    value: count,
    percent: ((count / total) * 100).toFixed(1),
  }));

  return (
    <div className="bg-white p-6 rounded-xl border border-green-100 shadow-sm">
      <h4 className="text-lg font-semibold mb-4 text-green-800">
        🏢 Company Contribution Share
      </h4>
      <ResponsiveContainer width="100%" height={360}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            outerRadius={110}
            dataKey="value"
            label={({ name, percent }) => `${name}: ${percent}%`}
            labelLine={false}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `${value} records`}
            contentStyle={{
              fontSize: "0.875rem",
              borderRadius: "6px",
            }}
          />
          <Legend
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{ fontSize: "0.875rem", marginTop: "12px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CompanyContributionShareCard;
