"use client";

import type { Product } from "@/types";
import { Button } from "@/components/ui/Button";
import { useWishlist } from "@/components/providers/WishlistProvider";
import { useToast } from "@/components/providers/ToastProvider";

export function WishlistButton({ product, fullWidth = true }: { product: Product; fullWidth?: boolean }) {
  const { has, toggle, hydrated } = useWishlist();
  const { showToast } = useToast();
  const saved = hydrated && has(product.id);

  return (
    <Button
      variant="outline"
      size="sm"
      fullWidth={fullWidth}
      aria-pressed={saved}
      onClick={() => {
        const added = toggle(product.id);
        showToast(added ? "Added to your wishlist" : "Removed from your wishlist", "info");
      }}
    >
      {saved ? "♥ In your wishlist" : "♡ Add to wishlist"}
    </Button>
  );
}
