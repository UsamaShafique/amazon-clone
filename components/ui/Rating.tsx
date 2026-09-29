import styles from "./ui.module.css";
import { cx } from "@/lib/utils";

interface RatingProps {
  value: number;
  count?: number;
  size?: "sm" | "md";
  showValue?: boolean;
}

/** Amazon-style star row with fractional fill + optional review count. */
export function Rating({ value, count, size = "sm", showValue = false }: RatingProps) {
  const percent = Math.round((value / 5) * 100);
  return (
    <span className={cx(styles.rating, size === "md" && styles.ratingMd)}>
      {showValue && <span className={styles.ratingValue}>{value.toFixed(1)}</span>}
      <span
        className={styles.stars}
        role="img"
        aria-label={`${value.toFixed(1)} out of 5 stars`}
      >
        <span className={styles.starsBase} aria-hidden="true">
          ★★★★★
        </span>
        <span className={styles.starsFill} style={{ width: `${percent}%` }} aria-hidden="true">
          ★★★★★
        </span>
      </span>
      {count !== undefined && (
        <span className={styles.ratingCount}>{count.toLocaleString("en-US")}</span>
      )}
    </span>
  );
}
