import styles from "./ui.module.css";
import { cx, formatPrice, splitPrice } from "@/lib/utils";

interface PriceProps {
  value: number;
  originalPrice?: number;
  discount?: number;
  size?: "sm" | "md" | "lg";
  showDiscountBadge?: boolean;
}

/** Amazon-style price: superscript symbol + cents, optional list price. */
export function Price({
  value,
  originalPrice,
  discount,
  size = "md",
  showDiscountBadge = false,
}: PriceProps) {
  const { whole, fraction } = splitPrice(value);
  return (
    <span className={cx(styles.priceRow, styles[`price-${size}`])}>
      {showDiscountBadge && discount ? (
        <span className={styles.discountBadge}>-{discount}%</span>
      ) : null}
      <span className={styles.price} aria-label={formatPrice(value)}>
        <span className={styles.priceSymbol} aria-hidden="true">
          $
        </span>
        <span className={styles.priceWhole} aria-hidden="true">
          {whole}
        </span>
        <span className={styles.priceFraction} aria-hidden="true">
          {fraction}
        </span>
      </span>
      {originalPrice !== undefined && originalPrice > value && (
        <span className={styles.listPrice}>
          List: <s>{formatPrice(originalPrice)}</s>
        </span>
      )}
    </span>
  );
}
