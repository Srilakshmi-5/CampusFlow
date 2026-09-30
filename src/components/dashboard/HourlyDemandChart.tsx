"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getFacilityHourlyForecast } from "@/lib/intelligence/demand-prediction";
import { useCampusStore } from "@/lib/store/campus-data-store";
import { TrendingUp, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function HourlyDemandChart() {
  const { isPeakRushSimulated, isExamSpikeSimulated } = useCampusStore();
  const [selectedFacility, setSelectedFacility] = useState<"canteen" | "library" | "admin" | "fees">("canteen");

  const forecast = getFacilityHourlyForecast(selectedFacility, isExamSpikeSimulated);

  // If rush simulated and canteen selected, elevate midday peak
  const chartData = forecast.map((f) => {
    let occ = f.occupancyPercent;
    if (selectedFacility === "canteen" && isPeakRushSimulated && (f.hour === 12 || f.hour === 13)) {
      occ = Math.min(98, occ + 10);
    }
    return {
      time: f.timeLabel,
      occupancy: occ,
      capacityBaseline: 65,
    };
  });

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <h4 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">
              Demand Prediction Curve (Historical Average + Peak Multipliers)
            </h4>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Hourly resource occupancy forecast across campus facilities.
          </p>
        </div>

        {/* Facility toggle buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {[
            { id: "canteen", label: "Canteen" },
            { id: "library", label: "Library" },
            { id: "admin", label: "Admin" },
            { id: "fees", label: "Fees" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedFacility(item.id as typeof selectedFacility)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                selectedFacility === item.id
                  ? "bg-white dark:bg-slate-900 shadow-sm text-blue-600 dark:text-blue-400 font-extrabold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
            <XAxis dataKey="time" tick={{ fontSize: 11 }} />
            <YAxis unit="%" tick={{ fontSize: 11 }} domain={[0, 100]} />
            <Tooltip
              formatter={(value) => [`${value}% Occupancy`, "Projected Load"]}
              labelFormatter={(label) => `Time: ${label}`}
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                borderRadius: "12px",
                border: "none",
                color: "#fff",
                fontSize: "12px",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
              formatter={(value) => (value === "occupancy" ? "Projected Load (%)" : "Comfort Threshold")}
            />
            <Area
              type="monotone"
              dataKey="occupancy"
              stroke="#2563eb"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#occupancyGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border text-xs text-muted-foreground">
        💡 <span className="font-semibold text-slate-800 dark:text-slate-200">Campus Intelligence Insight:</span>{" "}
        {selectedFacility === "canteen"
          ? "Peak lunch surge occurs strictly between 12:00 PM and 01:45 PM (1.85x multiplier). Load-balanced pickup slots distribute prep smoothly."
          : selectedFacility === "library"
          ? "Library traffic peaks in late afternoons and during examination weeks (up to 95% capacity). Zone B and C offer quieter alternative seating."
          : "Counter traffic spikes in the morning hours (10:00 AM - 12:30 PM). Use digital pre-check and token dispatchers to minimize waiting."}
      </div>
    </div>
  );
}
