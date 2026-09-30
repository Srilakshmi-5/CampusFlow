"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCampusStore } from "@/lib/store/campus-data-store";
import { AdminServiceCatalog } from "@/components/admin/AdminServiceCatalog";
import { DocumentPreCheckModal } from "@/components/admin/DocumentPreCheckModal";
import { LiveQueueTokenCard } from "@/components/admin/LiveQueueTokenCard";
import { StaffDeskConsole } from "@/components/admin/StaffDeskConsole";
import { AdminService } from "@/types";
import {
  FileCheck2,
  FileText,
  Clock,
  Ticket,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";

export default function AdminServicesPage() {
  const { currentUser } = useAuthStore();
  const { serviceTokens } = useCampusStore();

  const [activeTab, setActiveTab] = useState<string>(
    currentUser.role === "admin_staff" ? "staff" : "student"
  );
  const [selectedService, setSelectedService] = useState<AdminService | null>(null);

  // Filter tokens belonging to current student
  const myTokens = serviceTokens.filter(
    (t) => t.user_id === currentUser.id || currentUser.role === "super_admin"
  );

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-emerald-600 text-white shadow-sm">
              <FileCheck2 className="w-5 h-5" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Registrar & Student Services
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Admin Services & Digital Tokens
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            Pre-check documentation with automated rule verification and track live counter queue tokens.
          </p>
        </div>

        {/* View Switcher: Student vs Staff Console */}
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
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-card border text-slate-600 hover:bg-slate-100 dark:text-slate-300"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Staff Desk Console</span>
          </button>
        </div>
      </div>

      {activeTab === "staff" ? (
        <StaffDeskConsole />
      ) : (
        <div className="space-y-8">
          {/* Active Tokens for this Student */}
          {myTokens.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-blue-600" />
                <span>Your Active Queue Tokens ({myTokens.length})</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myTokens.map((token) => (
                  <LiveQueueTokenCard key={token.id} token={token} />
                ))}
              </div>
            </div>
          )}

          {/* Services Catalog */}
          <AdminServiceCatalog
            onSelectService={(service) => setSelectedService(service)}
          />
        </div>
      )}

      {/* Document Pre-Check & Token Generation Modal */}
      {selectedService && (
        <DocumentPreCheckModal
          service={selectedService}
          open={!!selectedService}
          onClose={() => setSelectedService(null)}
          onTokenGenerated={() => setSelectedService(null)}
        />
      )}
    </div>
  );
}
