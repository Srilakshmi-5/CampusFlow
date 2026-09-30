"use client";

import React from "react";
import { AdminService } from "@/types";
import { useCampusStore } from "@/lib/store/campus-data-store";
import {
  FileCheck2,
  FileText,
  Clock,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminServiceCatalogProps {
  onSelectService: (service: AdminService) => void;
}

export function AdminServiceCatalog({ onSelectService }: AdminServiceCatalogProps) {
  const { adminServices, serviceTokens } = useCampusStore();

  const getIconForCategory = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "certificates":
        return Award;
      case "attestation":
        return FileCheck2;
      case "grievance":
        return HelpCircle;
      default:
        return FileText;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2">
        <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">
          Available Administrative Services
        </h3>
        <span className="text-xs text-muted-foreground">
          Digital Token & Pre-Check System
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {adminServices.map((service) => {
          const Icon = getIconForCategory(service.category);
          const queueCount = serviceTokens.filter(
            (t) => t.service_id === service.id && t.status === "waiting"
          ).length;

          return (
            <div
              key={service.id}
              className="p-5 rounded-2xl border bg-card hover:border-blue-400 transition-all shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                      <Icon className="w-5 h-5" />
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        {service.category}
                      </span>
                      <h4 className="font-bold text-base text-slate-900 dark:text-slate-100 leading-snug">
                        {service.name}
                      </h4>
                    </div>
                  </div>

                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {queueCount} waiting
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {service.description}
                </p>

                {/* Required Documents Checklist */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1.5 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block text-[11px]">
                    Required Documents for Pre-Check:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-muted-foreground text-[11px]">
                    {service.required_documents.map((doc, idx) => (
                      <li key={idx} className="truncate">
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2 border-t flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>~{service.base_processing_minutes} mins turnaround</span>
                </div>

                <Button
                  size="sm"
                  onClick={() => onSelectService(service)}
                  className="rounded-xl font-bold gap-1 text-xs"
                >
                  <span>Pre-Check & Queue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
