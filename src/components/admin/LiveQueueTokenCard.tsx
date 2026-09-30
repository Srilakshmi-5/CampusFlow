"use client";

import React from "react";
import { ServiceToken } from "@/types";
import { useCampusStore } from "@/lib/store/campus-data-store";
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  TrendingDown,
  FileCheck2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LiveQueueTokenCardProps {
  token: ServiceToken;
}

export function LiveQueueTokenCard({ token }: LiveQueueTokenCardProps) {
  const { serviceTokens } = useCampusStore();

  const currentServing = serviceTokens.find((t) => t.status === "serving");
  const waitingTokens = serviceTokens.filter((t) => t.status === "waiting");
  const myIndexInWaiting = waitingTokens.findIndex((t) => t.id === token.id);
  const queuePosition = myIndexInWaiting !== -1 ? myIndexInWaiting + 1 : 0;

  const isServing = token.status === "serving";
  const isCompleted = token.status === "completed";

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 md:p-6 shadow-sm space-y-5 transition-all",
        isServing
          ? "bg-emerald-50/80 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800 ring-2 ring-emerald-500/20"
          : isCompleted
          ? "bg-slate-50 dark:bg-slate-900/40 border-slate-200"
          : "bg-card border-blue-200 dark:border-blue-900 shadow-blue-500/5"
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/5 dark:border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "p-1.5 rounded-lg text-white font-bold",
                isServing ? "bg-emerald-600 animate-pulse" : "bg-blue-600"
              )}
            >
              <Ticket className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Live Digital Token Tracker
            </span>
          </div>
          <h4 className="text-lg font-black text-slate-900 dark:text-slate-100 mt-1">
            {token.service_name}
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide border",
              isServing
                ? "bg-emerald-600 text-white border-emerald-600 animate-bounce"
                : isCompleted
                ? "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-transparent"
                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-300"
            )}
          >
            {isServing ? "NOW BEING SERVED" : isCompleted ? "COMPLETED" : "WAITING IN QUEUE"}
          </span>
        </div>
      </div>

      {/* Main Grid: My Token vs Current Desk Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Token Number Card */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border text-center space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">Your Token Number</span>
          <div className="text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
            {token.token_number}
          </div>
          <span className="text-[11px] text-muted-foreground block">
            Generated {new Date(token.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Counter & Serving Status */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border text-center space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">Current Serving Desk</span>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {currentServing ? currentServing.token_number : "All Clear"}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block">
            {isServing ? `👉 Proceed to ${token.counter_number || 'Counter 1'} now!` : `Desk: ${token.counter_number || 'Counter 1'}`}
          </span>
        </div>

        {/* Queue Position & ETA */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border text-center space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">Queue Position & ETA</span>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {isServing ? "0 min" : `~${token.estimated_wait_minutes} mins`}
          </div>
          <span className="text-[11px] text-muted-foreground font-medium block">
            {isServing ? "Currently at counter" : `${queuePosition} student(s) ahead of you`}
          </span>
        </div>
      </div>

      {/* Pre-Check verification pill */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-emerald-600" />
          <span>
            Document Verification:{" "}
            <strong className="capitalize">
              {token.precheck_status === 'complete' ? "Pre-Check Verified (Fast-Tracked)" : "Pending Review"}
            </strong>
          </span>
        </div>

        <span className="text-[11px] text-muted-foreground">
          {token.uploaded_documents.length} document(s) attached
        </span>
      </div>
    </div>
  );
}
