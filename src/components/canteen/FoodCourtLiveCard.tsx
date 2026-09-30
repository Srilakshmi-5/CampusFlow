"use client";

import React from "react";
import { useCampusStore } from "@/lib/store/campus-data-store";
import { useCartStore } from "@/lib/store/cart-store";
import { calculateOccupancyPercentage } from "@/lib/intelligence/occupancy";
import { getCrowdBadgeStyle } from "@/lib/utils";
import {
  MapPin,
  Users,
  Clock,
  Flame,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export function FoodCourtLiveCard() {
  const { foodCourts } = useCampusStore();
  const { foodCourtId, setFoodCourtId } = useCartStore();

  const selectedCourt = foodCourts.find((f) => f.id === foodCourtId) || foodCourts[0];

  return (
    <div className="space-y-4">
      {/* Food Court Selector Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border max-w-full overflow-x-auto">
        {foodCourts.map((court) => {
          const isSelected = court.id === foodCourtId;
          const occPercent = calculateOccupancyPercentage(
            court.current_seats_occupied,
            court.total_seats
          );
          const badge = getCrowdBadgeStyle(court.crowd_level);

          return (
            <button
              key={court.id}
              onClick={() => setFoodCourtId(court.id)}
              className={cn(
                "flex-1 min-w-[200px] flex items-center justify-between p-3 rounded-xl text-left transition-all",
                isSelected
                  ? "bg-white dark:bg-slate-900 shadow-md border font-semibold text-slate-900 dark:text-slate-100"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              )}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-normal">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  <span>{court.location}</span>
                </div>
                <div className="text-sm font-bold truncate">{court.name}</div>
              </div>

              <div className="text-right">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border",
                    badge.bg
                  )}
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full", badge.dot)} />
                  {court.crowd_level.toUpperCase()}
                </span>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {occPercent}% full
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Food Court Live Detailed Status Hero */}
      {selectedCourt && (
        <div className="rounded-2xl border bg-card p-5 md:p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Live Sensor Feed • Updated 30s ago
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1">
                {selectedCourt.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {selectedCourt.location} • Open {selectedCourt.opening_time} - {selectedCourt.closing_time}
              </p>
            </div>

            {/* Crowd Level Badge */}
            <div className="flex items-center gap-2">
              {(() => {
                const badge = getCrowdBadgeStyle(selectedCourt.crowd_level);
                return (
                  <div
                    className={cn(
                      "flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold",
                      badge.bg
                    )}
                  >
                    <span className={cn("w-2 h-2 rounded-full animate-pulse", badge.dot)} />
                    <span>{badge.text}</span>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Grid of Status Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Seating Occupancy */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 font-medium">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>Seating Capacity</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {selectedCourt.current_seats_occupied} / {selectedCourt.total_seats} seats
                </span>
              </div>
              <Progress
                value={calculateOccupancyPercentage(
                  selectedCourt.current_seats_occupied,
                  selectedCourt.total_seats
                )}
                indicatorClassName={
                  selectedCourt.crowd_level === 'high'
                    ? "bg-rose-500"
                    : selectedCourt.crowd_level === 'medium'
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }
              />
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">
                  Available:{" "}
                  <strong className="text-slate-900 dark:text-slate-100 font-bold">
                    {selectedCourt.total_seats - selectedCourt.current_seats_occupied} seats
                  </strong>
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {calculateOccupancyPercentage(
                    selectedCourt.current_seats_occupied,
                    selectedCourt.total_seats
                  )}% occupied
                </span>
              </div>
            </div>

            {/* Average Counter Wait */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Avg. Pickup Wait</span>
              </div>
              <div className="my-2">
                <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
                  ~{selectedCourt.avg_wait_minutes} mins
                </span>
                <span className="text-xs text-muted-foreground ml-1.5">current queue ETA</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {selectedCourt.avg_wait_minutes > 15
                  ? "⚠️ Peak kitchen load. Pre-orders prioritized."
                  : "⚡ Smooth order flow. Fast counter turnover."}
              </p>
            </div>

            {/* Food Queue Status */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>Queue Flow Speed</span>
              </div>
              <div className="my-2">
                <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  {selectedCourt.crowd_level === 'high' ? 'High Surge' : selectedCourt.crowd_level === 'medium' ? 'Steady Pace' : 'Fast Pass'}
                </span>
                <span className="text-xs text-muted-foreground block">
                  3 active pickup counters open
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Next 10-min slot recommended</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
