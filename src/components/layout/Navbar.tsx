"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCartStore } from "@/lib/store/cart-store";
import { useCampusStore } from "@/lib/store/campus-data-store";
import {
  Sparkles,
  UtensilsCrossed,
  BookOpen,
  FileCheck2,
  ReceiptIndianRupee,
  LayoutDashboard,
  Bell,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogHeader, DialogTitle, DialogContent } from "@/components/ui/dialog";

export function Navbar() {
  const pathname = usePathname();
  const { currentUser } = useAuthStore();
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const { notifications, markNotificationRead } = useCampusStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const NAV_LINKS = [
    { href: "/canteen", label: "Canteen", icon: UtensilsCrossed, badge: "Flagship" },
    { href: "/library", label: "Library", icon: BookOpen },
    { href: "/admin-services", label: "Admin Services", icon: FileCheck2 },
    { href: "/fees", label: "Fees Counter", icon: ReceiptIndianRupee },
    { href: "/admin", label: "Campus Intelligence", icon: LayoutDashboard },
  ];

  return (
    <>
      <header className="sticky top-[37px] z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo & Tagline */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  CampusFlow
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                  Live
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium hidden sm:block">
                Know Before You Go
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/60"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-600 text-white leading-none">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Bell */}
            <button
              onClick={() => setShowNotifications(true)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Quick Canteen Cart Link */}
            <Link
              href="/canteen#cart"
              className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 transition-colors text-sm font-medium"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartItemCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-xs font-bold leading-none">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Profile Avatar Pill */}
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 text-white font-bold text-xs flex items-center justify-center">
                {currentUser.full_name.charAt(0)}
              </div>
              <div className="text-left text-xs leading-tight">
                <p className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[110px]">
                  {currentUser.full_name}
                </p>
                <p className="text-[10px] text-muted-foreground capitalize">
                  {currentUser.role.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Notifications Dialog */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogHeader onClose={() => setShowNotifications(false)}>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <DialogTitle>Campus Notifications</DialogTitle>
          </div>
        </DialogHeader>
        <DialogContent className="max-h-[60vh] space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No notifications yet.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={cn(
                  "p-3.5 rounded-xl border text-sm transition-all cursor-pointer",
                  notif.read
                    ? "bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800"
                    : "bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                    {notif.type === 'order' && <UtensilsCrossed className="w-4 h-4 text-amber-500" />}
                    {notif.type === 'library' && <BookOpen className="w-4 h-4 text-blue-500" />}
                    {notif.type === 'admin' && <FileCheck2 className="w-4 h-4 text-emerald-500" />}
                    {notif.type === 'fee' && <ReceiptIndianRupee className="w-4 h-4 text-indigo-500" />}
                    <span>{notif.title}</span>
                  </div>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 mt-1" />
                  )}
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  {notif.message}
                </p>
                <div className="mt-2 text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
