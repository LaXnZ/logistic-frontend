import React, { useMemo } from "react";
import {
  eachDayOfInterval,
  format,
  parseISO,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

const COLOR_SCALE = [
  "#ecfdf5", // 0 - pastel greenish-white
  "#bbf7d0", // 1-2 - light mint
  "#86efac", // 3-4 - mint
  "#4ade80", // 5-6 - green
  "#22c55e", // 7+ - deep green
];

function getColor(count) {
  if (count >= 7) return COLOR_SCALE[4];
  if (count >= 5) return COLOR_SCALE[3];
  if (count >= 3) return COLOR_SCALE[2];
  if (count >= 1) return COLOR_SCALE[1];
  return COLOR_SCALE[0];
}

function DeliveryVolumeHeatmap({ records }) {
  if (!records || records.length === 0) return null;

  const dateCounts = useMemo(() => {
    const map = {};
    records.forEach((rec) => {
      const date = rec.DeliveryDate;
      map[date] = (map[date] || 0) + 1;
    });
    return map;
  }, [records]);

  const allDates = Object.keys(dateCounts).map((d) => parseISO(d));
  const minDate = startOfWeek(startOfMonth(new Date(Math.min(...allDates))));
  const maxDate = endOfWeek(endOfMonth(new Date(Math.max(...allDates))));

  const days = eachDayOfInterval({ start: minDate, end: maxDate });
  const currentMonth = format(
    new Date(Math.min(...allDates.map((d) => d.getTime()))),
    "MMMM yyyy"
  );

  return (
    <div className="bg-white p-6 rounded-lg border border-green-100 shadow-sm">
      <h3 className="text-lg font-semibold text-green-800 mb-2">
        🌡️ Delivery Volume Heatmap
      </h3>
      <p className="text-sm text-gray-600 mb-4">{currentMonth}</p>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-2 font-medium">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date) => {
          const key = format(date, "yyyy-MM-dd");
          const count = dateCounts[key] || 0;
          const dayNum = format(date, "d");

          return (
            <div
              key={key}
              className="relative h-12 w-full rounded flex items-center justify-center text-xs shadow-sm transition"
              title={`${key}: ${count} deliveries`}
              style={{ backgroundColor: getColor(count) }}
            >
              <span className="absolute top-1 left-1 text-[10px] text-gray-600">
                {dayNum}
              </span>
              {count > 0 && (
                <span className="text-[11px] font-medium text-gray-800">
                  {count}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DeliveryVolumeHeatmap;
