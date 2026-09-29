"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Order } from "@/types";
import styles from "./orders.module.css";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { getOrder, ORDER_STATUS_LABEL } from "@/lib/api/orders";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { TrackModal } from "./TrackModal";
import { formatDate, formatPrice } from "@/lib/utils";

export function OrderDetailClient({ orderId }: { orderId: string }) {
  const { user } = useAuth();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const [trackOpen, setTrackOpen] = useState(false);

  useEffect(() => {
    if (user) setOrder(getOrder(user.id, orderId) ?? null);
  }, [user, orderId]);

  if (order === undefined) {
    return (
      <div aria-busy="true">
        <Skeleton height={120} />
        <div style={{ height: 12 }} />
        <Skeleton height={220} />
      </div>
    );
  }

  if (order === null) {
    return (
      <EmptyState
        emoji="🔍"
        title="We can't find that order"
        body={`Order "${orderId}" doesn't exist on this account. It may belong to a different demo user.`}
        action={<Button onClick={() => router.push("/orders")}>Back to your orders</Button>}
      />
    );
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Your Account", href: "/account" },
          { label: "Your Orders", href: "/orders" },
          { label: `Order # ${order.id}` },
        ]}
      />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
        <h1 className="pageTitle" style={{ marginBottom: 8 }}>
          Order details
        </h1>
        <p className="muted" style={{ margin: 0 }}>
          Ordered {formatDate(order.date)} · Order # {order.id}
        </p>
      </div>

      <div className={styles.detailGrid}>
        <div>
          <h2 className={styles.detailHeading}>Shipping address</h2>
          <p style={{ margin: 0 }}>{order.shippingAddress.fullName}</p>
          <p style={{ margin: 0 }}>
            {order.shippingAddress.line1}
            {order.shippingAddress.line2 ? <>, {order.shippingAddress.line2}</> : null}
          </p>
          <p style={{ margin: 0 }}>
            {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
            {order.shippingAddress.postalCode}
          </p>
          <p style={{ margin: 0 }}>{order.shippingAddress.country}</p>
        </div>
        <div>
          <h2 className={styles.detailHeading}>Payment method</h2>
          <p style={{ margin: 0 }}>
            {order.payment.brand} ending in {order.payment.last4}
          </p>
          <h2 className={styles.detailHeading} style={{ marginTop: 12 }}>
            Status
          </h2>
          <p style={{ margin: 0 }}>
            {ORDER_STATUS_LABEL[order.status]}
            {order.deliveredOn
              ? ` · ${formatDate(order.deliveredOn)}`
              : order.status !== "cancelled"
                ? ` · est. ${formatDate(order.estimatedDelivery)}`
                : ""}
          </p>
        </div>
        <div>
          <h2 className={styles.detailHeading}>Order summary</h2>
          <table className={styles.summaryTable}>
            <tbody>
              <tr>
                <td>Item(s) subtotal:</td>
                <td>{formatPrice(order.subtotal)}</td>
              </tr>
              <tr>
                <td>Shipping:</td>
                <td>{order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}</td>
              </tr>
              <tr>
                <td>Estimated tax:</td>
                <td>{formatPrice(order.tax)}</td>
              </tr>
              <tr className={styles.summaryTotal}>
                <td>Grand total:</td>
                <td>{formatPrice(order.total)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <article className={styles.orderCard}>
        <div className={styles.orderBody}>
          <div>
            {order.items.map((item) => (
              <div key={item.productId} className={styles.itemRow}>
                <img src={item.image} alt="" loading="lazy" />
                <div className={styles.itemInfo}>
                  <Link href={`/product/${item.productId}`} className={styles.itemTitle}>
                    {item.title}
                  </Link>
                  <span className={styles.itemQty}>
                    Qty {item.quantity} · {formatPrice(item.price)}
                  </span>
                  <div className={styles.itemActions}>
                    <Button
                      size="sm"
                      onClick={() => {
                        addItem(item.productId, 1);
                        showToast("Added to cart");
                      }}
                    >
                      Buy it again
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.sideActions}>
            {order.status !== "cancelled" && (
              <Button variant="outline" size="sm" fullWidth onClick={() => setTrackOpen(true)}>
                Track package
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              fullWidth
              onClick={() => showToast("Return started (demo)", "info")}
            >
              Return or replace items
            </Button>
            <Button
              variant="outline"
              size="sm"
              fullWidth
              onClick={() => showToast("Our demo support team says hi 👋", "info")}
            >
              Get product support
            </Button>
          </div>
        </div>
      </article>

      <TrackModal order={order} open={trackOpen} onClose={() => setTrackOpen(false)} />
    </>
  );
}
