import styles from "./ui.module.css";
import { cx } from "@/lib/utils";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  rounded?: boolean;
}

export function Skeleton({ width, height, className, rounded = false }: SkeletonProps) {
  return (
    <span
      className={cx(styles.skeleton, rounded && styles.skeletonRounded, className)}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

/** Card-shaped skeleton matching ProductCard dimensions. */
export function ProductCardSkeleton() {
  return (
    <div className={styles.skeletonCard} aria-hidden="true">
      <Skeleton height={180} />
      <Skeleton height={14} width="90%" />
      <Skeleton height={14} width="65%" />
      <Skeleton height={20} width="40%" />
    </div>
  );
}
