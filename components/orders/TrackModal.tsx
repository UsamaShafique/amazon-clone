"use client";

import type { Order } from "@/types";
import styles from "./orders.module.css";
import { Modal } from "@/components/ui/Modal";
import { cx, formatDate, formatShortDate } from "@/lib/utils";

const STEPS = ["processing", "shipped", "out_for_delivery", "delivered"] as const;

const STEP_LABELS: Record<(typeof STEPS)[number], string> = {
  processing: "Order placed",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
};

export function TrackModal({
  order,
  open,
  onClose,
}: {
  order: Order;
  open: boolean;
  onClose: () => void;
}) {
  const currentIndex =
    order.status === "cancelled" ? -1 : STEPS.indexOf(order.status as (typeof STEPS)[number]);

  return (
    <Modal open={open} onClose={onClose} title={`Tracking ${order.trackingId}`} width={440}>
      {order.status === "cancelled" ? (
        <p>
          This order was cancelled and will not ship. Refunds are instant in demo-land — if
          only real life worked that way.
        </p>
      ) : (
        <>
          <p className="muted" style={{ fontSize: 13 }}>
            Carrier: Shopora Logistics (demo) ·{" "}
            {order.status === "delivered" && order.deliveredOn
              ? `Delivered ${formatDate(order.deliveredOn)}`
              : `Estimated delivery ${formatShortDate(order.estimatedDelivery)}`}
          </p>
          <ol className={styles.timeline}>
            {STEPS.map((step, i) => (
              <li
                key={step}
                className={cx(styles.timelineStep, i <= currentIndex && styles.timelineDone)}
              >
                <span className={styles.timelineDot} aria-hidden="true">
                  {i <= currentIndex ? "✓" : i + 1}
                </span>
                <span>
                  <span className={styles.timelineLabel}>{STEP_LABELS[step]}</span>
                  <br />
                  <span className={styles.timelineHint}>
                    {i <= currentIndex
                      ? i === 0
                        ? formatDate(order.date)
                        : "Completed"
                      : "Pending"}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </>
      )}
    </Modal>
  );
}
