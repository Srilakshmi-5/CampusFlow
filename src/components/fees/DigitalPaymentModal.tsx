"use client";

import React, { useState } from "react";
import { FeeRecord } from "@/types";
import { useCampusStore } from "@/lib/store/campus-data-store";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import {
  CreditCard,
  QrCode,
  Building2,
  CheckCircle2,
  Printer,
  Download,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

interface DigitalPaymentModalProps {
  feeRecord: FeeRecord;
  open: boolean;
  onClose: () => void;
}

export function DigitalPaymentModal({
  feeRecord,
  open,
  onClose,
}: DigitalPaymentModalProps) {
  const { payFeeRecord } = useCampusStore();
  const [selectedMethod, setSelectedMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [isProcessing, setIsProcessing] = useState(false);

  const isAlreadyPaid = feeRecord.status === "paid";

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      payFeeRecord(feeRecord.id, selectedMethod.toUpperCase());
      setIsProcessing(false);
      toast.success("Payment confirmed! Official digital receipt generated.");
    }, 1000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogHeader onClose={onClose}>
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-lg bg-blue-600 text-white">
            <CreditCard className="w-4 h-4" />
          </span>
          <div>
            <DialogTitle>
              {isAlreadyPaid ? "Official Electronic Fee Receipt" : "University Fee Payment Gateway"}
            </DialogTitle>
            <p className="text-xs text-muted-foreground">{feeRecord.semester}</p>
          </div>
        </div>
      </DialogHeader>

      <DialogContent className="space-y-5">
        {isAlreadyPaid ? (
          /* Official Printable Receipt View */
          <div className="p-6 rounded-2xl border-2 border-dashed border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/20 space-y-4 printable-receipt">
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Transaction Authenticated
                </span>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                  CampusFlow Central Bursar Receipt
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Receipt Ref: <strong className="text-slate-800 dark:text-slate-200">{feeRecord.receipt_number || "REC-CF-948102"}</strong>
                </p>
              </div>

              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-7 h-7" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px]">Student Name:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{feeRecord.user_name}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Payment Timestamp:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {new Date(feeRecord.paid_at || Date.now()).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Settled Via:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{feeRecord.payment_method || "ONLINE UPI"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Total Paid:</span>
                <span className="font-black text-sm text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(feeRecord.total_due)}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t text-[11px] text-slate-600 dark:text-slate-400 text-center">
              ✓ Digitally stamped and signed by the Dean of Finance & Accounts.
            </div>
          </div>
        ) : (
          /* Payment Method Selection & Checkout */
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border space-y-1">
              <span className="text-xs text-muted-foreground">Amount to Pay</span>
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
                {formatCurrency(feeRecord.total_due)}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Zero gateway convenience fees for registered campus students.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Select Digital Payment Mode:
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod("upi")}
                  className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                    selectedMethod === "upi"
                      ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 ring-2 ring-blue-500/20"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <QrCode className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                  <span>Instant UPI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod("card")}
                  className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                    selectedMethod === "card"
                      ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 ring-2 ring-blue-500/20"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1 text-indigo-600" />
                  <span>Debit / Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod("netbanking")}
                  className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                    selectedMethod === "netbanking"
                      ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 ring-2 ring-blue-500/20"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <Building2 className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                  <span>NetBanking</span>
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 text-xs text-blue-900 dark:text-blue-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Simulated Payment Gateway: Click below to authorize instant clearance.</span>
            </div>
          </div>
        )}
      </DialogContent>

      <DialogFooter>
        {isAlreadyPaid ? (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handlePrint}
              className="rounded-xl text-xs font-bold gap-1.5 flex-1 sm:flex-none"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </Button>
            <Button onClick={onClose} className="rounded-xl text-xs font-bold flex-1 sm:flex-none">
              Done
            </Button>
          </div>
        ) : (
          <>
            <Button variant="outline" onClick={onClose} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={handleProcessPayment}
              disabled={isProcessing}
              className="rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 gap-1.5 shadow-sm text-xs"
            >
              <span>{isProcessing ? "Authorizing Payment..." : `Authorize & Pay ${formatCurrency(feeRecord.total_due)}`}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </>
        )}
      </DialogFooter>
    </Dialog>
  );
}
