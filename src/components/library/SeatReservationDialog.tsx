"use client";

import React, { useState } from "react";
import { LibrarySeat } from "@/types";
import { useCampusStore } from "@/lib/store/campus-data-store";
import { useAuthStore } from "@/lib/store/auth-store";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, Armchair, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner";

interface SeatReservationDialogProps {
  seat: LibrarySeat | null;
  open: boolean;
  onClose: () => void;
}

const TIME_SLOTS = [
  { start: "10:00 AM", end: "12:00 PM" },
  { start: "12:00 PM", end: "02:00 PM" },
  { start: "02:00 PM", end: "04:00 PM" },
  { start: "04:00 PM", end: "06:00 PM" },
  { start: "06:00 PM", end: "08:00 PM" },
];

export function SeatReservationDialog({
  seat,
  open,
  onClose,
}: SeatReservationDialogProps) {
  const { reserveSeat } = useCampusStore();
  const { currentUser } = useAuthStore();
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[2]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!seat) return null;

  const handleConfirmReservation = () => {
    setIsSubmitting(true);
    try {
      const success = reserveSeat(
        seat.id,
        currentUser.id,
        currentUser.full_name,
        selectedSlot.start,
        selectedSlot.end
      );

      if (success) {
        toast.success(`Seat ${seat.seat_number} reserved successfully for ${selectedSlot.start} - ${selectedSlot.end}`);
        onClose();
      } else {
        toast.error("Seat is already reserved or unavailable!");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogHeader onClose={onClose}>
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-lg bg-blue-600 text-white">
            <Armchair className="w-4 h-4" />
          </span>
          <div>
            <DialogTitle>Reserve Focus Pod {seat.seat_number}</DialogTitle>
            <p className="text-xs text-muted-foreground">Select your guaranteed study slot</p>
          </div>
        </div>
      </DialogHeader>

      <DialogContent className="space-y-4">
        {/* Seat Details Overview */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs text-muted-foreground">Pod Number</span>
            <div className="text-xl font-black text-slate-900 dark:text-slate-100">
              {seat.seat_number}
            </div>
          </div>
          {seat.has_power_outlet && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 fill-current text-amber-500" />
              <span>Dedicated 230V Socket</span>
            </div>
          )}
        </div>

        {/* Time Slot Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            Select Study Duration Window:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TIME_SLOTS.map((slot, idx) => {
              const isSelected =
                selectedSlot.start === slot.start && selectedSlot.end === slot.end;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/80 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 ring-2 ring-blue-500/20"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <div className="font-bold">{slot.start} – {slot.end}</div>
                  <span className="text-[10px] text-muted-foreground font-normal">
                    2 hours reserved pass
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/60 text-xs text-slate-600 dark:text-slate-300">
          💡 <span className="font-semibold">Check-in Rule:</span> Please arrive within 15 minutes of your reserved start time or the seat will automatically be released to walk-in students.
        </div>
      </DialogContent>

      <DialogFooter>
        <Button variant="outline" onClick={onClose} className="rounded-xl">
          Cancel
        </Button>
        <Button
          onClick={handleConfirmReservation}
          disabled={isSubmitting}
          className="rounded-xl font-bold bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? "Reserving..." : "Confirm Seat Reservation"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
