import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MenuItem } from '@/types';

export interface CartItemEntry {
  item: MenuItem;
  quantity: number;
}

interface CartState {
  foodCourtId: string;
  items: CartItemEntry[];
  selectedSlotId: string;
  selectedSlotTime: string;
  nextClassTime: string;
  isDineIn: boolean;

  setFoodCourtId: (id: string) => void;
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  setSlot: (slotId: string, slotTime: string) => void;
  setNextClassTime: (time: string) => void;
  setIsDineIn: (dineIn: boolean) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  getItemCount: () => number;
  getMaxPrepTime: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      foodCourtId: 'fc-1',
      items: [],
      selectedSlotId: 'slot-1',
      selectedSlotTime: '12:00 PM - 12:10 PM',
      nextClassTime: '13:15',
      isDineIn: true,

      setFoodCourtId: (id: string) => {
        if (get().foodCourtId !== id) {
          const defaultSlotId = id === 'fc-2' ? 'slot-8' : 'slot-1';
          const defaultSlotTime = id === 'fc-2' ? '12:15 PM - 12:25 PM' : '12:00 PM - 12:10 PM';
          set({
            foodCourtId: id,
            items: [],
            selectedSlotId: defaultSlotId,
            selectedSlotTime: defaultSlotTime,
          });
        }
      },

      addItem: (item: MenuItem) => {
        const currentItems = get().items;
        const existing = currentItems.find((i) => i.item.id === item.id);

        if (existing) {
          set({
            items: currentItems.map((i) =>
              i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ items: [...currentItems, { item, quantity: 1 }] });
        }
      },

      removeItem: (itemId: string) => {
        set({ items: get().items.filter((i) => i.item.id !== itemId) });
      },

      updateQuantity: (itemId: string, delta: number) => {
        const currentItems = get().items;
        const updated = currentItems
          .map((i) => {
            if (i.item.id === itemId) {
              const newQty = i.quantity + delta;
              return newQty > 0 ? { ...i, quantity: newQty } : null;
            }
            return i;
          })
          .filter((i): i is CartItemEntry => i !== null);

        set({ items: updated });
      },

      setSlot: (slotId: string, slotTime: string) => {
        set({ selectedSlotId: slotId, selectedSlotTime: slotTime });
      },

      setNextClassTime: (time: string) => {
        set({ nextClassTime: time });
      },

      setIsDineIn: (dineIn: boolean) => {
        set({ isDineIn: dineIn });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalAmount: () => {
        return get().items.reduce(
          (sum, i) => sum + i.item.price * i.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      getMaxPrepTime: () => {
        const items = get().items;
        if (items.length === 0) return 0;
        return items.reduce((max, i) => Math.max(max, i.item.prep_time_minutes), 0);
      },
    }),
    {
      name: 'campusflow-cart-storage',
    }
  )
);
