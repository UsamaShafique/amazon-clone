import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 520 }}>
        <p style={{ fontSize: 84, margin: 0 }} aria-hidden="true">
          🐕
        </p>
        <h1 style={{ fontSize: 30, marginBottom: 8 }}>Looking for something?</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 20 }}>
          We&apos;re sorry — the page you requested could not be found. Meet Biscuit, one of
          the (imaginary) dogs of Shopora. He also couldn&apos;t find it.
        </p>
        <p
          style={{
            display: "flex",
            gap: 18,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link href="/" className="link" style={{ fontSize: 16 }}>
            Go to Shopora&apos;s home page
          </Link>
          <Link href="/help" className="link" style={{ fontSize: 16 }}>
            Visit customer service
          </Link>
        </p>
      </div>
    </main>
  );
}
