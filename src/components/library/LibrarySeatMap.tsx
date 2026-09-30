"use client";

import React from "react";
import { useCampusStore } from "@/lib/store/campus-data-store";
import { LibrarySeat } from "@/types";
import { Zap, Armchair, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface LibrarySeatMapProps {
  zoneId: string;
  onSelectSeatForReservation: (seat: LibrarySeat) => void;
}

export function LibrarySeatMap({
  zoneId,
  onSelectSeatForReservation,
}: LibrarySeatMapProps) {
  const { librarySeats, libraryZones } = useCampusStore();

  const zone = libraryZones.find((z) => z.id === zoneId) || libraryZones[0];
  const seats = librarySeats.filter((s) => s.zone_id === zoneId);

  return (
    <div className="rounded-2xl border bg-card p-5 md:p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b">
        <div>
          <div className="flex items-center gap-2">
            <Armchair className="w-5 h-5 text-blue-600" />
            <h4 className="font-bold text-lg text-slate-900 dark:text-slate-100">
              Interactive Floor Map: {zone?.name}
            </h4>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Select any green pod to reserve a focus slot with power outlets.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-500" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-slate-300 dark:bg-slate-700" />
            <span>Occupied</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Power Socket</span>
          </div>
        </div>
      </div>

      {/* Seats Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 py-2">
        {seats.map((seat) => {
          const isFree = !seat.is_occupied;

          return (
            <button
              key={seat.id}
              type="button"
              disabled={!isFree}
              onClick={() => isFree && onSelectSeatForReservation(seat)}
              className={cn(
                "p-3 rounded-xl border flex flex-col items-center justify-between min-h-[75px] transition-all relative group",
                isFree
                  ? "bg-emerald-50/80 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800 hover:scale-105 hover:shadow-md cursor-pointer hover:border-emerald-500"
                  : "bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-800 opacity-60 cursor-not-allowed"
              )}
            >
              {/* Power Outlet Pin */}
              {seat.has_power_outlet && (
                <div className="absolute top-1 right-1" title="Power outlet available">
                  <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                </div>
              )}

              <Armchair
                className={cn(
                  "w-5 h-5 mt-1",
                  isFree ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"
                )}
              />

              <div className="text-center mt-1">
                <span className="text-xs font-black tracking-tight text-slate-800 dark:text-slate-200 block">
                  {seat.seat_number}
                </span>
                <span
                  className={cn(
                    "text-[9px] uppercase font-bold",
                    isFree ? "text-emerald-700 dark:text-emerald-300" : "text-slate-400"
                  )}
                >
                  {isFree ? "Free" : "Busy"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
