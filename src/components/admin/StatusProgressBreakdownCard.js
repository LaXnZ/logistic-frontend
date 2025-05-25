import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const STATUS_COLORS = {
  Completed: "#a7f3d0", // green-200
  Pending: "#fde68a", // yellow-200
  "In Transit": "#bfdbfe", // blue-200
};

const normalizeCompany = (name) =>
  name?.trim()?.toLowerCase()?.replace(/\s+/g, "-");

const VALID_COMPANY_IDS = [
  "company-a",
  "company-b",
  "company-c",
  "company-d",
  "company-ixs",
];

function StatusProgressBreakdownCard({ records }) {
  if (!records || records.length === 0) return null;

  const companyStatusMap = {};

  records.forEach((rec) => {
    const status = rec.DeliveryStatus;
    const normCompany = normalizeCompany(rec.CompanyName);
    if (!VALID_COMPANY_IDS.includes(normCompany)) return;

    if (!companyStatusMap[normCompany]) {
      companyStatusMap[normCompany] = {
        company: normCompany.replace(/-/g, " ").toUpperCase(),
        Completed: 0,
        Pending: 0,
        "In Transit": 0,
      };
    }

    if (companyStatusMap[normCompany][status] !== undefined) {
      companyStatusMap[normCompany][status]++;
    }
  });

  const data = Object.values(companyStatusMap);

  return (
    <div className="bg-white p-6 rounded-lg border border-green-100 shadow-sm">
      <h4 className="text-lg font-semibold mb-4 text-green-800">
        📊 Status Progress Breakdown by Company
      </h4>
      <ResponsiveContainer width="100%" height={380}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="company"
            angle={-20}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            label={{
              value: "Deliveries",
              angle: -90,
              position: "insideLeft",
              offset: 10,
              fontSize: 12,
            }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip formatter={(val) => `${val} deliveries`} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {Object.keys(STATUS_COLORS).map((status) => (
            <Bar
              key={status}
              dataKey={status}
              stackId="a"
              fill={STATUS_COLORS[status]}
              radius={[4, 4, 0, 0]}
            >
              <LabelList
                dataKey={status}
                position="top"
                formatter={(val) => (val > 0 ? val : "")}
                style={{ fontSize: 11 }}
              />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StatusProgressBreakdownCard;
