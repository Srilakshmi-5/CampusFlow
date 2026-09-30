"use client";

import React from "react";
import { useCampusStore } from "@/lib/store/campus-data-store";
import { ReceiptIndianRupee, Bell, CheckCircle2, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function FeesStaffConsole() {
  const { feeTokens, advanceFeeToken, feeRecords } = useCampusStore();

  const servingToken = feeTokens.find((t) => t.status === "serving");
  const waitingTokens = feeTokens.filter((t) => t.status === "waiting");

  const handleCallNext = () => {
    if (waitingTokens.length === 0) {
      toast.info("No waiting tokens for fee counters!");
      return;
    }
    const nextToken = waitingTokens[0];
    advanceFeeToken(nextToken.id, "serving");
    toast.success(`Calling Token ${nextToken.token_number} to Fee Desk 1`);
  };

  const handleComplete = () => {
    if (!servingToken) return;
    advanceFeeToken(servingToken.id, "completed");
    toast.success(`Token ${servingToken.token_number} completed and reconciled!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-card border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-indigo-600 text-white">
              <ReceiptIndianRupee className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-extrabold text-indigo-600 tracking-wider">
              Fee Counter Operations
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1">
            Physical Counter Queue Dispatcher
          </h2>
          <p className="text-xs text-muted-foreground">
            Call student tickets for cash challans, scholarship adjustments, and fee clearances.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200">
            {waitingTokens.length} Tokens in Queue
          </span>
        </div>
      </div>

      {/* Active Ticket Desk */}
      <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-5">
        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 pb-2 border-b">
          Fee Desk 1: Current Active Ticket
        </h4>

        {servingToken ? (
          <div className="p-5 rounded-xl bg-emerald-50/70 border border-emerald-300 dark:bg-emerald-950/30 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-400">
                Calling at Desk:
              </span>
              <div className="text-3xl font-black text-slate-900 dark:text-slate-100">
                Token #{servingToken.token_number}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5" />
                <span>Student: {servingToken.user_name}</span>
                <span>•</span>
                <span>Purpose: {servingToken.purpose}</span>
              </p>
            </div>

            <Button
              onClick={handleComplete}
              className="rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-xs gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete & Call Next</span>
            </Button>
          </div>
        ) : (
          <div className="text-center py-8 space-y-3">
            <p className="text-xs text-muted-foreground">No token called currently at Fee Desk 1.</p>
            <Button
              onClick={handleCallNext}
              disabled={waitingTokens.length === 0}
              className="rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 gap-1.5 shadow-sm"
            >
              <Bell className="w-4 h-4" />
              <span>Call Next Token ({waitingTokens.length} waiting)</span>
            </Button>
          </div>
        )}
      </div>

      {/* Waiting Queue List */}
      <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500" />
          <span>Waiting In-Person Tickets ({waitingTokens.length})</span>
        </h4>

        {waitingTokens.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">All queues cleared!</p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {waitingTokens.map((token, idx) => (
              <div key={token.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 font-bold flex items-center justify-center text-[11px]">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-black text-sm text-slate-900 dark:text-slate-100">
                      {token.token_number}
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      Student: <strong>{token.user_name}</strong> • {token.purpose}
                    </p>
                  </div>
                </div>

                <span className="text-muted-foreground font-semibold">
                  ~{token.estimated_wait_minutes}m wait
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
