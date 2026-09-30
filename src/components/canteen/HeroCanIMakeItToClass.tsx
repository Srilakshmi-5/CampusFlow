"use client";

import React, { useMemo } from "react";
import { useCartStore } from "@/lib/store/cart-store";
import { useCampusStore } from "@/lib/store/campus-data-store";
import { analyzeCanIMakeItToClass } from "@/lib/intelligence/recommendation";
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Footprints,
  Utensils,
  ChefHat,
  Timer,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroCanIMakeItToClassProps {
  onFilterQuickMeals?: () => void;
}

export function HeroCanIMakeItToClass({ onFilterQuickMeals }: HeroCanIMakeItToClassProps) {
  const { items, nextClassTime, setNextClassTime, foodCourtId, isDineIn, setIsDineIn } =
    useCartStore();
  const foodCourts = useCampusStore((state) => state.foodCourts);
  const activeCourt = foodCourts.find((fc) => fc.id === foodCourtId) || foodCourts[0];

  const analysis = useMemo(() => {
    return analyzeCanIMakeItToClass({
      targetClassTime: nextClassTime,
      items,
      currentQueueWaitMinutes: activeCourt?.avg_wait_minutes || 8,
      walkingMinutes: 5,
      isDineIn,
    });
  }, [nextClassTime, items, activeCourt, isDineIn]);

  const verdictStyles = {
    SAFE: {
      border: "border-emerald-200 dark:border-emerald-800/60",
      bg: "bg-emerald-50/70 dark:bg-emerald-950/30",
      text: "text-emerald-700 dark:text-emerald-300",
      badge: "bg-emerald-600 text-white",
      icon: CheckCircle,
    },
    TIGHT: {
      border: "border-amber-200 dark:border-amber-800/60",
      bg: "bg-amber-50/70 dark:bg-amber-950/30",
      text: "text-amber-700 dark:text-amber-300",
      badge: "bg-amber-600 text-white",
      icon: AlertTriangle,
    },
    'NOT SAFE': {
      border: "border-rose-200 dark:border-rose-800/60",
      bg: "bg-rose-50/70 dark:bg-rose-950/30",
      text: "text-rose-700 dark:text-rose-300",
      badge: "bg-rose-600 text-white",
      icon: XCircle,
    },
  }[analysis.verdict];

  const VerdictIcon = verdictStyles.icon;

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 md:p-6 transition-all shadow-sm",
        verdictStyles.bg,
        verdictStyles.border
      )}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-black/5 dark:border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-600 text-white">
              <Zap className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-extrabold tracking-wider text-blue-600 dark:text-blue-400">
              CampusFlow Intelligence
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Can I Make It To Class?
          </h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
            Real-time calculation: Prep Time + Pickup Wait + Eating Pace + Walk Time.
          </p>
        </div>

        {/* Input Parameters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Class Time Picker */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border rounded-xl px-3 py-1.5 shadow-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-slate-500">Next Class:</span>
            <input
              type="time"
              value={nextClassTime}
              onChange={(e) => setNextClassTime(e.target.value)}
              className="text-xs sm:text-sm font-bold bg-transparent focus:outline-none text-slate-900 dark:text-slate-100 cursor-pointer"
            />
          </div>

          {/* Dine In / Takeaway toggle */}
          <div className="flex items-center bg-white dark:bg-slate-900 border rounded-xl p-1 shadow-sm text-xs font-medium">
            <button
              onClick={() => setIsDineIn(true)}
              className={cn(
                "px-2.5 py-1 rounded-lg transition-colors",
                isDineIn
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
              )}
            >
              Dine-In
            </button>
            <button
              onClick={() => setIsDineIn(false)}
              className={cn(
                "px-2.5 py-1 rounded-lg transition-colors",
                !isDineIn
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
              )}
            >
              Takeaway
            </button>
          </div>
        </div>
      </div>

      {/* Main Verdict & Time Breakdown */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Verdict Badge & Status */}
        <div className="md:col-span-4 flex items-start gap-3.5">
          <div
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md",
              verdictStyles.badge
            )}
          >
            <VerdictIcon className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wide",
                  verdictStyles.badge
                )}
              >
                {analysis.verdict}
              </span>
              <span className="text-xs text-muted-foreground">
                ({analysis.availableMinutes}m until class)
              </span>
            </div>
            <div className="mt-1 font-bold text-slate-900 dark:text-slate-100 text-base">
              Total Needed: {analysis.totalTimeMinutes} mins
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              {analysis.marginMinutes >= 0
                ? `${analysis.marginMinutes} min buffer remaining`
                : `${Math.abs(analysis.marginMinutes)} min deficit (Risk of being late)`}
            </div>
          </div>
        </div>

        {/* Breakdown Metric Tiles */}
        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-black/5 dark:border-white/5 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-500 text-[11px] mb-0.5">
              <ChefHat className="w-3.5 h-3.5 text-amber-500" />
              <span>Prep Time</span>
            </div>
            <span className="text-sm md:text-base font-extrabold text-slate-900 dark:text-slate-100">
              {analysis.breakdown.prepTime}m
            </span>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-black/5 dark:border-white/5 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-500 text-[11px] mb-0.5">
              <Timer className="w-3.5 h-3.5 text-blue-500" />
              <span>Pickup Wait</span>
            </div>
            <span className="text-sm md:text-base font-extrabold text-slate-900 dark:text-slate-100">
              {analysis.breakdown.pickupQueueWait}m
            </span>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-black/5 dark:border-white/5 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-500 text-[11px] mb-0.5">
              <Utensils className="w-3.5 h-3.5 text-emerald-500" />
              <span>Eating Pace</span>
            </div>
            <span className="text-sm md:text-base font-extrabold text-slate-900 dark:text-slate-100">
              {analysis.breakdown.diningTime}m
            </span>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-black/5 dark:border-white/5 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-500 text-[11px] mb-0.5">
              <Footprints className="w-3.5 h-3.5 text-purple-500" />
              <span>Campus Walk</span>
            </div>
            <span className="text-sm md:text-base font-extrabold text-slate-900 dark:text-slate-100">
              {analysis.breakdown.walkingTime}m
            </span>
          </div>
        </div>
      </div>

      {/* Recommendation and Action Banner */}
      <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <p className="text-slate-700 dark:text-slate-300 font-medium">
          💡 <span className="font-semibold">Intelligence Tip:</span> {analysis.recommendation}
        </p>
        {analysis.quickAction && onFilterQuickMeals && (
          <button
            onClick={onFilterQuickMeals}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs whitespace-nowrap shadow-sm transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{analysis.quickAction.label}</span>
          </button>
        )}
      </div>
    </div>
  );
}
