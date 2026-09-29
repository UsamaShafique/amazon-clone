"use client";

import type { ReactNode } from "react";
import styles from "./checkout.module.css";
import { useCart } from "@/components/providers/CartProvider";
import { computeTotals } from "@/lib/api/orders";
import { getProductById } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";

export function OrderSummarySide({ action }: { action?: ReactNode }) {
  const { items, count } = useCart();
  const orderItems = items.flatMap((item) => {
    const product = getProductById(item.productId);
    return product
      ? [
          {
            productId: product.id,
            title: product.title,
            image: product.images[0],
            price: product.price,
            quantity: item.quantity,
          },
        ]
      : [];
  });
  const totals = computeTotals(orderItems);

  return (
    <aside className={styles.summary} aria-label="Order summary">
      {action}
      <div className={styles.summaryRows} style={action ? { marginTop: 12 } : undefined}>
        <div className={styles.summaryRow}>
          <span>
            Items ({count}):
          </span>
          <span>{formatPrice(totals.subtotal)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Shipping &amp; handling:</span>
          <span>{totals.shipping === 0 ? "FREE" : formatPrice(totals.shipping)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Estimated tax (8%):</span>
          <span>{formatPrice(totals.tax)}</span>
        </div>
      </div>
      <div className={styles.summaryTotalRow}>
        <span>Order total:</span>
        <span>{formatPrice(totals.total)}</span>
      </div>
      <p className={styles.summaryNote}>
        This is a demo checkout. No payment is processed and nothing will be shipped —
        which is also why the prices are this good.
      </p>
    </aside>
  );
}
