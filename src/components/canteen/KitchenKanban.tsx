"use client";

import React, { useState, useMemo } from "react";
import { useCampusStore } from "@/lib/store/campus-data-store";
import { Order, OrderStatus } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import {
  ChefHat,
  Clock,
  CheckCircle2,
  PackageCheck,
  TrendingUp,
  AlertCircle,
  Filter,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function KitchenKanban() {
  const { orders, updateOrderStatus, foodCourts } = useCampusStore();
  const [selectedCourtId, setSelectedCourtId] = useState<string>("fc-1");

  const courtOrders = useMemo(() => {
    return orders.filter((o) => o.food_court_id === selectedCourtId);
  }, [orders, selectedCourtId]);

  // Columns for Kanban
  const placedOrders = courtOrders.filter((o) => o.status === "placed");
  const preparingOrders = courtOrders.filter((o) => o.status === "preparing");
  const readyOrders = courtOrders.filter((o) => o.status === "ready");
  const pickedUpOrders = courtOrders.filter((o) => o.status === "picked_up");

  // Demand aggregation: item name -> total quantity ordered
  const demandSummary = useMemo(() => {
    const map: Record<string, number> = {};
    courtOrders.forEach((o) => {
      o.items.forEach((item) => {
        map[item.item_name] = (map[item.item_name] || 0) + item.quantity;
      });
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [courtOrders]);

  const handleAdvanceStatus = (order: Order) => {
    if (order.status === "placed") {
      updateOrderStatus(order.id, "preparing");
      toast.success(`Order #${order.order_number} marked as PREPARING`);
    } else if (order.status === "preparing") {
      updateOrderStatus(order.id, "ready", "Counter 1");
      toast.success(`Order #${order.order_number} marked as READY FOR PICKUP`);
    } else if (order.status === "ready") {
      updateOrderStatus(order.id, "picked_up");
      toast.success(`Order #${order.order_number} marked as PICKED UP`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Food Court switcher & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-card border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-amber-500 text-white">
              <ChefHat className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-extrabold text-amber-600 tracking-wider">
              Kitchen Display System (KDS)
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1">
            Live Kitchen Order Pipeline
          </h2>
          <p className="text-xs text-muted-foreground">
            Bumping orders updates student tracking screens in real-time.
          </p>
        </div>

        {/* Food Court switcher */}
        <div className="flex items-center gap-2">
          {foodCourts.map((court) => (
            <button
              key={court.id}
              onClick={() => setSelectedCourtId(court.id)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold border transition-all",
                selectedCourtId === court.id
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-background text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              )}
            >
              {court.name}
            </button>
          ))}
        </div>
      </div>

      {/* Demand Counter Summary Banner (Today's batch prep counts) */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/60 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
          <TrendingUp className="w-4 h-4 text-amber-600" />
          <span>Today's Batch Demand Aggregator (Preparation Quantities):</span>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {demandSummary.map(([itemName, count]) => (
            <div
              key={itemName}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border text-xs font-semibold shadow-xs"
            >
              <span className="text-slate-700 dark:text-slate-300">{itemName}:</span>
              <span className="font-extrabold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.2 rounded">
                {count} ordered
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Kanban Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Column 1: Placed / Queued */}
        <div className="rounded-2xl border bg-slate-50 dark:bg-slate-900/40 p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-slate-100">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Incoming / Queued</span>
            </div>
            <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {placedOrders.length}
            </span>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {placedOrders.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No new incoming orders</p>
            ) : (
              placedOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-xl border bg-card shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                      #{order.order_number}
                    </span>
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      Slot: {order.pickup_slot_time}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Student: {order.user_name}
                  </p>

                  <div className="border-t border-b py-2 space-y-1 text-xs">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {item.quantity}x {item.item_name}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleAdvanceStatus(order)}
                    className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold gap-1.5"
                  >
                    <ChefHat className="w-3.5 h-3.5" />
                    <span>Start Preparing</span>
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: In Preparation */}
        <div className="rounded-2xl border bg-slate-50 dark:bg-slate-900/40 p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-slate-100">
              <ChefHat className="w-4 h-4 text-amber-500" />
              <span>Cooking in Kitchen</span>
            </div>
            <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
              {preparingOrders.length}
            </span>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {preparingOrders.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No orders currently cooking</p>
            ) : (
              preparingOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-xl border bg-card shadow-sm space-y-3 border-amber-200 dark:border-amber-900"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                      #{order.order_number}
                    </span>
                    <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                      Slot: {order.pickup_slot_time}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Student: {order.user_name}
                  </p>

                  <div className="border-t border-b py-2 space-y-1 text-xs">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {item.quantity}x {item.item_name}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleAdvanceStatus(order)}
                    className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Ready for Pickup</span>
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Ready at Counter */}
        <div className="rounded-2xl border bg-slate-50 dark:bg-slate-900/40 p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Ready at Counter</span>
            </div>
            <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
              {readyOrders.length}
            </span>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {readyOrders.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No orders waiting at counter</p>
            ) : (
              readyOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-xl border bg-card shadow-sm space-y-3 border-emerald-200 dark:border-emerald-900"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                      #{order.order_number}
                    </span>
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-emerald-600 text-white">
                      {order.counter_number}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Student: {order.user_name}
                  </p>

                  <div className="border-t border-b py-2 space-y-1 text-xs">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {item.quantity}x {item.item_name}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAdvanceStatus(order)}
                    className="w-full rounded-xl text-xs font-bold gap-1.5 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  >
                    <PackageCheck className="w-3.5 h-3.5" />
                    <span>Verify QR & Mark Picked Up</span>
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
