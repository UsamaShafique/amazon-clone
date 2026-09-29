"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Address } from "@/types";
import styles from "./checkout.module.css";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import { getAddresses, saveAddress } from "@/lib/account";
import { getCheckoutDraft, updateCheckoutDraft } from "@/lib/checkout";
import { AddressForm } from "@/components/account/AddressForm";
import { Button } from "@/components/ui/Button";
import { OrderSummarySide } from "./OrderSummarySide";
import { cx } from "@/lib/utils";

export function AddressStep() {
  const { user } = useAuth();
  const { items, hydrated } = useCart();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) return;
    const list = getAddresses(user.id);
    setAddresses(list);
    const draft = getCheckoutDraft();
    const preselect =
      (draft.address && list.find((a) => a.id === draft.address!.id)) ??
      list.find((a) => a.isDefault) ??
      list[0];
    setSelectedId(preselect?.id ?? null);
    setShowForm(list.length === 0);
    setReady(true);
  }, [user]);

  // An empty cart has nothing to check out.
  useEffect(() => {
    if (hydrated && items.length === 0) router.replace("/cart");
  }, [hydrated, items.length, router]);

  if (!user || !ready) return null;

  const useAddress = () => {
    const address = addresses.find((a) => a.id === selectedId);
    if (!address) return;
    updateCheckoutDraft({ address });
    router.push("/checkout/payment");
  };

  return (
    <div className={styles.main}>
      <div>
        <section className={styles.panel} aria-label="Choose a shipping address">
          <h2 className={styles.panelTitle}>
            {addresses.length > 0 ? "Choose a shipping address" : "Add a shipping address"}
          </h2>

          {addresses.map((address) => (
            <label
              key={address.id}
              className={cx(styles.optionRow, selectedId === address.id && styles.optionSelected)}
            >
              <input
                type="radio"
                name="address"
                checked={selectedId === address.id}
                onChange={() => setSelectedId(address.id)}
              />
              <span className={styles.optionBody}>
                <span className={styles.optionName}>
                  {address.fullName}
                  {address.isDefault && (
                    <span className="muted" style={{ fontWeight: 400 }}>
                      {" "}
                      · default
                    </span>
                  )}
                </span>
                <span>
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.state}{" "}
                  {address.postalCode}, {address.country}
                </span>
                <span className="muted">{address.phone}</span>
              </span>
            </label>
          ))}

          {!showForm ? (
            <button type="button" className={styles.addNew} onClick={() => setShowForm(true)}>
              + Add a new address
            </button>
          ) : (
            <div style={{ marginTop: addresses.length ? 14 : 0 }}>
              <AddressForm
                submitLabel="Use this address"
                onSave={(address) => {
                  const list = saveAddress(user.id, address);
                  setAddresses(list);
                  updateCheckoutDraft({ address });
                  router.push("/checkout/payment");
                }}
                onCancel={addresses.length > 0 ? () => setShowForm(false) : undefined}
              />
            </div>
          )}

          {addresses.length > 0 && !showForm && (
            <Button onClick={useAddress} disabled={!selectedId} style={{ marginTop: 8 }}>
              Deliver to this address
            </Button>
          )}
        </section>
      </div>
      <OrderSummarySide />
    </div>
  );
}
