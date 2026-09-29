"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { PaymentMethod } from "@/types";
import styles from "./checkout.module.css";
import { useAuth } from "@/components/providers/AuthProvider";
import { getPaymentMethods, savePaymentMethod } from "@/lib/account";
import { getCheckoutDraft, updateCheckoutDraft } from "@/lib/checkout";
import { PaymentForm } from "@/components/account/PaymentForm";
import { Button } from "@/components/ui/Button";
import { OrderSummarySide } from "./OrderSummarySide";
import { cx } from "@/lib/utils";

export function PaymentStep() {
  const { user } = useAuth();
  const router = useRouter();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) return;
    const draft = getCheckoutDraft();
    if (!draft.address) {
      router.replace("/checkout/address");
      return;
    }
    const list = getPaymentMethods(user.id);
    setMethods(list);
    setSelectedId((list.find((m) => m.isDefault) ?? list[0])?.id ?? null);
    setShowForm(list.length === 0);
    setReady(true);
  }, [user, router]);

  if (!user || !ready) return null;

  const useMethod = (method: PaymentMethod) => {
    updateCheckoutDraft({
      payment: {
        brand: method.brand,
        last4: method.last4,
        holder: method.holder,
        expiry: method.expiry,
      },
    });
    router.push("/checkout/review");
  };

  return (
    <div className={styles.main}>
      <div>
        <section className={styles.panel} aria-label="Choose a payment method">
          <h2 className={styles.panelTitle}>
            {methods.length > 0 ? "Choose a payment method" : "Add a payment method"}
          </h2>

          {methods.map((method) => (
            <label
              key={method.id}
              className={cx(styles.optionRow, selectedId === method.id && styles.optionSelected)}
            >
              <input
                type="radio"
                name="payment"
                checked={selectedId === method.id}
                onChange={() => setSelectedId(method.id)}
              />
              <span className={styles.optionBody}>
                <span className={styles.optionName}>
                  {method.brand} ending in {method.last4}
                </span>
                <span className="muted">
                  {method.holder} · expires {method.expiry}
                </span>
              </span>
            </label>
          ))}

          {!showForm ? (
            <button type="button" className={styles.addNew} onClick={() => setShowForm(true)}>
              + Add a credit or debit card (demo)
            </button>
          ) : (
            <div style={{ marginTop: methods.length ? 14 : 0 }}>
              <PaymentForm
                submitLabel="Use this card"
                onSave={(method) => {
                  savePaymentMethod(user.id, method);
                  useMethod(method);
                }}
                onCancel={methods.length > 0 ? () => setShowForm(false) : undefined}
              />
            </div>
          )}

          {methods.length > 0 && !showForm && (
            <Button
              onClick={() => {
                const method = methods.find((m) => m.id === selectedId);
                if (method) useMethod(method);
              }}
              disabled={!selectedId}
              style={{ marginTop: 8 }}
            >
              Use this payment method
            </Button>
          )}
        </section>
      </div>
      <OrderSummarySide />
    </div>
  );
}
