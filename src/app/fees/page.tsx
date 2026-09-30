"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCampusStore } from "@/lib/store/campus-data-store";
import { FeeRecordsCard } from "@/components/fees/FeeRecordsCard";
import { FeeCounterTokenCard } from "@/components/fees/FeeCounterTokenCard";
import { FeesStaffConsole } from "@/components/fees/FeesStaffConsole";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ReceiptIndianRupee,
  CreditCard,
  Ticket,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";

export default function FeesPage() {
  const { currentUser } = useAuthStore();
  const { feeRecords, feeTokens, createFeeToken } = useCampusStore();

  const [activeTab, setActiveTab] = useState<string>(
    currentUser.role === "fees_staff" ? "staff" : "student"
  );
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [tokenPurpose, setTokenPurpose] = useState("Fee Payment Verification & Challan");

  // Current student's fee record
  const studentRecord = feeRecords.find(
    (r) => r.user_id === currentUser.id || currentUser.role === "super_admin"
  ) || feeRecords[0];

  // Current student's tokens
  const myTokens = feeTokens.filter(
    (t) => t.user_id === currentUser.id || currentUser.role === "super_admin"
  );

  const handleIssueToken = () => {
    createFeeToken(currentUser.id, currentUser.full_name, tokenPurpose);
    setShowTokenDialog(false);
    toast.success("Physical counter token generated! Please check queue details.");
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-indigo-600 text-white shadow-sm">
              <ReceiptIndianRupee className="w-5 h-5" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Finance & Bursar Gateway
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Tuition & Fee Counter Intelligence
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            Settle outstanding semester dues digitally with instant receipts or generate digital tokens for in-person cash counters.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("student")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "student"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-card border text-slate-600 hover:bg-slate-100 dark:text-slate-300"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student Portal</span>
          </button>

          <button
            onClick={() => setActiveTab("staff")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "staff"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-card border text-slate-600 hover:bg-slate-100 dark:text-slate-300"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Fees Staff Console</span>
          </button>
        </div>
      </div>

      {activeTab === "staff" ? (
        <FeesStaffConsole />
      ) : (
        <div className="space-y-8">
          {/* Active Tokens */}
          {myTokens.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-indigo-600" />
                <span>Your Active Counter Tokens ({myTokens.length})</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myTokens.map((token) => (
                  <FeeCounterTokenCard key={token.id} token={token} />
                ))}
              </div>
            </div>
          )}

          {/* Student Fee Record Card */}
          {studentRecord && (
            <FeeRecordsCard
              feeRecord={studentRecord}
              onGenerateCounterToken={() => setShowTokenDialog(true)}
            />
          )}
        </div>
      )}

      {/* Generate Physical Counter Token Dialog */}
      <Dialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
        <DialogHeader onClose={() => setShowTokenDialog(false)}>
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-indigo-600" />
            <DialogTitle>Get In-Person Counter Ticket</DialogTitle>
          </div>
        </DialogHeader>

        <DialogContent className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Generate a digital token before walking to the physical Finance Office to avoid standing in counter lines.
          </p>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              Purpose of Visit:
            </label>
            <select
              value={tokenPurpose}
              onChange={(e) => setTokenPurpose(e.target.value)}
              className="w-full h-10 rounded-xl border bg-background px-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Fee Payment Verification & Challan">Fee Payment Verification & Challan</option>
              <option value="Cash / Cheque Fee Deposit">Cash / Cheque Fee Deposit</option>
              <option value="Scholarship & Fee Concession Query">Scholarship & Fee Concession Query</option>
              <option value="Refund & Security Deposit Clearance">Refund & Security Deposit Clearance</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 text-xs text-slate-600 dark:text-slate-300">
            ℹ️ <span className="font-semibold">Notice:</span> Counters 1 & 2 are open from 09:30 AM to 04:30 PM on academic working days.
          </div>
        </DialogContent>

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowTokenDialog(false)} className="rounded-xl">
            Cancel
          </Button>
          <Button
            onClick={handleIssueToken}
            className="rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700"
          >
            Generate Counter Token
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
