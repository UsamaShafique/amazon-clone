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

interface RecentlyViewedContextValue {
  ids: string[];
  hydrated: boolean;
  pushRecent: (productId: string) => void;
}

const KEY = "shopora.recent";
const MAX = 12;

const RecentContext = createContext<RecentlyViewedContextValue | null>(null);

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setIds(readJSON<string[]>(KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(KEY, ids);
  }, [ids, hydrated]);

  const pushRecent = useCallback((productId: string) => {
    setIds((prev) => [productId, ...prev.filter((id) => id !== productId)].slice(0, MAX));
  }, []);

  const value = useMemo(() => ({ ids, hydrated, pushRecent }), [ids, hydrated, pushRecent]);

  return <RecentContext.Provider value={value}>{children}</RecentContext.Provider>;
}

export function useRecentlyViewed(): RecentlyViewedContextValue {
  const ctx = useContext(RecentContext);
  if (!ctx) throw new Error("useRecentlyViewed must be used within RecentlyViewedProvider");
  return ctx;
}
