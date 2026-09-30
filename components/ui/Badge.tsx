import type { BadgeType } from "@/types";
import styles from "./ui.module.css";
import { cx } from "@/lib/utils";

const LABELS: Record<BadgeType, string> = {
  bestseller: "Bestseller",
  choice: "Top pick",
  deal: "Deal",
  new: "New",
  limited: "Low stock",
};

export function Badge({ type }: { type: BadgeType }) {
  return <span className={cx(styles.badge, styles[`badge-${type}`])}>{LABELS[type]}</span>;
}
