"use client";

import { useState } from "react";
import type { Product } from "@/types";
import styles from "./pdp.module.css";
import { cx } from "@/lib/utils";

export function Gallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  return (
    <div className={styles.gallery}>
      <div className={styles.thumbs} role="tablist" aria-label="Product images">
        {product.images.map((src, i) => (
          <button
            key={src}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Image ${i + 1} of ${product.images.length}`}
            className={cx(styles.thumb, i === active && styles.thumbActive)}
            onClick={() => setActive(i)}
            onMouseEnter={() => setActive(i)}
          >
            <img src={src} alt="" width={56} height={56} loading="lazy" />
          </button>
        ))}
      </div>
      <div className={styles.mainImageWrap}>
        <img
          src={product.images[active]}
          alt={product.title}
          className={styles.mainImage}
          width={560}
          height={560}
        />
      </div>
    </div>
  );
}
