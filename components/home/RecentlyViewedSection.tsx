"use client";

import { useRecentlyViewed } from "@/components/providers/RecentlyViewedProvider";
import { getProductsByIds } from "@/lib/data/products";
import { ProductCarousel } from "@/components/product/ProductCarousel";

interface RecentlyViewedSectionProps {
  /** Exclude a product (e.g. the one currently being viewed). */
  excludeId?: string;
  title?: string;
}

export function RecentlyViewedSection({
  excludeId,
  title = "Your recently viewed items",
}: RecentlyViewedSectionProps) {
  const { ids, hydrated } = useRecentlyViewed();
  if (!hydrated) return null;
  const products = getProductsByIds(ids.filter((id) => id !== excludeId));
  if (products.length === 0) return null;
  return <ProductCarousel title={title} products={products} />;
}
