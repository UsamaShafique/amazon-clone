"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Order } from "@/types";
import styles from "./orders.module.css";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { getOrders, ORDER_STATUS_LABEL } from "@/lib/api/orders";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { TrackModal } from "./TrackModal";
import { formatDate, formatPrice, formatShortDate } from "@/lib/utils";

type Range = "30" | "90" | "365" | "all";

export function OrdersPageClient() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [range, setRange] = useState<Range>("all");
  const [tracking, setTracking] = useState<Order | null>(null);

  useEffect(() => {
    if (user) setOrders(getOrders(user.id));
  }, [user]);

  const filtered = useMemo(() => {
    if (!orders) return [];
    if (range === "all") return orders;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - Number(range));
    return orders.filter((o) => new Date(o.date) >= cutoff);
  }, [orders, range]);

  if (!orders) {
    return (
      <div aria-busy="true">
        <Skeleton height={140} />
        <div style={{ height: 12 }} />
        <Skeleton height={140} />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        emoji="📦"
        title="You haven't placed any orders yet"
        body="When you place your first order, it will show up here with tracking and delivery details."
        action={<Button onClick={() => router.push("/")}>Start shopping</Button>}
      />
    );
  }

  const statusHeading = (order: Order): string => {
    switch (order.status) {
      case "delivered":
        return order.deliveredOn ? `Delivered ${formatShortDate(order.deliveredOn)}` : "Delivered";
      case "shipped":
      case "out_for_delivery":
        return `Arriving ${formatShortDate(order.estimatedDelivery)}`;
      case "processing":
        return `Order placed — arriving ${formatShortDate(order.estimatedDelivery)}`;
      default:
        return ORDER_STATUS_LABEL[order.status];
    }
  };

  return (
    <>
      <div className={styles.toolbar}>
        <p style={{ margin: 0 }}>
          <strong>{filtered.length}</strong> order{filtered.length === 1 ? "" : "s"}
        </p>
        <label style={{ fontSize: 13 }}>
          placed in{" "}
          <select
            className={styles.filterSelect}
            value={range}
            onChange={(e) => setRange(e.target.value as Range)}
          >
            <option value="30">last 30 days</option>
            <option value="90">last 3 months</option>
            <option value="365">last 12 months</option>
            <option value="all">all time</option>
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          emoji="🗓️"
          title="No orders in this period"
          body="Try widening the time range to see older orders."
        />
      ) : (
        filtered.map((order) => (
          <article key={order.id} className={styles.orderCard}>
            <header className={styles.orderHeader}>
              <div className={styles.orderHeaderCol}>
                <span className={styles.orderHeaderLabel}>Order placed</span>
                <span className={styles.orderHeaderValue}>{formatDate(order.date)}</span>
              </div>
              <div className={styles.orderHeaderCol}>
                <span className={styles.orderHeaderLabel}>Total</span>
                <span className={styles.orderHeaderValue}>{formatPrice(order.total)}</span>
              </div>
              <div className={styles.orderHeaderCol}>
                <span className={styles.orderHeaderLabel}>Ship to</span>
                <span className={styles.orderHeaderValue}>
                  {order.shippingAddress.fullName}
                </span>
              </div>
              <div className={`${styles.orderHeaderCol} ${styles.orderNumberCol}`}>
                <span className={styles.orderHeaderLabel}>Order # {order.id}</span>
                <Link href={`/orders/${order.id}`} className="link">
                  View order details
                </Link>
              </div>
            </header>
            <div className={styles.orderBody}>
              <div>
                <h2
                  className={`${styles.statusTitle} ${
                    order.status === "delivered" ? styles.statusDelivered : styles.statusShipped
                  }`}
                >
                  {statusHeading(order)}
                </h2>
                {order.items.map((item) => (
                  <div key={`${order.id}-${item.productId}`} className={styles.itemRow}>
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/product/${item.productId}`)}
                        >
                          View item
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.sideActions}>
                {order.status !== "cancelled" && (
                  <Button variant="outline" size="sm" fullWidth onClick={() => setTracking(order)}>
                    Track package
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => router.push(`/orders/${order.id}`)}
                >
                  View order details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => showToast("Invoice downloaded (demo)", "info")}
                >
                  Download invoice
                </Button>
              </div>
            </div>
          </article>
        ))
      )}

      {tracking && (
        <TrackModal order={tracking} open={tracking !== null} onClose={() => setTracking(null)} />
      )}
    </>
  );
}
