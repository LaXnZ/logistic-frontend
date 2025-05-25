import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const COLORS = [
  "#a5b4fc", // indigo-300
  "#fcd34d", // yellow-300
  "#fdba74", // orange-300
  "#6ee7b7", // green-300
  "#93c5fd", // blue-300
  "#f9a8d4", // pink-300
  "#c4b5fd", // violet-300
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
    <div className="bg-white p-4 rounded-lg border">
        <h4 className="text-lg font-semibold mb-4">
            🏢 Company Contribution Share
        </h4>
        <ResponsiveContainer width="100%" height={350}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="45%"
                    outerRadius={110}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent, x, y }) => (
                        <text
                            x={x}
                            y={y}
                            fontSize={12}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fill="#333"
                        >
                            {`${name}: ${percent}%`}
                        </text>
                    )}
                    labelLine={false}
                >
                    {data.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} records`} />
                <Legend
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '0.875rem' }}
                />
            </PieChart>
        </ResponsiveContainer>
    </div>
);
}

export default CompanyContributionShareCard;
