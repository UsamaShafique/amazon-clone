import styles from "./ui.module.css";
import { cx, formatPrice } from "@/lib/utils";

interface PriceProps {
  value: number;
  originalPrice?: number;
  discount?: number;
  size?: "sm" | "md" | "lg";
  showDiscountBadge?: boolean;
}

/** Clean modern price: bold figure, muted was-price, optional % pill. */
export function Price({
  value,
  originalPrice,
  discount,
  size = "md",
  showDiscountBadge = false,
}: PriceProps) {
  return (
    <span className={cx(styles.priceRow, styles[`price-${size}`])}>
      <span className={styles.price}>{formatPrice(value)}</span>
      {originalPrice !== undefined && originalPrice > value && (
        <s className={styles.listPrice}>{formatPrice(originalPrice)}</s>
      )}
      {showDiscountBadge && discount ? (
        <span className={styles.discountBadge}>−{discount}%</span>
      ) : null}
    </span>
  );
}
