"use client";

import React, { useState } from "react";
import { useCampusStore } from "@/lib/store/campus-data-store";
import { LibrarySeat } from "@/types";
import { BookOpen, Armchair, Sliders, CheckCircle2, XCircle, RotateCcw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function LibrarianControls() {
  const {
    libraryZones,
    librarySeats,
    toggleSeatOccupancy,
    updateZoneOccupancy,
    reservations,
    cancelReservation,
  } = useCampusStore();

  const [activeZoneId, setActiveZoneId] = useState("zone-a");

  const zoneSeats = librarySeats.filter((s) => s.zone_id === activeZoneId);
  const activeReservations = reservations.filter((r) => r.status === "active");

  const handleToggleSeat = (seat: LibrarySeat) => {
    toggleSeatOccupancy(seat.id);
    toast.info(`Seat ${seat.seat_number} marked as ${seat.is_occupied ? 'VACANT' : 'OCCUPIED'}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-card border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-blue-600 text-white">
              <BookOpen className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-extrabold text-blue-600 tracking-wider">
              Librarian Control Desk
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1">
            Real-time Seat & Zone Floor Management
          </h2>
          <p className="text-xs text-muted-foreground">
            Click any seat to manually toggle occupancy, clear walk-ins, or manage active student passes.
          </p>
        </div>

        {/* Zone switcher */}
        <div className="flex items-center gap-2">
          {libraryZones.map((zone) => (
            <button
              key={zone.id}
              onClick={() => setActiveZoneId(zone.id)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold border transition-all",
                activeZoneId === zone.id
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-background text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              )}
            >
              {zone.name.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Seat grid click-to-toggle */}
      <div className="p-6 rounded-2xl bg-card border shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Armchair className="w-4 h-4 text-blue-600" />
            <span>Interactive Override Grid (Click to toggle Occupied/Free)</span>
          </h4>
          <span className="text-xs text-muted-foreground">
            {zoneSeats.filter((s) => s.is_occupied).length} / {zoneSeats.length} Currently Occupied
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5">
          {zoneSeats.map((seat) => (
            <button
              key={seat.id}
              onClick={() => handleToggleSeat(seat)}
              className={cn(
                "p-3 rounded-xl border flex flex-col items-center justify-center transition-all hover:scale-105 shadow-xs cursor-pointer",
                seat.is_occupied
                  ? "bg-rose-50 border-rose-300 text-rose-800 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300"
                  : "bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-300"
              )}
            >
              <Armchair className="w-5 h-5 mb-1" />
              <span className="text-xs font-black">{seat.seat_number}</span>
              <span className="text-[9px] uppercase font-bold mt-0.5">
                {seat.is_occupied ? "Occupied" : "Free"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Reservations Management */}
      <div className="p-6 rounded-2xl bg-card border shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Active Booked Reservations ({activeReservations.length})</span>
        </h4>

        {activeReservations.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">
            No active student reservations at this time.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {activeReservations.map((res) => (
              <div key={res.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                      Pod {res.seat_number}
                    </span>
                    <span className="text-xs text-muted-foreground">• {res.zone_name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Student: <strong className="text-slate-700 dark:text-slate-300">{res.user_name}</strong> | Slot: {res.start_time} - {res.end_time}
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    cancelReservation(res.id);
                    toast.success(`Reservation for Pod ${res.seat_number} released`);
                  }}
                  className="rounded-xl text-xs text-rose-600 hover:bg-rose-50 border-rose-200"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Release Seat</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
