import type { BadgeType } from "@/types";
import styles from "./ui.module.css";
import { cx } from "@/lib/utils";

const LABELS: Record<BadgeType, string> = {
  bestseller: "#1 Best Seller",
  choice: "Shopora's Choice",
  deal: "Limited time deal",
  new: "New arrival",
  limited: "Only a few left",
};

export function Badge({ type }: { type: BadgeType }) {
  return <span className={cx(styles.badge, styles[`badge-${type}`])}>{LABELS[type]}</span>;
}
