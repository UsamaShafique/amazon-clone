"use client";

import { useEffect, useState } from "react";
import type { PaymentMethod } from "@/types";
import styles from "./account.module.css";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { deletePaymentMethod, getPaymentMethods, savePaymentMethod } from "@/lib/account";
import { PaymentForm } from "./PaymentForm";
import { Modal } from "@/components/ui/Modal";

const BRAND_ICON: Record<string, string> = {
  Visa: "💳",
  Mastercard: "💳",
  Amex: "💳",
  "Shopora Card": "🛍️",
};

export function PaymentsClient() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (user) setMethods(getPaymentMethods(user.id));
  }, [user]);

  if (!user) return null;

  return (
    <>
      <div className={styles.cardGrid}>
        <button type="button" className={styles.addCard} onClick={() => setAdding(true)}>
          <span className={styles.addPlus} aria-hidden="true">
            +
          </span>
          Add a payment method
        </button>
        {methods.map((method) => (
          <div
            key={method.id}
            className={`${styles.itemCard} ${method.isDefault ? styles.itemCardDefault : ""}`}
          >
            {method.isDefault && <p className={styles.defaultTag}>Default payment method</p>}
            <p className={styles.itemCardName}>
              <span aria-hidden="true">{BRAND_ICON[method.brand]}</span> {method.brand} ••••{" "}
              {method.last4}
            </p>
            <p style={{ margin: 0 }}>{method.holder}</p>
            <p className="muted" style={{ margin: 0 }}>
              Expires {method.expiry}
            </p>
            <div className={styles.itemCardActions}>
              <button
                type="button"
                className={styles.textAction}
                onClick={() => {
                  setMethods(deletePaymentMethod(user.id, method.id));
                  showToast("Payment method removed", "info");
                }}
              >
                Remove
              </button>
              {!method.isDefault && (
                <button
                  type="button"
                  className={styles.textAction}
                  onClick={() =>
                    setMethods(savePaymentMethod(user.id, { ...method, isDefault: true }))
                  }
                >
                  Set as default
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal open={adding} onClose={() => setAdding(false)} title="Add a payment method" width={480}>
        <PaymentForm
          onSave={(method) => {
            setMethods(savePaymentMethod(user.id, method));
            setAdding(false);
            showToast("Payment method added");
          }}
          onCancel={() => setAdding(false)}
        />
      </Modal>
    </>
  );
}
