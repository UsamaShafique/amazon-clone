"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/types";
import { readJSON, writeJSON } from "@/lib/storage";
import { getProductById } from "@/lib/data/products";
import { round2 } from "@/lib/utils";

interface CartState {
  items: CartItem[];
  saved: CartItem[];
}

interface CartContextValue extends CartState {
  /** false until localStorage has been read on the client */
  hydrated: boolean;
  count: number;
  subtotal: number;
  addItem: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  saveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  removeSaved: (productId: string) => void;
  clearCart: () => void;
}

const KEY = "shopora.cart";
const EMPTY: CartState = { items: [], saved: [] };

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(readJSON<CartState>(KEY, EMPTY));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(KEY, state);
  }, [state, hydrated]);

  const addItem = useCallback((productId: string, quantity = 1) => {
    setState((prev) => {
      const existing = prev.items.find((i) => i.productId === productId);
      const items = existing
        ? prev.items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.min(i.quantity + quantity, 10) }
              : i,
          )
        : [...prev.items, { productId, quantity: Math.min(quantity, 10), addedAt: Date.now() }];
      return { ...prev, items };
    });
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setState((prev) => ({
      ...prev,
      items:
        quantity <= 0
          ? prev.items.filter((i) => i.productId !== productId)
          : prev.items.map((i) =>
              i.productId === productId ? { ...i, quantity: Math.min(quantity, 10) } : i,
            ),
    }));
  }, []);

  const removeItem = useCallback((productId: string) => {
    setState((prev) => ({ ...prev, items: prev.items.filter((i) => i.productId !== productId) }));
  }, []);

  const saveForLater = useCallback((productId: string) => {
    setState((prev) => {
      const item = prev.items.find((i) => i.productId === productId);
      if (!item) return prev;
      return {
        items: prev.items.filter((i) => i.productId !== productId),
        saved: prev.saved.some((s) => s.productId === productId)
          ? prev.saved
          : [item, ...prev.saved],
      };
    });
  }, []);

  const moveToCart = useCallback((productId: string) => {
    setState((prev) => {
      const item = prev.saved.find((i) => i.productId === productId);
      if (!item) return prev;
      const existing = prev.items.find((i) => i.productId === productId);
      return {
        saved: prev.saved.filter((i) => i.productId !== productId),
        items: existing
          ? prev.items.map((i) =>
              i.productId === productId
                ? { ...i, quantity: Math.min(i.quantity + item.quantity, 10) }
                : i,
            )
          : [...prev.items, item],
      };
    });
  }, []);

  const removeSaved = useCallback((productId: string) => {
    setState((prev) => ({ ...prev, saved: prev.saved.filter((i) => i.productId !== productId) }));
  }, []);

  const clearCart = useCallback(() => {
    setState((prev) => ({ ...prev, items: [] }));
  }, []);

  const { count, subtotal } = useMemo(() => {
    let count = 0;
    let subtotal = 0;
    for (const item of state.items) {
      const product = getProductById(item.productId);
      if (!product) continue;
      count += item.quantity;
      subtotal += product.price * item.quantity;
    }
    return { count, subtotal: round2(subtotal) };
  }, [state.items]);

  const value = useMemo(
    () => ({
      ...state,
      hydrated,
      count,
      subtotal,
      addItem,
      setQuantity,
      removeItem,
      saveForLater,
      moveToCart,
      removeSaved,
      clearCart,
    }),
    [state, hydrated, count, subtotal, addItem, setQuantity, removeItem, saveForLater, moveToCart, removeSaved, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
