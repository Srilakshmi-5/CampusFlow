"use client";

import React, { useState } from "react";
import { AdminService, UploadedDocument, PrecheckStatus } from "@/types";
import { useCampusStore } from "@/lib/store/campus-data-store";
import { useAuthStore } from "@/lib/store/auth-store";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FileCheck2,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DocumentPreCheckModalProps {
  service: AdminService | null;
  open: boolean;
  onClose: () => void;
  onTokenGenerated: () => void;
}

export function DocumentPreCheckModal({
  service,
  open,
  onClose,
  onTokenGenerated,
}: DocumentPreCheckModalProps) {
  const { createServiceToken } = useCampusStore();
  const { currentUser } = useAuthStore();

  // Track uploaded documents mapped by required document name
  const [uploadedMap, setUploadedMap] = useState<Record<string, UploadedDocument>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!service) return null;

  // Toggle simulate file upload
  const handleSimulateUpload = (docName: string) => {
    if (uploadedMap[docName]) {
      // Remove
      const next = { ...uploadedMap };
      delete next[docName];
      setUploadedMap(next);
    } else {
      // Upload
      const sanitizedFile = docName.toLowerCase().replace(/[^a-z0-9]/g, "_") + ".pdf";
      const newDoc: UploadedDocument = {
        name: docName,
        fileName: sanitizedFile,
        sizeBytes: 154000,
        uploadedAt: new Date().toISOString(),
        status: "valid",
      };
      setUploadedMap({ ...uploadedMap, [docName]: newDoc });
      toast.success(`Attached ${sanitizedFile}`);
    }
  };

  // Rule-based validation engine
  const missingDocs = service.required_documents.filter((req) => !uploadedMap[req]);
  const isComplete = missingDocs.length === 0;
  const precheckStatus: PrecheckStatus = isComplete ? "complete" : "missing_docs";

  const handleIssueToken = () => {
    setIsSubmitting(true);
    try {
      const docsArray = Object.values(uploadedMap);
      const notes = isComplete
        ? "All mandatory documents verified via rule-checker"
        : `Missing required: ${missingDocs.join(", ")}`;

      const token = createServiceToken(
        service.id,
        currentUser.id,
        currentUser.full_name,
        docsArray,
        precheckStatus,
        notes
      );

      toast.success(`Token ${token.token_number} generated! Check your queue position below.`);
      onTokenGenerated();
      onClose();
    } catch {
      toast.error("Failed to generate queue token. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogHeader onClose={onClose}>
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-lg bg-blue-600 text-white">
            <FileCheck2 className="w-4 h-4" />
          </span>
          <div>
            <DialogTitle>Document Pre-Check & Token</DialogTitle>
            <p className="text-xs text-muted-foreground">{service.name}</p>
          </div>
        </div>
      </DialogHeader>

      <DialogContent className="space-y-5">
        <p className="text-xs text-muted-foreground">
          Our automated rule-checker validates required documentation before you join the counter queue, eliminating counter turn-aways.
        </p>

        {/* Required Documents Upload Checkpoints */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
            Attach Required Documents (Rule-Validated):
          </label>

          <div className="space-y-2">
            {service.required_documents.map((reqDoc, idx) => {
              const isUploaded = !!uploadedMap[reqDoc];

              return (
                <div
                  key={idx}
                  className={cn(
                    "p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all",
                    isUploaded
                      ? "bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/30 dark:border-emerald-800"
                      : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {isUploaded ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {reqDoc}
                      </div>
                      <span className="text-[10px] text-muted-foreground block">
                        {isUploaded
                          ? `Validated: ${uploadedMap[reqDoc].fileName} (150 KB)`
                          : "Format: PDF, JPG < 5MB"}
                      </span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={isUploaded ? "outline" : "default"}
                    onClick={() => handleSimulateUpload(reqDoc)}
                    className={cn(
                      "text-xs rounded-xl h-8 gap-1.5 shrink-0",
                      isUploaded
                        ? "text-rose-600 hover:bg-rose-50 border-rose-200"
                        : "bg-blue-600 hover:bg-blue-700"
                    )}
                  >
                    {isUploaded ? (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Attach File</span>
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Validation Result Box */}
        <div
          className={cn(
            "p-4 rounded-xl border text-xs space-y-1.5 transition-colors",
            isComplete
              ? "bg-emerald-50 text-emerald-900 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-200"
              : "bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-950/40 dark:text-amber-200"
          )}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            {isComplete ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Pre-Check Status: Complete (Passed)</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Pre-Check Status: Missing Required Documents</span>
              </>
            )}
          </div>
          <p className="text-[11px] leading-relaxed">
            {isComplete
              ? "All required documents are validated and verified. Your digital token will be assigned top priority."
              : `You have missing document(s): ${missingDocs.join(", ")}. You can still queue, but staff will request physical verification.`}
          </p>
        </div>
      </DialogContent>

      <DialogFooter>
        <Button variant="outline" onClick={onClose} className="rounded-xl">
          Cancel
        </Button>
        <Button
          onClick={handleIssueToken}
          disabled={isSubmitting}
          className="rounded-xl font-bold bg-blue-600 hover:bg-blue-700 gap-1.5"
        >
          <span>{isSubmitting ? "Issuing..." : "Generate Digital Token"}</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
