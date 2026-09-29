"use client";

import { useState, type FormEvent } from "react";
import type { CardBrand, PaymentMethod } from "@/types";
import styles from "./account.module.css";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatCardNumber, onlyDigits } from "@/lib/utils";

interface PaymentFormProps {
  submitLabel?: string;
  onSave: (method: PaymentMethod) => void;
  onCancel?: () => void;
}

function detectBrand(digits: string): CardBrand {
  if (digits.startsWith("4")) return "Visa";
  if (digits.startsWith("5")) return "Mastercard";
  if (digits.startsWith("3")) return "Amex";
  return "Shopora Card";
}

function isValidExpiry(value: string): boolean {
  const match = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
}

export function PaymentForm({ submitLabel = "Add card", onSave, onCancel }: PaymentFormProps) {
  const [holder, setHolder] = useState("");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const digits = onlyDigits(number);
    const next: Record<string, string> = {};
    if (!holder.trim()) next.holder = "Enter the name on the card";
    if (digits.length < 15 || digits.length > 16) next.number = "Enter a 15–16 digit card number";
    if (!isValidExpiry(expiry)) next.expiry = "Enter a valid future date (MM/YY)";
    if (!/^\d{3,4}$/.test(cvv)) next.cvv = "3–4 digits";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    setTimeout(() => {
      // CVV is validated but intentionally never stored — demo or not.
      onSave({
        id: `pm-${Date.now().toString(36)}`,
        brand: detectBrand(digits),
        last4: digits.slice(-4),
        expiry,
        holder: holder.trim(),
        isDefault: false,
      });
      setSaving(false);
    }, 450);
  };

  return (
    <form onSubmit={submit} noValidate>
      <p className="muted" style={{ fontSize: 12.5 }}>
        Demo checkout — use any made-up number, e.g. 4242 4242 4242 4242. Never enter a real
        card.
      </p>
      <Input
        label="Name on card"
        autoComplete="cc-name"
        value={holder}
        onChange={(e) => setHolder(e.target.value)}
        error={errors.holder}
      />
      <Input
        label="Card number"
        inputMode="numeric"
        autoComplete="off"
        placeholder="0000 0000 0000 0000"
        value={number}
        onChange={(e) => setNumber(formatCardNumber(e.target.value))}
        error={errors.number}
      />
      <div className={styles.formGrid}>
        <Input
          label="Expiry (MM/YY)"
          inputMode="numeric"
          autoComplete="off"
          placeholder="MM/YY"
          value={expiry}
          onChange={(e) => {
            const digits = onlyDigits(e.target.value).slice(0, 4);
            setExpiry(digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
          }}
          error={errors.expiry}
        />
        <Input
          label="Security code (CVV)"
          inputMode="numeric"
          autoComplete="off"
          type="password"
          value={cvv}
          onChange={(e) => setCvv(onlyDigits(e.target.value).slice(0, 4))}
          error={errors.cvv}
          hint="Never stored"
        />
      </div>
      <div className={styles.formActions}>
        <Button type="submit" loading={saving}>
          {submitLabel}
        </Button>
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
