"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCampusStore } from "@/lib/store/campus-data-store";
import { LibraryOccupancyCard } from "@/components/library/LibraryOccupancyCard";
import { LibrarySeatMap } from "@/components/library/LibrarySeatMap";
import { SeatReservationDialog } from "@/components/library/SeatReservationDialog";
import { ExamSurgeForecast } from "@/components/library/ExamSurgeForecast";
import { LibrarianControls } from "@/components/library/LibrarianControls";
import { LibrarySeat } from "@/types";
import {
  BookOpen,
  Calendar,
  Sparkles,
  Armchair,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LibraryPage() {
  const { currentUser } = useAuthStore();
  const { isExamSpikeSimulated, toggleExamSpikeSimulation } = useCampusStore();

  const [activeTab, setActiveTab] = useState<string>(
    currentUser.role === "librarian" ? "librarian" : "student"
  );
  const [selectedZoneId, setSelectedZoneId] = useState<string>("zone-a");
  const [reservingSeat, setReservingSeat] = useState<LibrarySeat | null>(null);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-blue-600 text-white shadow-sm">
              <BookOpen className="w-5 h-5" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Smart Study Spaces
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Library Occupancy & Seat Reservation
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            Check live zone crowds, reserve acoustic focus pods, and plan study sessions around exam surges.
          </p>
        </div>

        {/* View Switcher & Simulation button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("student")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "student"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-card border text-slate-600 hover:bg-slate-100 dark:text-slate-300"
            }`}
          >
            <Armchair className="w-3.5 h-3.5" />
            <span>Student View</span>
          </button>

          <button
            onClick={() => setActiveTab("librarian")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "librarian"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-card border text-slate-600 hover:bg-slate-100 dark:text-slate-300"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Librarian Desk</span>
          </button>

          {/* Exam Surge Simulation Button */}
          <button
            onClick={toggleExamSpikeSimulation}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              isExamSpikeSimulated
                ? "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300"
                : "bg-card text-slate-600 border-slate-200 hover:bg-slate-50 dark:text-slate-300"
            }`}
            title="Toggle simulated exam season crowd surge"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>{isExamSpikeSimulated ? "Exam Surge: ON" : "Simulate Exam Surge"}</span>
          </button>
        </div>
      </div>

      {activeTab === "librarian" ? (
        <LibrarianControls />
      ) : (
        <div className="space-y-8">
          {/* 1. Overall & Zone Occupancy Status */}
          <LibraryOccupancyCard
            selectedZoneId={selectedZoneId}
            onSelectZone={setSelectedZoneId}
          />

          {/* 2. Interactive Seat Grid Map */}
          <LibrarySeatMap
            zoneId={selectedZoneId}
            onSelectSeatForReservation={(seat) => setReservingSeat(seat)}
          />

          {/* 3. Predictive Exam Schedule & Crowd Surge Analysis */}
          <ExamSurgeForecast />
        </div>
      )}

      {/* Reservation Dialog Modal */}
      {reservingSeat && (
        <SeatReservationDialog
          seat={reservingSeat}
          open={!!reservingSeat}
          onClose={() => setReservingSeat(null)}
        />
      )}
    </div>
  );
}
