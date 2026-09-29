"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/types";
import styles from "./pdp.module.css";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/providers/CartProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { formatPrice } from "@/lib/utils";

interface FrequentlyBoughtProps {
  product: Product;
  companions: Product[];
}

export function FrequentlyBought({ product, companions }: FrequentlyBoughtProps) {
  const all = useMemo(() => [product, ...companions], [product, companions]);
  const [checked, setChecked] = useState<string[]>(all.map((p) => p.id));
  const { addItem } = useCart();
  const { showToast } = useToast();

  if (companions.length === 0) return null;

  const selected = all.filter((p) => checked.includes(p.id));
  const total = selected.reduce((sum, p) => sum + p.price, 0);

  const toggle = (id: string) => {
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const addAll = () => {
    selected.forEach((p) => addItem(p.id, 1));
    showToast(
      `Added ${selected.length} item${selected.length > 1 ? "s" : ""} to cart`,
    );
  };

  return (
    <section className={styles.fbt} aria-label="Frequently bought together">
      <h2 className={styles.sectionTitle}>Frequently bought together</h2>
      <div className={styles.fbtRow}>
        <div className={styles.fbtImages}>
          {all.map((p, i) => (
            <span key={p.id} className={styles.fbtImageWrap}>
              {i > 0 && (
                <span className={styles.fbtPlus} aria-hidden="true">
                  +
                </span>
              )}
              <Link href={`/product/${p.id}`}>
                <img src={p.images[0]} alt={p.title} width={110} height={110} loading="lazy" />
              </Link>
            </span>
          ))}
        </div>
        <div className={styles.fbtSummary}>
          <p className={styles.fbtTotal}>
            Total price: <strong>{formatPrice(total)}</strong>
          </p>
          <Button size="sm" onClick={addAll} disabled={selected.length === 0}>
            Add {selected.length > 0 ? `all ${selected.length}` : "selected"} to Cart
          </Button>
        </div>
      </div>
      <ul className={styles.fbtList}>
        {all.map((p, i) => (
          <li key={p.id}>
            <label className={styles.fbtItem}>
              <input
                type="checkbox"
                checked={checked.includes(p.id)}
                onChange={() => toggle(p.id)}
              />
              <span>
                {i === 0 && <strong>This item: </strong>}
                <Link href={`/product/${p.id}`} className="link">
                  {p.title.length > 70 ? `${p.title.slice(0, 70)}…` : p.title}
                </Link>{" "}
                <strong className={styles.fbtPrice}>{formatPrice(p.price)}</strong>
              </span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
