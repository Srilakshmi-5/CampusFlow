"use client";

import React from "react";
import { useAuthStore, DEMO_PROFILES } from "@/lib/store/auth-store";
import { UserRole } from "@/types";
import {
  GraduationCap,
  UtensilsCrossed,
  BookOpen,
  FileCheck2,
  ReceiptIndianRupee,
  ShieldAlert,
  ArrowRightLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ROLE_ITEMS: Array<{
  role: UserRole;
  label: string;
  badge: string;
  icon: React.ElementType;
}> = [
  { role: "student", label: "Student", badge: "Aarav", icon: GraduationCap },
  { role: "kitchen_staff", label: "Kitchen Staff", badge: "Chef Vikram", icon: UtensilsCrossed },
  { role: "librarian", label: "Librarian", badge: "Dr. Meenakshi", icon: BookOpen },
  { role: "admin_staff", label: "Admin Staff", badge: "Officer Rajesh", icon: FileCheck2 },
  { role: "fees_staff", label: "Fees Staff", badge: "Desk Sunita", icon: ReceiptIndianRupee },
  { role: "super_admin", label: "Super Admin", badge: "Provost", icon: ShieldAlert },
];

export function RoleSwitcherBanner() {
  const { currentUser, setRole } = useAuthStore();

  return (
    <aside aria-label="Demo role selector" className="bg-slate-900 text-white text-xs border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium text-slate-300">
          <ArrowRightLeft className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Role Switcher:</span>
          <span className="text-white font-semibold flex items-center gap-1.5 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {currentUser.full_name} ({currentUser.role.replace('_', ' ')})
          </span>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto py-0.5 scrollbar-none">
          {ROLE_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentUser.role === item.role;
            return (
              <button
                key={item.role}
                onClick={() => setRole(item.role)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap",
                  isActive
                    ? "bg-blue-600 text-white shadow-sm ring-1 ring-blue-400"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                )}
                title={`Switch persona to ${DEMO_PROFILES[item.role].full_name}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
