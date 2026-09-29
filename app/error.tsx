"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface for debugging — a real store would report to telemetry here.
    console.error(error);
  }, [error]);

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
        <p style={{ fontSize: 72, margin: 0 }} aria-hidden="true">
          🔌
        </p>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>Something went wrong</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 20 }}>
          An unexpected error occurred while loading this page. It&apos;s not you, it&apos;s
          us.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            background: "var(--btn-yellow)",
            border: "1px solid #fcd200",
            borderRadius: 100,
            padding: "10px 26px",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </div>
    </main>
  );
}
