"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./checkout.module.css";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { clearCheckoutDraft, getCheckoutDraft, type CheckoutDraft } from "@/lib/checkout";
import { createOrder } from "@/lib/api/orders";
import { getProductById } from "@/lib/data/products";
import { Button } from "@/components/ui/Button";
import { OrderSummarySide } from "./OrderSummarySide";
import { formatPrice } from "@/lib/utils";

export function ReviewStep() {
  const { user } = useAuth();
  const { items, hydrated, clearCart } = useCart();
  const { showToast } = useToast();
  const router = useRouter();
  const [draft, setDraft] = useState<CheckoutDraft | null>(null);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    const d = getCheckoutDraft();
    if (!d.address) {
      router.replace("/checkout/address");
      return;
    }
    if (!d.payment) {
      router.replace("/checkout/payment");
      return;
    }
    setDraft(d);
  }, [router]);

  useEffect(() => {
    if (hydrated && items.length === 0 && !placing) router.replace("/cart");
  }, [hydrated, items.length, router, placing]);

  if (!user || !draft?.address || !draft.payment) return null;

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

  const placeOrder = () => {
    setPlacing(true);
    // Simulated processing delay for a believable "placing order" state.
    setTimeout(() => {
      const order = createOrder({
        userId: user.id,
        items: orderItems,
        shippingAddress: draft.address!,
        payment: { brand: draft.payment!.brand, last4: draft.payment!.last4 },
      });
      clearCart();
      clearCheckoutDraft();
      showToast("Order placed — thank you!");
      router.replace(`/checkout/success?orderId=${encodeURIComponent(order.id)}`);
    }, 1100);
  };

  return (
    <div className={styles.main}>
      <div>
        <section className={styles.panel} aria-label="Shipping address">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <h2 className={styles.panelTitle}>Shipping address</h2>
            <Link href="/checkout/address" className={`link ${styles.editLink}`}>
              Change
            </Link>
          </div>
          <p style={{ margin: 0 }}>{draft.address.fullName}</p>
          <p style={{ margin: 0 }}>
            {draft.address.line1}
            {draft.address.line2 ? `, ${draft.address.line2}` : ""}
          </p>
          <p style={{ margin: 0 }}>
            {draft.address.city}, {draft.address.state} {draft.address.postalCode},{" "}
            {draft.address.country}
          </p>
        </section>

        <section className={styles.panel} aria-label="Payment method">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <h2 className={styles.panelTitle}>Payment method</h2>
            <Link href="/checkout/payment" className={`link ${styles.editLink}`}>
              Change
            </Link>
          </div>
          <p style={{ margin: 0 }}>
            {draft.payment.brand} ending in {draft.payment.last4}
          </p>
          <p className="muted" style={{ margin: 0 }}>
            {draft.payment.holder} · expires {draft.payment.expiry}
          </p>
        </section>

        <section className={styles.panel} aria-label="Items in this order">
          <h2 className={styles.panelTitle}>Items ({orderItems.length})</h2>
          <div className={styles.reviewItems}>
            {orderItems.map((item) => (
              <div key={item.productId} className={styles.reviewItem}>
                <img src={item.image} alt="" loading="lazy" />
                <div>
                  <Link href={`/product/${item.productId}`} className="link">
                    {item.title.length > 80 ? `${item.title.slice(0, 80)}…` : item.title}
                  </Link>
                  <p className="muted" style={{ margin: "2px 0 0" }}>
                    Qty {item.quantity} · {formatPrice(item.price)} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <OrderSummarySide
        action={
          <Button fullWidth loading={placing} onClick={placeOrder}>
            Place your order
          </Button>
        }
      />
    </div>
  );
}
