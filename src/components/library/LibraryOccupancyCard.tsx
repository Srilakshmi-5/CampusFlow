"use client";

import React from "react";
import { useCampusStore } from "@/lib/store/campus-data-store";
import { calculateOccupancyPercentage, estimateNextAvailableSeatTime } from "@/lib/intelligence/occupancy";
import { getCrowdBadgeStyle, cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Users,
  Clock,
  Volume2,
  Sparkles,
  MapPin,
  Flame,
} from "lucide-react";

interface LibraryOccupancyCardProps {
  selectedZoneId: string;
  onSelectZone: (zoneId: string) => void;
}

export function LibraryOccupancyCard({
  selectedZoneId,
  onSelectZone,
}: LibraryOccupancyCardProps) {
  const { libraryZones } = useCampusStore();

  const totalCapacity = libraryZones.reduce((sum, z) => sum + z.total_seats, 0);
  const totalOccupied = libraryZones.reduce((sum, z) => sum + z.occupied_seats, 0);
  const totalAvailable = totalCapacity - totalOccupied;
  const overallOccupancyRate = calculateOccupancyPercentage(totalOccupied, totalCapacity);
  const nextSeatWait = estimateNextAvailableSeatTime(totalOccupied, totalCapacity);

  return (
    <div className="space-y-6">
      {/* Campus Library Overall Live Status Card */}
      <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Central University Library • Real-time Sensors
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">
              Live Seat Occupancy & Atmosphere
            </h3>
            <p className="text-xs text-muted-foreground">
              3 Specialized Study Zones • Wi-Fi 6 • Acoustic Dampened Pods
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-xs text-muted-foreground block">Next Seat Turnover:</span>
              <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                {nextSeatWait === 0 ? "⚡ Immediate Available" : `~${nextSeatWait} mins wait`}
              </span>
            </div>
          </div>
        </div>

        {/* Global Capacity Meter */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Users className="w-4 h-4 text-blue-500" />
              Overall Library Capacity
            </span>
            <span className="text-slate-900 dark:text-slate-100">
              {totalOccupied} / {totalCapacity} seats ({totalAvailable} available)
            </span>
          </div>

          <Progress
            value={overallOccupancyRate}
            indicatorClassName={
              overallOccupancyRate > 80
                ? "bg-rose-500"
                : overallOccupancyRate > 50
                ? "bg-amber-500"
                : "bg-emerald-500"
            }
          />

          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
            <span>Peak study hours: 02:00 PM – 06:00 PM</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {overallOccupancyRate}% Occupied
            </span>
          </div>
        </div>
      </div>

      {/* Zone-Wise Availability Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {libraryZones.map((zone) => {
          const isSelected = selectedZoneId === zone.id;
          const zoneRate = calculateOccupancyPercentage(zone.occupied_seats, zone.total_seats);
          const badge = getCrowdBadgeStyle(zone.crowd_level);
          const availableInZone = zone.total_seats - zone.occupied_seats;

          return (
            <div
              key={zone.id}
              onClick={() => onSelectZone(zone.id)}
              className={cn(
                "p-5 rounded-2xl border transition-all cursor-pointer shadow-sm relative flex flex-col justify-between space-y-4",
                isSelected
                  ? "bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 dark:bg-blue-950/40"
                  : "bg-card hover:border-slate-300 dark:hover:border-slate-700"
              )}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">
                      {zone.floor}
                    </span>
                    <h4 className="font-black text-base text-slate-900 dark:text-slate-100 leading-snug">
                      {zone.name.split(':')[0]}
                    </h4>
                  </div>

                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                      badge.bg
                    )}
                  >
                    {zone.crowd_level.toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  {zone.description}
                </p>

                {/* Noise Level Tag */}
                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                  <Volume2 className="w-3.5 h-3.5 text-blue-500" />
                  <span className="capitalize">Atmosphere: {zone.noise_level}</span>
                </div>
              </div>

              {/* Occupancy stats */}
              <div className="space-y-1.5 pt-3 border-t">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Occupancy:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {zone.occupied_seats} / {zone.total_seats} ({availableInZone} free)
                  </span>
                </div>
                <Progress
                  value={zoneRate}
                  indicatorClassName={
                    zoneRate > 80 ? "bg-rose-500" : zoneRate > 50 ? "bg-amber-500" : "bg-emerald-500"
                  }
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
