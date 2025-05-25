import React, { useMemo } from "react";
import { differenceInDays, parseISO, format } from "date-fns";

function PendingDeliveriesAgingReport({ records }) {
  if (!records || records.length === 0) return null;

  const today = new Date();

  const agingBuckets = useMemo(() => {
    const buckets = {
      "0-2 days (recent)": [],
      "3-5 days (moderate delay)": [],
      "6-10 days (significant delay)": [],
      "11+ days (critical delay)": [],
    };

    records.forEach((rec) => {
      if (rec.DeliveryStatus !== "Pending") return;

      const deliveryDate = parseISO(rec.DeliveryDate);
      const age = differenceInDays(today, deliveryDate);

      if (age <= 2) buckets["0-2 days (recent)"].push(rec);
      else if (age <= 5) buckets["3-5 days (moderate delay)"].push(rec);
      else if (age <= 10) buckets["6-10 days (significant delay)"].push(rec);
      else buckets["11+ days (critical delay)"].push(rec);
    });

    return buckets;
  }, [records]);

  const BUCKET_COLORS = {
    "0-2 days (recent)": "bg-green-100",
    "3-5 days (moderate delay)": "bg-yellow-100",
    "6-10 days (significant delay)": "bg-orange-100",
    "11+ days (critical delay)": "bg-red-100",
  };

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h4 className="text-lg font-semibold mb-2">⏳ Pending Deliveries Aging Report</h4>
      <p className="text-sm text-gray-600 mb-4">
        Shows how long pending deliveries have been waiting, grouped by how old they are.
      </p>
      <ul className="space-y-2">
        {Object.entries(agingBuckets).map(([label, records]) => (
          <li
            key={label}
            className={`flex justify-between items-center px-4 py-2 rounded ${BUCKET_COLORS[label]}`}
            title={
              records.length > 0
                ? records
                    .map(
                      (r) =>
                        `${r.DriverID || "Unknown"} on ${format(
                          parseISO(r.DeliveryDate),
                          "yyyy-MM-dd"
                        )}`
                    )
                    .join(", ")
                : "No pending deliveries in this range"
            }
          >
            <span className="font-medium">{label}</span>
            <span className="font-semibold text-gray-800">{records.length} pending</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PendingDeliveriesAgingReport;
