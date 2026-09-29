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
import { readJSON, writeJSON } from "@/lib/storage";

interface WishlistContextValue {
  ids: string[];
  hydrated: boolean;
  has: (productId: string) => boolean;
  /** Returns true when the product was added, false when removed. */
  toggle: (productId: string) => boolean;
  remove: (productId: string) => void;
}

const KEY = "shopora.wishlist";

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setIds(readJSON<string[]>(KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(KEY, ids);
  }, [ids, hydrated]);

  const has = useCallback((productId: string) => ids.includes(productId), [ids]);

  const toggle = useCallback(
    (productId: string) => {
      const adding = !ids.includes(productId);
      setIds((prev) =>
        adding ? [productId, ...prev] : prev.filter((id) => id !== productId),
      );
      return adding;
    },
    [ids],
  );

  const remove = useCallback((productId: string) => {
    setIds((prev) => prev.filter((id) => id !== productId));
  }, []);

  const value = useMemo(
    () => ({ ids, hydrated, has, toggle, remove }),
    [ids, hydrated, has, toggle, remove],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
