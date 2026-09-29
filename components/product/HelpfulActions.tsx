"use client";

import { useState } from "react";
import styles from "./pdp.module.css";
import { useToast } from "@/components/providers/ToastProvider";

export function HelpfulActions({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(false);
  const { showToast } = useToast();

  return (
    <div className={styles.helpfulRow}>
      <span className="muted">
        {count > 0
          ? `${count.toLocaleString("en-US")} people found this helpful`
          : "Was this review helpful?"}
      </span>
      <button
        type="button"
        className={styles.helpfulBtn}
        aria-pressed={voted}
        onClick={() => {
          setVoted((v) => !v);
          setCount((c) => (voted ? c - 1 : c + 1));
        }}
      >
        {voted ? "Helpful ✓" : "Helpful"}
      </button>
      <button
        type="button"
        className={styles.reportBtn}
        onClick={() => showToast("Review reported. Our team will take a look (demo).", "info")}
      >
        Report
      </button>
    </div>
  );
}
