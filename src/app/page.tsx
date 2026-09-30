"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCampusStore } from "@/lib/store/campus-data-store";
import { useAuthStore } from "@/lib/store/auth-store";
import { calculateOccupancyPercentage } from "@/lib/intelligence/occupancy";
import { getCrowdBadgeStyle } from "@/lib/utils";
import { HeroCanIMakeItToClass } from "@/components/canteen/HeroCanIMakeItToClass";
import {
  Sparkles,
  UtensilsCrossed,
  BookOpen,
  FileCheck2,
  ReceiptIndianRupee,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Compass,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const { currentUser } = useAuthStore();
  const { foodCourts, libraryZones, serviceTokens, feeRecords, orders } = useCampusStore();

  const mainCourt = foodCourts[0];
  const libraryTotal = libraryZones.reduce((sum, z) => sum + z.total_seats, 0);
  const libraryOccupied = libraryZones.reduce((sum, z) => sum + z.occupied_seats, 0);
  const libraryFree = libraryTotal - libraryOccupied;

  const waitingAdmin = serviceTokens.filter((t) => t.status === "waiting").length;
  const currentServingAdmin = serviceTokens.find((t) => t.status === "serving");

  const unpaidFee = feeRecords.find((r) => r.status === "unpaid");

  return (
    <div className="space-y-10">
      {/* Hero Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-10 md:p-12 shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin" />
            <span>Campus Intelligence Engine v2.0</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Know Before <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-300 bg-clip-text text-transparent">You Go.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            Never stand in campus queues again. Get real-time visibility into crowd densities, table vacancies, turnaround times, and smart recommendations.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/canteen">
              <Button size="lg" className="rounded-xl font-bold bg-blue-600 hover:bg-blue-500 shadow-md gap-2">
                <UtensilsCrossed className="w-4 h-4" />
                <span>Pre-Order Canteen</span>
              </Button>
            </Link>

            <Link href="/library">
              <Button size="lg" variant="outline" className="rounded-xl font-bold border-slate-700 text-white hover:bg-slate-800/80 bg-slate-900/60 gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Find Free Study Pod</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 -top-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Flagship Hero Interactive Calculator */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
              Hero Calculator: Will I Make It To Class?
            </h2>
          </div>
          <Link href="/canteen" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            <span>Explore Full Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <HeroCanIMakeItToClass />
      </section>

      {/* Live Campus Facility Radar Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
              Live Facility Congestion Radar
            </h2>
            <p className="text-xs text-muted-foreground">
              Instant snapshot of current queues and available capacity across campus.
            </p>
          </div>
          <Link href="/admin" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            <span>Campus Intelligence Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Canteen */}
          <Link href="/canteen" className="group">
            <div className="p-5 rounded-2xl border bg-card hover:border-orange-400 transition-all shadow-sm flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="p-2 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-300">
                    <UtensilsCrossed className="w-5 h-5" />
                  </span>
                  {(() => {
                    const badge = getCrowdBadgeStyle(mainCourt.crowd_level);
                    return (
                      <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold border", badge.bg)}>
                        {mainCourt.crowd_level.toUpperCase()}
                      </span>
                    );
                  })()}
                </div>

                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 mt-3 group-hover:text-orange-600 transition-colors">
                  Central Dining
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {mainCourt.current_seats_occupied} / {mainCourt.total_seats} seats occupied
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Avg. Wait:</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">
                    ~{mainCourt.avg_wait_minutes} mins
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-orange-600 dark:text-orange-400">
                  <span>Pre-order &amp; pick up</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* Card 2: Library */}
          <Link href="/library" className="group">
            <div className="p-5 rounded-2xl border bg-card hover:border-blue-400 transition-all shadow-sm flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                    <BookOpen className="w-5 h-5" />
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200">
                    {libraryFree} PODS FREE
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 mt-3 group-hover:text-blue-600 transition-colors">
                  University Library
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Zone A Silent Pods &amp; Collaborative Hubs
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Occupancy:</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">
                    {calculateOccupancyPercentage(libraryOccupied, libraryTotal)}%
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                  <span>Reserve focus pod</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* Card 3: Admin Services */}
          <Link href="/admin-services" className="group">
            <div className="p-5 rounded-2xl border bg-card hover:border-emerald-400 transition-all shadow-sm flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
                    <FileCheck2 className="w-5 h-5" />
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                    PRE-CHECK ON
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 mt-3 group-hover:text-emerald-600 transition-colors">
                  Admin Services
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Bonafide, TC, Attestation &amp; Certificates
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Current Queue:</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">
                    {waitingAdmin} in line
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <span>Generate digital token</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* Card 4: Fees Counter */}
          <Link href="/fees" className="group">
            <div className="p-5 rounded-2xl border bg-card hover:border-indigo-400 transition-all shadow-sm flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                    <ReceiptIndianRupee className="w-5 h-5" />
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200">
                    INSTANT RECEIPT
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 mt-3 group-hover:text-indigo-600 transition-colors">
                  Fees &amp; Bursar
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {unpaidFee ? "Dues Pending Settlement" : "All Fees Cleared"}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Digital Clearance:</span>
                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                    Instant 1-Click
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                  <span>Pay or get counter ticket</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Core Philosophy Banner */}
      <section className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border space-y-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-blue-600" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
            The CampusFlow Philosophy
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Instead of making students wait in line, CampusFlow shifts behavior by providing predictive transparency. When you know whether the Canteen has high rush or the Library is at capacity <em>before</em> you walk across campus, you make smarter decisions about <strong>when</strong> and <strong>where</strong> to go.
        </p>
      </section>
    </div>
  );
}
