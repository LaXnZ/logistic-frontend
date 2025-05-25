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
    "0-2 days (recent)": "bg-green-50 text-green-800",
    "3-5 days (moderate delay)": "bg-yellow-50 text-yellow-800",
    "6-10 days (significant delay)": "bg-orange-50 text-orange-800",
    "11+ days (critical delay)": "bg-red-50 text-red-800",
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-green-100 shadow-sm">
      <h4 className="text-lg font-semibold mb-2 text-green-800">
        ⏳ Pending Deliveries Aging Report
      </h4>
      <p className="text-sm text-gray-600 mb-4">
        Breakdown of pending deliveries based on how long they've been delayed.
      </p>
      <ul className="space-y-3">
        {Object.entries(agingBuckets).map(([label, group]) => (
          <li
            key={label}
            className={`flex justify-between items-center px-4 py-2 rounded border border-gray-200 ${BUCKET_COLORS[label]}`}
            title={
              group.length > 0
                ? group
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
            <span className="font-semibold">{group.length} pending</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PendingDeliveriesAgingReport;
