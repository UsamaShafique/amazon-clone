"use client";

import { useId } from "react";
import styles from "./QuantitySelect.module.css";

interface QuantitySelectProps {
  value: number;
  onChange: (quantity: number) => void;
  max?: number;
  label?: string;
  /** Adds a "0 (Delete)" option like the reference cart experience. */
  allowZero?: boolean;
}

export function QuantitySelect({
  value,
  onChange,
  max = 10,
  label = "Quantity",
  allowZero = false,
}: QuantitySelectProps) {
  const id = useId();
  const options = Array.from({ length: max }, (_, i) => i + 1);
  return (
    <span className={styles.wrap}>
      <label htmlFor={id} className="visually-hidden">
        {label}
      </label>
      <select
        id={id}
        className={styles.select}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {allowZero && <option value={0}>0 (Delete)</option>}
        {options.map((n) => (
          <option key={n} value={n}>
            {allowZero ? n : `Qty: ${n}`}
          </option>
        ))}
      </select>
    </span>
  );
}
