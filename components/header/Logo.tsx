import Link from "next/link";
import styles from "./Header.module.css";

/** Original Shopora wordmark — bag glyph + lowercase wordmark + swoosh. */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className={styles.logo} aria-label="Shopora home">
      <svg
        className={styles.logoMark}
        viewBox="0 0 24 24"
        width="22"
        height="22"
        aria-hidden="true"
      >
        <path
          d="M5 8h14l-1.2 12.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z"
          fill="#febd69"
        />
        <path
          d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8"
          fill="none"
          stroke="#fff"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      {!compact && (
        <span className={styles.logoText}>
          shopora
          <svg className={styles.logoSwoosh} viewBox="0 0 64 8" aria-hidden="true">
            <path
              d="M2 3 C 20 9, 44 9, 62 3"
              fill="none"
              stroke="#febd69"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          </svg>
        </span>
      )}
    </Link>
  );
}
