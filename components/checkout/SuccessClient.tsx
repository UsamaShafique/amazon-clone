"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Order } from "@/types";
import styles from "./checkout.module.css";
import { useAuth } from "@/components/providers/AuthProvider";
import { getOrder } from "@/lib/api/orders";
import { Button } from "@/components/ui/Button";
import { formatDate, formatPrice } from "@/lib/utils";

export function SuccessClient() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (user && orderId) setOrder(getOrder(user.id, orderId) ?? null);
  }, [user, orderId]);

  return (
    <div className={styles.mainSingle}>
      <div className={styles.success} role="status">
        <div className={styles.successEmoji} aria-hidden="true">
          ✅
        </div>
        <h2 className={styles.successTitle}>Order placed, thank you!</h2>
        <p className="muted">A confirmation would be emailed to you in a real store.</p>
        {order ? (
          <>
            <p style={{ fontSize: 15 }}>
              Order <strong># {order.id}</strong> ·{" "}
              <strong>{formatPrice(order.total)}</strong>
            </p>
            <p>
              Estimated delivery: <strong>{formatDate(order.estimatedDelivery)}</strong>
              <br />
              <span className="muted">
                Shipping to {order.shippingAddress.fullName}, {order.shippingAddress.city}
              </span>
            </p>
          </>
        ) : (
          <p className="muted">Loading your order details…</p>
        )}
        <div className={styles.successActions}>
          <Button
            variant="outline"
            onClick={() => router.push(order ? `/orders/${order.id}` : "/orders")}
          >
            View order
          </Button>
          <Button onClick={() => router.push("/")}>Continue shopping</Button>
        </div>
      </div>
    </div>
  );
}
