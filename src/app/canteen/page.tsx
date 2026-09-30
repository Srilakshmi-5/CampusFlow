"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCampusStore } from "@/lib/store/campus-data-store";
import { FoodCourtLiveCard } from "@/components/canteen/FoodCourtLiveCard";
import { HeroCanIMakeItToClass } from "@/components/canteen/HeroCanIMakeItToClass";
import { MenuCatalog } from "@/components/canteen/MenuCatalog";
import { CartDrawer } from "@/components/canteen/CartDrawer";
import { KitchenKanban } from "@/components/canteen/KitchenKanban";
import { OrderTrackerModal } from "@/components/canteen/OrderTrackerModal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Order } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  UtensilsCrossed,
  ChefHat,
  Clock,
  QrCode,
  SlidersHorizontal,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CanteenPage() {
  const { currentUser } = useAuthStore();
  const {
    orders,
    foodCourts,
    updateFoodCourtOccupancy,
    toggleRushSimulation,
    isPeakRushSimulated,
  } = useCampusStore();

  const [activeTab, setActiveTab] = useState<string>(
    currentUser.role === "kitchen_staff" ? "kitchen" : "student"
  );
  const [filterQuickOnly, setFilterQuickOnly] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);

  // Student's own orders
  const myOrders = orders.filter(
    (o) => o.user_id === currentUser.id || currentUser.role === "super_admin"
  );

  return (
    <div className="space-y-8">
      {/* Top Header & Role View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-orange-600 text-white shadow-sm">
              <UtensilsCrossed className="w-5 h-5" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-orange-600 dark:text-orange-400">
              Flagship Module
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Smart Canteen & Pre-Ordering
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            Skip physical food queues with intelligent prep scheduling and load-balanced pickup slots.
          </p>
        </div>

        {/* View Switcher: Student Order vs Kitchen Staff KDS */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("student")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "student"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-card border text-slate-600 hover:bg-slate-100 dark:text-slate-300"
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Student View</span>
          </button>

          <button
            onClick={() => setActiveTab("kitchen")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "kitchen"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-card border text-slate-600 hover:bg-slate-100 dark:text-slate-300"
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Kitchen Staff KDS</span>
          </button>

          {/* Quick Simulation Trigger */}
          <button
            onClick={toggleRushSimulation}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              isPeakRushSimulated
                ? "bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300"
                : "bg-card text-slate-600 border-slate-200 hover:bg-slate-50 dark:text-slate-300"
            }`}
            title="Toggle simulated lunch rush crowd spike"
          >
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>{isPeakRushSimulated ? "Rush: ON" : "Simulate Rush"}</span>
          </button>
        </div>
      </div>

      {activeTab === "kitchen" ? (
        <KitchenKanban />
      ) : (
        <div className="space-y-8">
          {/* 1. Live Food Court Status & Sensor Metrics */}
          <FoodCourtLiveCard />

          {/* 2. Hero Feature: "Can I make it to class?" */}
          <HeroCanIMakeItToClass
            onFilterQuickMeals={() => setFilterQuickOnly(true)}
          />

          {/* 3. My Active Orders Bar (if any) */}
          {myOrders.length > 0 && (
            <div className="p-4 rounded-2xl border bg-blue-50/60 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600 animate-spin" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Your Active Pre-Orders ({myOrders.length})
                  </h4>
                </div>
                <span className="text-xs text-muted-foreground">Click order to view live QR token</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {myOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setTrackedOrder(order)}
                    className="p-3.5 rounded-xl border bg-card hover:border-blue-500 transition-all cursor-pointer shadow-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-slate-100">
                        <span>#{order.order_number}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-extrabold ${
                            order.status === "ready"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 animate-pulse"
                              : order.status === "preparing"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Slot: {order.pickup_slot_time} • {order.counter_number}
                      </p>
                    </div>

                    <QrCode className="w-6 h-6 text-slate-400 group-hover:text-blue-600" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Menu & Ordering Drawer Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <MenuCatalog filterOnlyQuickMeals={filterQuickOnly} />
            </div>

            <div className="lg:col-span-4 sticky top-28">
              <CartDrawer />
            </div>
          </div>
        </div>
      )}

      {/* Tracked Order Modal */}
      {trackedOrder && (
        <OrderTrackerModal
          order={trackedOrder}
          open={!!trackedOrder}
          onClose={() => setTrackedOrder(null)}
        />
      )}
    </div>
  );
}
