import type { ReactNode } from "react";
import Link from "next/link";
import styles from "@/components/auth/auth.module.css";

/** Minimal focused layout for sign-in/sign-up, like the reference flow. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo} aria-label="Shopora home">
          <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
            <path d="M5 8h14l-1.2 12.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" fill="var(--brand)" />
            <path
              d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8"
              fill="none"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          shopora
        </Link>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <nav className={styles.footerLinks} aria-label="Legal">
          <Link href="/help">Conditions of Use</Link>
          <Link href="/help">Privacy Notice</Link>
          <Link href="/help">Help</Link>
        </nav>
        <p className={styles.footerCopy}>
          © 2026 Shopora Demo — a portfolio project, not affiliated with Amazon.
        </p>
      </footer>
    </div>
  );
}
