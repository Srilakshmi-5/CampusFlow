"use client";

import React from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { CampusCongestionCard } from "@/components/dashboard/CampusCongestionCard";
import { HourlyDemandChart } from "@/components/dashboard/HourlyDemandChart";
import { SimulationControlPanel } from "@/components/dashboard/SimulationControlPanel";
import {
  ShieldAlert,
  LayoutDashboard,
  Cpu,
  BarChart3,
  Users2,
  Zap,
} from "lucide-react";

export default function SuperAdminPage() {
  const { currentUser } = useAuthStore();

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Campus Operations & Intelligence Hub
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Super Admin Resource Dashboard
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            Unified visibility into dining crowd surges, library density, service counter queues, and demand forecasting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Autonomous Engine Active</span>
          </div>
        </div>
      </div>

      {/* 1. Master Campus Congestion Score Card */}
      <CampusCongestionCard />

      {/* 2. Demand Forecast Chart with Recharts */}
      <HourlyDemandChart />

      {/* 3. Live Campus Simulation Playground */}
      <SimulationControlPanel />
    </div>
  );
}
