"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useCampusStore } from "@/lib/store/campus-data-store";
import { useCartStore } from "@/lib/store/cart-store";
import { MenuItem } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  Search,
  Plus,
  Minus,
  Star,
  Clock,
  Zap,
  Leaf,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MenuCatalogProps {
  filterOnlyQuickMeals?: boolean;
}

export function MenuCatalog({ filterOnlyQuickMeals = false }: MenuCatalogProps) {
  const { menuItems } = useCampusStore();
  const { foodCourtId, items: cartItems, addItem, updateQuantity } = useCartStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [onlyQuick, setOnlyQuick] = useState(filterOnlyQuickMeals);

  // Filter menu items for current food court
  const courtItems = useMemo(() => {
    return menuItems.filter((item) => item.food_court_id === foodCourtId);
  }, [menuItems, foodCourtId]);

  // Distinct categories in this food court
  const categories = useMemo(() => {
    const cats = new Set(courtItems.map((i) => i.category_id));
    return Array.from(cats);
  }, [courtItems]);

  const categoryNames: Record<string, string> = {
    'cat-1': 'Meals & Thalis',
    'cat-2': 'Fast Food & Snacks',
    'cat-3': 'Beverages & Shakes',
    'cat-4': 'Desserts & Ice Cream',
    'cat-5': 'Quick Bites & Wraps',
    'cat-6': 'Coffee & Drinks',
    'cat-7': 'Bowls & Salads',
  };

  const filteredItems = useMemo(() => {
    return courtItems.filter((item) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc) return false;
      }
      if (selectedCategory !== "all" && item.category_id !== selectedCategory) {
        return false;
      }
      if (isVegOnly && !item.is_veg) {
        return false;
      }
      if (onlyQuick && !item.quick_item && item.prep_time_minutes > 6) {
        return false;
      }
      return true;
    });
  }, [courtItems, searchQuery, selectedCategory, isVegOnly, onlyQuick]);

  const getItemQuantityInCart = (itemId: string) => {
    const entry = cartItems.find((ci) => ci.item.id === itemId);
    return entry ? entry.quantity : 0;
  };

  return (
    <div className="space-y-5">
      {/* Search & Quick Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items, thalis, drinks, burgers..."
            className="pl-9 rounded-xl bg-card"
          />
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setIsVegOnly(!isVegOnly)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap ${
              isVegOnly
                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                : "bg-card text-slate-700 dark:text-slate-300 hover:bg-slate-50"
            }`}
          >
            <Leaf className="w-3.5 h-3.5" />
            <span>Pure Veg</span>
          </button>

          <button
            onClick={() => setOnlyQuick(!onlyQuick)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap ${
              onlyQuick
                ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                : "bg-card text-slate-700 dark:text-slate-300 hover:bg-slate-50"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Quick (&lt; 6 mins)</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
            selectedCategory === "all"
              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
          }`}
        >
          All Items ({courtItems.length})
        </button>

        {categories.map((catId) => (
          <button
            key={catId}
            onClick={() => setSelectedCategory(catId)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === catId
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {categoryNames[catId] || catId}
          </button>
        ))}
      </div>

      {/* Item Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 border rounded-2xl bg-card">
          <Filter className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <h4 className="font-bold text-slate-900 dark:text-slate-100">No dishes match your filter</h4>
          <p className="text-xs text-muted-foreground mt-1">Try resetting the search or toggle options.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const quantity = getItemQuantityInCart(item.id);

            return (
              <div
                key={item.id}
                className="group rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image container */}
                  <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      {item.is_veg ? (
                        <span className="w-5 h-5 rounded-md bg-white/90 backdrop-blur-sm border border-emerald-600 flex items-center justify-center shadow-sm">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-md bg-white/90 backdrop-blur-sm border border-rose-600 flex items-center justify-center shadow-sm">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                        </span>
                      )}

                      {item.quick_item && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white shadow-sm flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          QUICK PREP
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-sm text-white text-[11px] font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{item.prep_time_minutes} mins prep</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-base text-slate-900 dark:text-slate-100 leading-snug">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-900 shrink-0">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{item.popularity_score}</span>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Footer Price & Add to Cart */}
                <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between mt-2">
                  <div>
                    <span className="text-xs text-muted-foreground block">Price</span>
                    <span className="text-lg font-black text-slate-900 dark:text-slate-100">
                      {formatCurrency(item.price)}
                    </span>
                  </div>

                  {/* Quantity Controller */}
                  {quantity > 0 ? (
                    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-7 h-7 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center justify-center shadow-sm transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-extrabold text-blue-700 dark:text-blue-300 w-5 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-7 h-7 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center shadow-sm transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => addItem(item)}
                      disabled={!item.is_available}
                      className="rounded-xl shadow-sm font-bold gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{item.is_available ? "Add" : "Sold Out"}</span>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
