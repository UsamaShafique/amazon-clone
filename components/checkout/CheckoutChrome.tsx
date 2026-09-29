"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./checkout.module.css";
import { useCart } from "@/components/providers/CartProvider";
import { cx } from "@/lib/utils";

const STEPS = [
  { slug: "address", label: "Shipping address" },
  { slug: "payment", label: "Payment method" },
  { slug: "review", label: "Review & place order" },
];

export function CheckoutHeader() {
  const { count, hydrated } = useCart();
  const pathname = usePathname();
  const isSuccess = pathname.endsWith("/success");
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/" className={styles.logo} aria-label="Shopora home">
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path d="M5 8h14l-1.2 12.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" fill="#febd69" />
            <path
              d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8"
              fill="none"
              stroke="#131921"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          shopora
        </Link>
        <h1 className={styles.headerTitle}>
          {isSuccess ? (
            "Order placed"
          ) : (
            <>
              Checkout (
              <Link href="/cart">
                {hydrated ? count : 0} item{(hydrated ? count : 0) === 1 ? "" : "s"}
              </Link>
              )
            </>
          )}
        </h1>
        <span className={styles.lock} aria-label="Secure demo checkout" role="img">
          🔒
        </span>
      </div>
      {!isSuccess && (
        <nav aria-label="Checkout progress" className={styles.steps}>
          {STEPS.map((step, i) => {
            const activeIndex = STEPS.findIndex((s) => pathname.includes(`/${s.slug}`));
            const state = i < activeIndex ? "done" : i === activeIndex ? "active" : "todo";
            return (
              <span
                key={step.slug}
                className={cx(
                  styles.step,
                  state === "active" && styles.stepActive,
                  state === "done" && styles.stepDone,
                )}
                aria-current={state === "active" ? "step" : undefined}
              >
                <span className={styles.stepDot} aria-hidden="true">
                  {state === "done" ? "✓" : i + 1}
                </span>
                {step.label}
              </span>
            );
          })}
        </nav>
      )}
    </header>
  );
}
