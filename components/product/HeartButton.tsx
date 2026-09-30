"use client";

import styles from "./product.module.css";
import { useWishlist } from "@/components/providers/WishlistProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { cx } from "@/lib/utils";

/** Small circular wishlist toggle shown over product imagery. */
export function HeartButton({ productId, title }: { productId: string; title: string }) {
  const { has, toggle, hydrated } = useWishlist();
  const { showToast } = useToast();
  const saved = hydrated && has(productId);

  return (
    <button
      type="button"
      className={cx(styles.heartBtn, saved && styles.heartActive)}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from wishlist` : `Add ${title} to wishlist`}
      onClick={(e) => {
        e.preventDefault();
        const added = toggle(productId);
        showToast(added ? "Added to your wishlist" : "Removed from your wishlist", "info");
      }}
    >
      <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
        <path
          d="M12 20.7C7 16.6 3.5 13.4 3.5 9.8 3.5 7 5.7 5 8.2 5c1.5 0 3 .8 3.8 2 .8-1.2 2.3-2 3.8-2 2.5 0 4.7 2 4.7 4.8 0 3.6-3.5 6.8-8.5 10.9Z"
          fill={saved ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
