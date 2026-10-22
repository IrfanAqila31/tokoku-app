import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CartItem, Product } from "../types";

interface CartState {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  increaseQty: (productId: number) => void;
  decreaseQty: (productId: number) => void;
  clearCart: () => void;
  getTotalItem: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (product: Product) => {
        const { items } = get();
        const existingItem = items.find(
          (item) => item.product.id === product.id,
        );
        if (existingItem) {
          set({
            items: items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          });
        } else {
          set({ items: [...items, { product, quantity: 1 }] });
        }
      },
      removeFromCart: (productId: number) => {
        set({
          items: get().items.filter((item) => item.product.id !== productId),
        });
      },
      increaseQty: (productId: number) => {
        set({
          items: get().items.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        });
      },
      decreaseQty: (productId: number) => {
        const { items } = get();
        const targetItem = items.find((item) => item.product.id === productId);
        if (targetItem && targetItem.quantity > 1) {
          // Jika jumlahnya masih lebih dari 1, kurangi 1
          set({
            items: items.map((item) =>
              item.product.id === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item,
            ),
          });
        } else {
          set({
            items: items.filter((item) => item.product.id !== productId),
          });
        }
      },
      clearCart: () => {
        set({ items: [] });
      },
      getTotalItem: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0,
        );
      },
    }),
    {
      name: "cart",
    },
  ),
);
