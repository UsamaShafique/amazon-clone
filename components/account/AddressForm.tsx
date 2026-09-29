"use client";

import { useState, type FormEvent } from "react";
import type { Address } from "@/types";
import styles from "./account.module.css";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface AddressFormProps {
  initial?: Partial<Address>;
  submitLabel?: string;
  onSave: (address: Address) => void;
  onCancel?: () => void;
}

const COUNTRIES = ["United States", "Canada", "United Kingdom", "Germany", "Pakistan", "UAE"];

export function AddressForm({ initial, submitLabel = "Save address", onSave, onCancel }: AddressFormProps) {
  const [form, setForm] = useState({
    fullName: initial?.fullName ?? "",
    line1: initial?.line1 ?? "",
    line2: initial?.line2 ?? "",
    city: initial?.city ?? "",
    state: initial?.state ?? "",
    postalCode: initial?.postalCode ?? "",
    country: initial?.country ?? "United States",
    phone: initial?.phone ?? "",
    isDefault: initial?.isDefault ?? false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.fullName.trim()) next.fullName = "Enter a full name";
    if (!form.line1.trim()) next.line1 = "Enter a street address";
    if (!form.city.trim()) next.city = "Enter a city";
    if (!form.state.trim()) next.state = "Enter a state or province";
    if (!/^[A-Za-z0-9 -]{3,10}$/.test(form.postalCode.trim()))
      next.postalCode = "Enter a valid postal code";
    if (!/^[+\d][\d ()-]{6,18}$/.test(form.phone.trim()))
      next.phone = "Enter a valid phone number";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    // Simulated latency keeps the loading state visible.
    setTimeout(() => {
      onSave({
        id: initial?.id ?? `addr-${Date.now().toString(36)}`,
        fullName: form.fullName.trim(),
        line1: form.line1.trim(),
        line2: form.line2.trim() || undefined,
        city: form.city.trim(),
        state: form.state.trim(),
        postalCode: form.postalCode.trim(),
        country: form.country,
        phone: form.phone.trim(),
        isDefault: form.isDefault,
      });
      setSaving(false);
    }, 450);
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className={styles.formGrid}>
        <Input
          className={styles.formFull}
          label="Full name (first and last name)"
          autoComplete="name"
          value={form.fullName}
          onChange={set("fullName")}
          error={errors.fullName}
        />
        <Input
          className={styles.formFull}
          label="Address line 1"
          autoComplete="address-line1"
          placeholder="Street address, P.O. box"
          value={form.line1}
          onChange={set("line1")}
          error={errors.line1}
        />
        <Input
          className={styles.formFull}
          label="Address line 2 (optional)"
          autoComplete="address-line2"
          placeholder="Apartment, suite, unit, floor"
          value={form.line2}
          onChange={set("line2")}
        />
        <Input label="City" autoComplete="address-level2" value={form.city} onChange={set("city")} error={errors.city} />
        <Input
          label="State / Province"
          autoComplete="address-level1"
          value={form.state}
          onChange={set("state")}
          error={errors.state}
        />
        <Input
          label="Postal code"
          autoComplete="postal-code"
          inputMode="text"
          value={form.postalCode}
          onChange={set("postalCode")}
          error={errors.postalCode}
        />
        <Select label="Country / Region" autoComplete="country-name" value={form.country} onChange={set("country")}>
          {COUNTRIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
        <Input
          className={styles.formFull}
          label="Phone number"
          type="tel"
          autoComplete="tel"
          placeholder="May be used to assist delivery"
          value={form.phone}
          onChange={set("phone")}
          error={errors.phone}
        />
      </div>
      <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13.5, marginBottom: 12 }}>
        <input
          type="checkbox"
          checked={form.isDefault}
          onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
        />
        Make this my default address
      </label>
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
