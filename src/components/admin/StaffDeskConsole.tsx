"use client";

import React, { useState } from "react";
import { useCampusStore } from "@/lib/store/campus-data-store";
import { ServiceToken } from "@/types";
import {
  FileCheck2,
  Bell,
  CheckCircle2,
  Clock,
  User,
  FileText,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function StaffDeskConsole() {
  const { serviceTokens, advanceServiceToken } = useCampusStore();
  const [selectedCounter, setSelectedCounter] = useState("Counter 1");

  const servingToken = serviceTokens.find(
    (t) => t.status === "serving" && (t.counter_number === selectedCounter || !t.counter_number)
  );

  const waitingTokens = serviceTokens.filter((t) => t.status === "waiting");
  const completedTokens = serviceTokens.filter((t) => t.status === "completed");

  const handleCallNext = () => {
    if (waitingTokens.length === 0) {
      toast.info("No waiting tokens in the queue!");
      return;
    }

    const nextToken = waitingTokens[0];
    advanceServiceToken(nextToken.id, "serving", selectedCounter);
    toast.success(`Calling Token ${nextToken.token_number} to ${selectedCounter}`);
  };

  const handleCompleteServing = () => {
    if (!servingToken) return;
    advanceServiceToken(servingToken.id, "completed", selectedCounter);
    toast.success(`Token ${servingToken.token_number} marked as completed!`);
  };

  return (
    <div className="space-y-6">
      {/* Header & Counter Selection */}
      <div className="p-5 rounded-2xl bg-card border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-emerald-600 text-white">
              <FileCheck2 className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-extrabold text-emerald-600 tracking-wider">
              Registry & Certificate Desk Console
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1">
            Service Queue Dispatcher
          </h2>
          <p className="text-xs text-muted-foreground">
            Call student tokens sequentially, verify uploaded documents, and complete certificate applications.
          </p>
        </div>

        {/* Counter selector */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {["Counter 1", "Counter 2"].map((counter) => (
            <button
              key={counter}
              onClick={() => setSelectedCounter(counter)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                selectedCounter === counter
                  ? "bg-white dark:bg-slate-900 shadow-sm text-blue-600 dark:text-blue-400 font-extrabold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              )}
            >
              {counter}
            </button>
          ))}
        </div>
      </div>

      {/* Main Active Serving Desk */}
      <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b">
          <span className="text-xs uppercase font-extrabold text-muted-foreground tracking-wider">
            {selectedCounter} Active Ticket
          </span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
            {waitingTokens.length} waiting in line
          </span>
        </div>

        {servingToken ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-emerald-50/70 border border-emerald-300 dark:bg-emerald-950/30 dark:border-emerald-800">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-400">
                  Now Serving at {selectedCounter}:
                </span>
                <div className="text-3xl font-black text-slate-900 dark:text-slate-100">
                  Token #{servingToken.token_number}
                </div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Student: {servingToken.user_name}</span>
                  <span>•</span>
                  <span>Service: {servingToken.service_name}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={handleCompleteServing}
                  className="rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 gap-1.5 shadow-sm text-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Done & Next</span>
                </Button>
              </div>
            </div>

            {/* Document Inspection Drawer */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-500" />
                  Attached Pre-Checked Documents:
                </span>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] uppercase font-extrabold",
                    servingToken.precheck_status === 'complete'
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                  )}
                >
                  {servingToken.precheck_status === 'complete' ? "Pre-check: Validated" : "Pre-check: Missing Docs"}
                </span>
              </div>

              {servingToken.uploaded_documents.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No digital attachments provided.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {servingToken.uploaded_documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border bg-white dark:bg-slate-900 flex items-center justify-between text-xs"
                    >
                      <div className="truncate">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
                          {doc.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{doc.fileName}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200">
                        Verified
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 space-y-3">
            <p className="text-xs text-muted-foreground">
              No token is currently called at {selectedCounter}.
            </p>
            <Button
              onClick={handleCallNext}
              disabled={waitingTokens.length === 0}
              className="rounded-xl font-bold bg-blue-600 hover:bg-blue-700 gap-1.5 shadow-sm"
            >
              <Bell className="w-4 h-4" />
              <span>Call Next Token ({waitingTokens.length} in queue)</span>
            </Button>
          </div>
        )}
      </div>

      {/* Waiting Tokens Pipeline Table */}
      <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500" />
          <span>Pending Student Queue ({waitingTokens.length})</span>
        </h4>

        {waitingTokens.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">
            The queue is currently clear!
          </p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {waitingTokens.map((token, idx) => (
              <div
                key={token.id}
                className="py-3 flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 font-bold flex items-center justify-center text-[11px] text-slate-600 dark:text-slate-400">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                      {token.token_number}
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      Student: <strong>{token.user_name}</strong> • {token.service_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                      token.precheck_status === 'complete'
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    )}
                  >
                    {token.precheck_status === 'complete' ? "Docs Validated" : "Missing Docs"}
                  </span>

                  <span className="text-slate-500 font-semibold text-[11px]">
                    ~{token.estimated_wait_minutes}m wait
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
