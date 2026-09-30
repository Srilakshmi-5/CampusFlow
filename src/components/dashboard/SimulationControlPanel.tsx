"use client";

import React from "react";
import { useCampusStore } from "@/lib/store/campus-data-store";
import {
  SlidersHorizontal,
  Flame,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  UtensilsCrossed,
  BookOpen,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { calculateOccupancyPercentage, getCrowdLevelFromOccupancy } from "@/lib/intelligence/occupancy";

export function SimulationControlPanel() {
  const {
    foodCourts,
    updateFoodCourtOccupancy,
    libraryZones,
    updateZoneOccupancy,
    menuItems,
    toggleMenuItemAvailability,
    isPeakRushSimulated,
    toggleRushSimulation,
    isExamSpikeSimulated,
    toggleExamSpikeSimulation,
    resetToDefaults,
  } = useCampusStore();

  const handleCanteenSlider = (id: string, newOccupied: number, total: number) => {
    const rate = calculateOccupancyPercentage(newOccupied, total);
    const crowd = getCrowdLevelFromOccupancy(rate);
    const wait = crowd === "high" ? 22 : crowd === "medium" ? 14 : 6;
    updateFoodCourtOccupancy(id, newOccupied, crowd, wait);
  };

  const handleLibrarySlider = (zoneId: string, newOccupied: number) => {
    updateZoneOccupancy(zoneId, newOccupied);
  };

  const handleReset = () => {
    resetToDefaults();
    toast.success("Simulation parameters restored to baseline defaults!");
  };

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b">
        <div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-purple-600" />
            <h4 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">
              Live Campus Simulation Playground
            </h4>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Interactively inject crowd surges or tweak seat levels to observe the intelligence engine respond in real-time.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="rounded-xl text-xs font-bold gap-1.5 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Defaults</span>
        </Button>
      </div>

      {/* Surge Quick Injection Toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-500" />
              Lunch Rush Peak Simulation
            </span>
            <p className="text-[11px] text-muted-foreground">
              Forces canteens to &gt;95% load and lengthens wait times.
            </p>
          </div>
          <Button
            size="sm"
            onClick={toggleRushSimulation}
            className={`rounded-xl text-xs font-bold ${
              isPeakRushSimulated ? "bg-rose-600 hover:bg-rose-700" : "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
            }`}
          >
            {isPeakRushSimulated ? "Turn Off" : "Trigger Surge"}
          </Button>
        </div>

        <div className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Exam Season Surge Simulation
            </span>
            <p className="text-[11px] text-muted-foreground">
              Fills quiet study zones to 98% and tightens reservation slots.
            </p>
          </div>
          <Button
            size="sm"
            onClick={toggleExamSpikeSimulation}
            className={`rounded-xl text-xs font-bold ${
              isExamSpikeSimulated ? "bg-purple-600 hover:bg-purple-700" : "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
            }`}
          >
            {isExamSpikeSimulated ? "Turn Off" : "Trigger Surge"}
          </Button>
        </div>
      </div>

      {/* Manual Sliders: Canteen Occupancy */}
      <div className="space-y-3 pt-2 border-t">
        <h5 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <UtensilsCrossed className="w-3.5 h-3.5 text-orange-500" />
          <span>Manual Canteen Seat Occupancy Adjusters:</span>
        </h5>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {foodCourts.map((court) => (
            <div key={court.id} className="p-4 rounded-xl border bg-card space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span>{court.name}</span>
                <span className="text-blue-600 dark:text-blue-400">
                  {court.current_seats_occupied} / {court.total_seats} seats ({calculateOccupancyPercentage(court.current_seats_occupied, court.total_seats)}%)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={court.total_seats}
                value={court.current_seats_occupied}
                onChange={(e) =>
                  handleCanteenSlider(court.id, parseInt(e.target.value, 10), court.total_seats)
                }
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Manual Sliders: Library Zones */}
      <div className="space-y-3 pt-2 border-t">
        <h5 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-blue-500" />
          <span>Manual Library Zone Occupancy Adjusters:</span>
        </h5>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {libraryZones.map((zone) => (
            <div key={zone.id} className="p-3.5 rounded-xl border bg-card space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="truncate">{zone.name.split(':')[0]}</span>
                <span className="text-blue-600 dark:text-blue-400">
                  {zone.occupied_seats} / {zone.total_seats}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={zone.total_seats}
                value={zone.occupied_seats}
                onChange={(e) =>
                  handleLibrarySlider(zone.id, parseInt(e.target.value, 10))
                }
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Menu Item Availability Toggles */}
      <div className="space-y-3 pt-2 border-t">
        <h5 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
          Canteen Menu Availability Toggles (Out-of-Stock Simulation):
        </h5>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {menuItems.slice(0, 8).map((item) => (
            <button
              key={item.id}
              onClick={() => toggleMenuItemAvailability(item.id)}
              className={`p-2 rounded-lg border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                item.is_available
                  ? "bg-emerald-50/70 border-emerald-300 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
                  : "bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 line-through"
              }`}
            >
              <span className="truncate mr-1">{item.name}</span>
              <span className="text-[10px] font-bold">
                {item.is_available ? "In Stock" : "Sold Out"}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
