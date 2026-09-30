"use client";

import React from "react";
import { FeeToken } from "@/types";
import { useCampusStore } from "@/lib/store/campus-data-store";
import { Ticket, Clock, CheckCircle2, Building, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeeCounterTokenCardProps {
  token: FeeToken;
}

export function FeeCounterTokenCard({ token }: FeeCounterTokenCardProps) {
  const { feeTokens } = useCampusStore();

  const isServing = token.status === "serving";
  const isCompleted = token.status === "completed";
  const waitingTokens = feeTokens.filter((t) => t.status === "waiting");
  const myIndex = waitingTokens.findIndex((t) => t.id === token.id);
  const position = myIndex !== -1 ? myIndex + 1 : 0;

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 md:p-6 shadow-sm space-y-4 transition-all",
        isServing
          ? "bg-emerald-50/80 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800 ring-2 ring-emerald-500/20"
          : isCompleted
          ? "bg-slate-50 dark:bg-slate-900/40 border-slate-200"
          : "bg-card border-indigo-200 dark:border-indigo-900"
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b">
        <div>
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Physical Counter Token
            </span>
          </div>
          <h4 className="text-base font-black text-slate-900 dark:text-slate-100 mt-1">
            {token.purpose}
          </h4>
        </div>

        <span
          className={cn(
            "px-2.5 py-0.5 rounded-full text-xs font-bold uppercase",
            isServing
              ? "bg-emerald-600 text-white animate-bounce"
              : isCompleted
              ? "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              : "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
          )}
        >
          {isServing ? "CALLING AT COUNTER" : isCompleted ? "COMPLETED" : "IN LINE"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border text-center">
          <span className="text-xs text-muted-foreground">Token Code</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {token.token_number}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border text-center">
          <span className="text-xs text-muted-foreground">Assigned Counter</span>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {token.counter_number || "Fee Desk 1"}
          </div>
          {isServing && (
            <span className="text-[10px] font-bold text-emerald-600 animate-pulse block">
              👉 Please step up
            </span>
          )}
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border text-center">
          <span className="text-xs text-muted-foreground">Queue Wait ETA</span>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {isServing ? "Now" : `~${token.estimated_wait_minutes} mins`}
          </div>
          <span className="text-[10px] text-muted-foreground block">
            {isServing ? "At desk" : `${position} student(s) ahead`}
          </span>
        </div>
      </div>
    </div>
  );
}
