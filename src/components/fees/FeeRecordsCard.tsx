"use client";

import React, { useState } from "react";
import { FeeRecord } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  ReceiptIndianRupee,
  CreditCard,
  Ticket,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Download,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DigitalPaymentModal } from "./DigitalPaymentModal";

interface FeeRecordsCardProps {
  feeRecord: FeeRecord;
  onGenerateCounterToken: () => void;
}

export function FeeRecordsCard({
  feeRecord,
  onGenerateCounterToken,
}: FeeRecordsCardProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const isPaid = feeRecord.status === "paid";

  return (
    <>
      <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-6">
        {/* Header & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-indigo-600 text-white">
                <Building className="w-4 h-4" />
              </span>
              <span className="text-xs uppercase font-extrabold text-indigo-600 dark:text-indigo-400 tracking-wider">
                Bursar & Accounts Office
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">
              {feeRecord.semester}
            </h3>
            <p className="text-xs text-muted-foreground">
              Academic Year: {feeRecord.academic_year} • Student: {feeRecord.user_name}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide border ${
                isPaid
                  ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950 dark:text-rose-300"
              }`}
            >
              {isPaid ? "FEES SETTLED (PAID)" : "OUTSTANDING DUES"}
            </span>
          </div>
        </div>

        {/* Detailed Breakdown Table */}
        <div className="rounded-xl border bg-slate-50/60 dark:bg-slate-800/40 p-4 space-y-3">
          <span className="font-bold text-xs text-slate-700 dark:text-slate-300 block">
            Fee Components Breakdown:
          </span>

          <div className="divide-y divide-slate-200/80 dark:divide-slate-700 text-xs">
            <div className="py-2 flex items-center justify-between">
              <span className="text-muted-foreground">Tuition & Instructional Fee</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {formatCurrency(feeRecord.tuition_fee)}
              </span>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-muted-foreground">Laboratory & Research Facility Dues</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {formatCurrency(feeRecord.lab_fee)}
              </span>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-muted-foreground">Examination & Assessment Fee</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {formatCurrency(feeRecord.exam_fee)}
              </span>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-muted-foreground">University Library & Digital Archives</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {formatCurrency(feeRecord.library_fee)}
              </span>
            </div>

            <div className="py-3 flex items-center justify-between font-black text-sm text-slate-900 dark:text-slate-100 pt-3">
              <span>Total Semester Dues:</span>
              <span className="text-lg text-blue-600 dark:text-blue-400">
                {formatCurrency(feeRecord.total_due)}
              </span>
            </div>
          </div>
        </div>

        {/* Due Date & Settlement Action CTAs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-4 h-4 text-amber-500" />
            <span>
              {isPaid ? (
                <>Paid on {new Date(feeRecord.paid_at || "").toLocaleDateString()} via {feeRecord.payment_method}</>
              ) : (
                <>Due Date: <strong className="text-rose-600 font-bold">{feeRecord.due_date}</strong> (Pay before deadline to avoid late fee)</>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {isPaid ? (
              <Button
                variant="outline"
                onClick={() => setShowPaymentModal(true)}
                className="rounded-xl text-xs font-bold gap-1.5 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              >
                <Download className="w-4 h-4" />
                <span>View Official Receipt</span>
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={onGenerateCounterToken}
                  className="rounded-xl text-xs font-bold gap-1.5"
                >
                  <Ticket className="w-4 h-4 text-indigo-600" />
                  <span>Physical Counter Token</span>
                </Button>

                <Button
                  onClick={() => setShowPaymentModal(true)}
                  className="rounded-xl text-xs font-bold gap-1.5 bg-blue-600 hover:bg-blue-700 shadow-sm"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Instant Digital Payment</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Payment & Receipt Modal */}
      <DigitalPaymentModal
        feeRecord={feeRecord}
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
      />
    </>
  );
}
