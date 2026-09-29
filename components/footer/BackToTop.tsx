"use client";

import styles from "./Footer.module.css";

export function BackToTop() {
  return (
    <button
      type="button"
      className={styles.backToTop}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      Back to top
    </button>
  );
}
