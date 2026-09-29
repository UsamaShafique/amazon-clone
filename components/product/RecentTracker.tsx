"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/components/providers/RecentlyViewedProvider";

/** Invisible client component that records a product view. */
export function RecentTracker({ productId }: { productId: string }) {
  const { pushRecent, hydrated } = useRecentlyViewed();

  useEffect(() => {
    if (hydrated) pushRecent(productId);
  }, [productId, hydrated, pushRecent]);

  return null;
}
