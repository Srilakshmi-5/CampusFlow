"use client";

import React from "react";
import { useCampusStore } from "@/lib/store/campus-data-store";
import { calculateOccupancyPercentage } from "@/lib/intelligence/occupancy";
import {
  Activity,
  Flame,
  Users,
  UtensilsCrossed,
  BookOpen,
  FileCheck2,
  ReceiptIndianRupee,
  Sparkles,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function CampusCongestionCard() {
  const { foodCourts, libraryZones, serviceTokens, feeTokens, orders } = useCampusStore();

  // Aggregate canteen occupancy
  const totalCanteenSeats = foodCourts.reduce((s, fc) => s + fc.total_seats, 0);
  const occupiedCanteenSeats = foodCourts.reduce((s, fc) => s + fc.current_seats_occupied, 0);
  const canteenRate = calculateOccupancyPercentage(occupiedCanteenSeats, totalCanteenSeats);

  // Aggregate library occupancy
  const totalLibrarySeats = libraryZones.reduce((s, z) => s + z.total_seats, 0);
  const occupiedLibrarySeats = libraryZones.reduce((s, z) => s + z.occupied_seats, 0);
  const libraryRate = calculateOccupancyPercentage(occupiedLibrarySeats, totalLibrarySeats);

  // Aggregate queue load
  const activeAdminTokens = serviceTokens.filter((t) => t.status === "waiting" || t.status === "serving").length;
  const activeFeeTokens = feeTokens.filter((t) => t.status === "waiting" || t.status === "serving").length;
  const activeOrders = orders.filter((o) => o.status === "placed" || o.status === "preparing").length;

  // Composite Campus Congestion Score (0 - 100)
  const campusCongestionScore = Math.round(
    canteenRate * 0.45 + libraryRate * 0.4 + Math.min(30, (activeAdminTokens + activeFeeTokens) * 3) * 0.15
  );

  const getStatus = (score: number) => {
    if (score < 50) return { label: "OPTIMAL FLOW", color: "text-emerald-600 bg-emerald-50 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300" };
    if (score <= 75) return { label: "MODERATE LOAD", color: "text-amber-600 bg-amber-50 border-amber-300 dark:bg-amber-950 dark:text-amber-300" };
    return { label: "HIGH CONGESTION", color: "text-rose-600 bg-rose-50 border-rose-300 dark:bg-rose-950 dark:text-rose-300" };
  };

  const status = getStatus(campusCongestionScore);

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-blue-600 text-white">
              <Activity className="w-4 h-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Campus Intelligence Engine
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Campus-Wide Congestion Index
          </h2>
          <p className="text-xs text-muted-foreground">
            Composite AI-weighted metric analyzing dining halls, study facilities, and physical service queues.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wide border shadow-xs",
              status.color
            )}
          >
            {status.label}
          </span>
        </div>
      </div>

      {/* Main Metric Hero */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Master Index */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-purple-500/10 border border-blue-200 dark:border-blue-900 flex flex-col justify-between">
          <span className="text-xs font-bold text-muted-foreground uppercase">Campus Congestion</span>
          <div className="my-2">
            <span className="text-4xl font-black tracking-tight text-blue-600 dark:text-blue-400">
              {campusCongestionScore}%
            </span>
            <span className="text-xs text-muted-foreground ml-1.5 font-medium">overall density</span>
          </div>
          <Progress value={campusCongestionScore} className="h-2" />
        </div>

        {/* Canteen Occupancy */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <UtensilsCrossed className="w-4 h-4 text-orange-500" />
              Canteens
            </span>
            <span className="text-orange-600">{canteenRate}%</span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {occupiedCanteenSeats} / {totalCanteenSeats}
            </span>
            <span className="text-xs text-muted-foreground block">seats occupied</span>
          </div>
          <span className="text-[11px] text-muted-foreground font-semibold">
            {activeOrders} active pre-orders in pipeline
          </span>
        </div>

        {/* Library Occupancy */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <BookOpen className="w-4 h-4 text-blue-500" />
              Library
            </span>
            <span className="text-blue-600">{libraryRate}%</span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {occupiedLibrarySeats} / {totalLibrarySeats}
            </span>
            <span className="text-xs text-muted-foreground block">seats occupied</span>
          </div>
          <span className="text-[11px] text-muted-foreground font-semibold">
            Zone A (Silent) is at highest demand
          </span>
        </div>

        {/* Counter Tokens */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <FileCheck2 className="w-4 h-4 text-emerald-500" />
              Active Queues
            </span>
            <span className="text-emerald-600">{activeAdminTokens + activeFeeTokens}</span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {activeAdminTokens} Admin + {activeFeeTokens} Fees
            </span>
            <span className="text-xs text-muted-foreground block">students in line</span>
          </div>
          <span className="text-[11px] text-muted-foreground font-semibold">
            Avg counter turnaround: ~7 mins
          </span>
        </div>
      </div>
    </div>
  );
}
