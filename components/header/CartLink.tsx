"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import { useCart } from "@/components/providers/CartProvider";

export function CartLink() {
  const { count, hydrated } = useCart();
  const shown = hydrated ? count : 0;
  return (
    <Link href="/cart" className={styles.cartLink} aria-label={`Cart, ${shown} items`}>
      <span className={styles.cartIconWrap}>
        <svg viewBox="0 0 26 24" width="26" height="24" aria-hidden="true">
          <path
            d="M1 2h3l1 3m0 0 2.4 9.2a2 2 0 0 0 1.94 1.5h9.4a2 2 0 0 0 1.94-1.46L23.5 7H5Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <circle cx="10.2" cy="20.6" r="1.8" fill="currentColor" />
          <circle cx="18.6" cy="20.6" r="1.8" fill="currentColor" />
        </svg>
        {shown > 0 && (
          <span className={styles.cartCount} aria-hidden="true">
            {shown > 9 ? "9+" : shown}
          </span>
        )}
      </span>
      <span className={styles.cartLabel}>Cart</span>
    </Link>
  );
}
