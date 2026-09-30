"use client";

import React, { useState } from "react";
import { useCartStore } from "@/lib/store/cart-store";
import { useCampusStore } from "@/lib/store/campus-data-store";
import { useAuthStore } from "@/lib/store/auth-store";
import { checkSlotCapacity } from "@/lib/intelligence/queue-engine";
import { formatCurrency, cn } from "@/lib/utils";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChefHat,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { OrderTrackerModal } from "./OrderTrackerModal";
import { Order } from "@/types";

export function CartDrawer() {
  const {
    items,
    foodCourtId,
    selectedSlotId,
    selectedSlotTime,
    setSlot,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalAmount,
    getItemCount,
    getMaxPrepTime,
    isDineIn,
  } = useCartStore();

  const { foodCourts, pickupSlots, createOrder } = useCampusStore();
  const { currentUser } = useAuthStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  const activeCourt = foodCourts.find((f) => f.id === foodCourtId) || foodCourts[0];
  const courtSlots = pickupSlots.filter((s) => s.food_court_id === foodCourtId);

  // Auto-select first available slot if not selected or invalid for this court
  React.useEffect(() => {
    if (courtSlots.length > 0) {
      const isCurrentSlotValid = courtSlots.some((s) => s.id === selectedSlotId);
      if (!selectedSlotId || !isCurrentSlotValid) {
        const firstAvailable = courtSlots.find((s) => s.status !== "full") || courtSlots[0];
        if (firstAvailable) {
          setSlot(firstAvailable.id, firstAvailable.slot_time);
        }
      }
    }
  }, [selectedSlotId, courtSlots, setSlot]);

  const totalAmount = getTotalAmount();
  const itemCount = getItemCount();
  const maxPrep = getMaxPrepTime();

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty! Please add some dishes from the menu.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Resolve slot id and time with safe fallbacks
      let slotId = selectedSlotId;
      let slotTime = selectedSlotTime;
      if (!slotId && courtSlots.length > 0) {
        const fallbackSlot = courtSlots.find((s) => s.status !== "full") || courtSlots[0];
        slotId = fallbackSlot.id;
        slotTime = fallbackSlot.slot_time;
        setSlot(slotId, slotTime);
      }

      const orderData = {
        user_id: currentUser?.id || "11111111-1111-1111-1111-111111111111",
        user_name: currentUser?.full_name || "Aarav Sharma",
        food_court_id: foodCourtId || "fc-1",
        food_court_name: activeCourt?.name || "Central Dining Commons",
        pickup_slot_id: slotId || "slot-1",
        pickup_slot_time: slotTime || "12:00 PM - 12:10 PM",
        status: "placed" as const,
        total_amount: totalAmount,
        estimated_ready_time: new Date(Date.now() + (maxPrep + 5) * 60000).toISOString(),
        qr_code_data: `CF-ORD-SECURE-${Date.now()}`,
        counter_number: "Counter 1",
        items: items.map((i) => ({
          id: `oi-${Date.now()}-${i.item.id}`,
          order_id: "",
          menu_item_id: i.item.id,
          item_name: i.item.name,
          quantity: i.quantity,
          unit_price: i.item.price,
          subtotal: i.item.price * i.quantity,
        })),
      };

      const newOrder = createOrder(orderData);
      clearCart();
      setCreatedOrder(newOrder);
      toast.success(`Order placed successfully! Token #${newOrder.order_number}`);
    } catch (err) {
      console.error("Order placement error:", err);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div id="cart" className="rounded-2xl border bg-card p-5 md:p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b">
          <div className="flex items-center gap-2 font-black text-lg text-slate-900 dark:text-slate-100">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <span>Your Pre-Order Cart</span>
            {itemCount > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                {itemCount} items
              </span>
            )}
          </div>

          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center mx-auto text-blue-600">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
              Your tray is currently empty
            </p>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Select dishes from the menu above to build your order and reserve a fast pickup slot.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Items list */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-64 overflow-y-auto pr-1">
              {items.map(({ item, quantity }) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                      {item.name}
                    </h5>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <span>{formatCurrency(item.price)} each</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-medium">
                        <Clock className="w-3 h-3" />
                        {item.prep_time_minutes}m prep
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center shadow-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100 w-16 text-right">
                      {formatCurrency(item.price * quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Smart Pickup Slot Load Distribution */}
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  Select Pickup Window (Smart Load-Balanced):
                </span>
                <span className="text-[11px] text-muted-foreground">Max 45 orders/slot</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {courtSlots.map((slot) => {
                  const isSelected = selectedSlotId === slot.id;
                  const capacity = checkSlotCapacity(slot.current_orders_count, slot.max_capacity);
                  const isFull = capacity.status === 'full';

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={isFull}
                      onClick={() => setSlot(slot.id, slot.slot_time)}
                      className={cn(
                        "p-2.5 rounded-xl border text-left transition-all text-xs flex items-center justify-between",
                        isSelected
                          ? "border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 font-semibold ring-2 ring-blue-500/20"
                          : isFull
                          ? "opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      )}
                    >
                      <span className="font-bold truncate">{slot.slot_time}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded text-[10px] font-bold",
                            isFull
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                              : capacity.status === 'almost_full'
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                              : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          )}
                        >
                          {slot.current_orders_count}/{slot.max_capacity} orders
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Total Price & Prep estimation breakdown */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border space-y-2 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Estimated Prep Time:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  ~{maxPrep} mins
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Dining Preference:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {isDineIn ? "Dine-In Table" : "Takeaway Express"}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t font-black text-base text-slate-900 dark:text-slate-100">
                <span>Total Amount:</span>
                <span className="text-lg text-blue-600 dark:text-blue-400">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <Button
              size="lg"
              onClick={handleCheckout}
              disabled={isSubmitting || items.length === 0}
              className="w-full rounded-xl py-3 text-base font-extrabold shadow-md gap-2"
            >
              <span>{isSubmitting ? "Confirming Order..." : "Confirm & Place Pre-Order"}</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Order Status Modal after checkout */}
      {createdOrder && (
        <OrderTrackerModal
          order={createdOrder}
          open={!!createdOrder}
          onClose={() => setCreatedOrder(null)}
        />
      )}
    </>
  );
}
