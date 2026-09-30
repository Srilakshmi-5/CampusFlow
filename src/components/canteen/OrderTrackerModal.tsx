"use client";

import React from "react";
import { Order, OrderStatus } from "@/types";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency, cn } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  ChefHat,
  ShoppingBag,
  QrCode,
  MapPin,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface OrderTrackerModalProps {
  order: Order;
  open: boolean;
  onClose: () => void;
}

const STEPS: Array<{
  status: OrderStatus;
  label: string;
  desc: string;
  icon: React.ElementType;
}> = [
  { status: "placed", label: "Order Placed", desc: "Received at kitchen", icon: Clock },
  { status: "preparing", label: "Preparing", desc: "Chef is cooking", icon: ChefHat },
  { status: "ready", label: "Ready for Pickup", desc: "Waiting at counter", icon: QrCode },
  { status: "picked_up", label: "Picked Up", desc: "Enjoy your meal!", icon: CheckCircle2 },
];

export function OrderTrackerModal({ order, open, onClose }: OrderTrackerModalProps) {
  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case "placed":
        return 0;
      case "preparing":
        return 1;
      case "ready":
        return 2;
      case "picked_up":
        return 3;
      default:
        return 0;
    }
  };

  const currentStepIndex = getStepIndex(order.status);
  const isReadyOrDone = order.status === "ready" || order.status === "picked_up";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogHeader onClose={onClose}>
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-lg bg-blue-600 text-white">
            <ShoppingBag className="w-4 h-4" />
          </span>
          <div>
            <DialogTitle>Order Status: #{order.order_number}</DialogTitle>
            <p className="text-xs text-muted-foreground mt-0.5">{order.food_court_name}</p>
          </div>
        </div>
      </DialogHeader>

      <DialogContent className="space-y-6">
        {/* Stepper tracker */}
        <div className="py-2">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-100 dark:bg-slate-800 -z-1" />
            <div
              className="absolute top-1/2 left-4 -translate-y-1/2 h-1 bg-blue-600 transition-all duration-500 -z-1"
              style={{
                width: `${(currentStepIndex / (STEPS.length - 1)) * 90}%`,
              }}
            />

            {STEPS.map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const Icon = step.icon;

              return (
                <div key={step.status} className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm",
                      isCurrent
                        ? "bg-blue-600 text-white ring-4 ring-blue-500/20 scale-110"
                        : isPast
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={cn(
                      "text-[11px] mt-2 font-bold whitespace-nowrap text-center",
                      isCurrent
                        ? "text-blue-600 dark:text-blue-400"
                        : isPast
                        ? "text-slate-800 dark:text-slate-200"
                        : "text-slate-400"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hero Pickup QR & Counter Card */}
        <div
          className={cn(
            "p-5 rounded-2xl border text-center space-y-3 transition-colors",
            order.status === "ready"
              ? "bg-emerald-50/80 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800"
              : "bg-slate-50 dark:bg-slate-800/40"
          )}
        >
          {order.status === "ready" && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>READY FOR COLLECTION!</span>
            </div>
          )}

          <div className="space-y-1">
            <span className="text-xs uppercase font-extrabold tracking-wider text-muted-foreground block">
              Pickup Counter
            </span>
            <div className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {order.counter_number}
            </div>
            <p className="text-xs text-muted-foreground">
              Slot: <strong className="text-slate-800 dark:text-slate-200">{order.pickup_slot_time}</strong>
            </p>
          </div>

          {/* QR Code */}
          <div className="inline-block p-3 bg-white rounded-2xl shadow-sm border mx-auto">
            <QRCodeSVG
              value={order.qr_code_data}
              size={140}
              level="H"
              includeMargin={false}
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            Scan this digital token at {order.counter_number} to verify collection
          </p>
        </div>

        {/* Items Summary list */}
        <div className="space-y-2 border-t pt-4 text-xs">
          <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
            <span>Ordered Items:</span>
            <span>{formatCurrency(order.total_amount)}</span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-2 flex items-center justify-between text-muted-foreground">
                <span>
                  {item.quantity}x {item.item_name}
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {formatCurrency(item.subtotal)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
      <DialogFooter>
        <Button onClick={onClose} className="rounded-xl w-full sm:w-auto font-bold bg-blue-600 hover:bg-blue-700">
          Got It, Done
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
