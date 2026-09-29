"use client";

import { useEffect, useState } from "react";
import type { Address } from "@/types";
import styles from "./account.module.css";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { deleteAddress, getAddresses, saveAddress } from "@/lib/account";
import { AddressForm } from "./AddressForm";
import { Modal } from "@/components/ui/Modal";

export function AddressesClient() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editing, setEditing] = useState<Address | "new" | null>(null);

  useEffect(() => {
    if (user) setAddresses(getAddresses(user.id));
  }, [user]);

  if (!user) return null;

  const onSave = (address: Address) => {
    setAddresses(saveAddress(user.id, address));
    setEditing(null);
    showToast("Address saved");
  };

  return (
    <>
      <div className={styles.cardGrid}>
        <button type="button" className={styles.addCard} onClick={() => setEditing("new")}>
          <span className={styles.addPlus} aria-hidden="true">
            +
          </span>
          Add address
        </button>
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`${styles.itemCard} ${address.isDefault ? styles.itemCardDefault : ""}`}
          >
            {address.isDefault && <p className={styles.defaultTag}>Default address</p>}
            <p className={styles.itemCardName}>{address.fullName}</p>
            <p style={{ margin: 0 }}>
              {address.line1}
              {address.line2 ? <>, {address.line2}</> : null}
            </p>
            <p style={{ margin: 0 }}>
              {address.city}, {address.state} {address.postalCode}
            </p>
            <p style={{ margin: 0 }}>{address.country}</p>
            <p className="muted" style={{ margin: 0 }}>
              {address.phone}
            </p>
            <div className={styles.itemCardActions}>
              <button type="button" className={styles.textAction} onClick={() => setEditing(address)}>
                Edit
              </button>
              <button
                type="button"
                className={styles.textAction}
                onClick={() => {
                  setAddresses(deleteAddress(user.id, address.id));
                  showToast("Address removed", "info");
                }}
              >
                Remove
              </button>
              {!address.isDefault && (
                <button
                  type="button"
                  className={styles.textAction}
                  onClick={() => setAddresses(saveAddress(user.id, { ...address, isDefault: true }))}
                >
                  Set as default
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === "new" ? "Add a new address" : "Edit address"}
        width={560}
      >
        <AddressForm
          key={editing === "new" ? "new" : editing?.id}
          initial={editing === "new" ? undefined : (editing ?? undefined)}
          onSave={onSave}
          onCancel={() => setEditing(null)}
        />
      </Modal>
    </>
  );
}
