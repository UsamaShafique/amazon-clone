import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Customer Service",
  description: "Shopora help center — shipping, returns, orders and account questions.",
  alternates: { canonical: "/help" },
};

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "Where is my order?",
    a: "Go to Your Orders to see status, tracking and the estimated delivery date for every order. Demo orders progress automatically through fulfilment states.",
  },
  {
    q: "How do returns work?",
    a: "Most items can be returned within 30 days of delivery. In this demo, returns are illustrative — no physical goods exist, which does keep our warehouse costs down.",
  },
  {
    q: "How much does shipping cost?",
    a: "Orders over $35 ship free. Below that, a flat $5.99 applies. Items marked ⚡ plus are eligible for expedited demo delivery.",
  },
  {
    q: "Is my payment information safe?",
    a: "No real payments are processed anywhere on Shopora. The checkout accepts mock card details only — never enter a real card number.",
  },
  {
    q: "How do I try the demo account?",
    a: "Sign in with demo@shopora.com and password demo1234 to explore a seeded account with order history, addresses and saved payment methods.",
  },
];

export default function HelpPage() {
  return (
    <main className="container" style={{ maxWidth: 860, paddingBottom: 40 }}>
      <h1 className="pageTitle">Customer Service</h1>
      <div className="card" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 18 }}>Quick links</h2>
        <p>
          <Link className="link" href="/orders">
            Track or view your orders
          </Link>{" "}
          ·{" "}
          <Link className="link" href="/account">
            Manage your account
          </Link>{" "}
          ·{" "}
          <Link className="link" href="/account/addresses">
            Edit addresses
          </Link>{" "}
          ·{" "}
          <Link className="link" href="/cart">
            View your cart
          </Link>
        </p>
      </div>
      <div className="card">
        <h2 style={{ fontSize: 18, marginBottom: 12 }}>Frequently asked questions</h2>
        {FAQS.map((faq) => (
          <details
            key={faq.q}
            style={{ borderTop: "1px solid var(--border)", padding: "12px 4px" }}
          >
            <summary style={{ cursor: "pointer", fontWeight: 700 }}>{faq.q}</summary>
            <p style={{ marginTop: 8, color: "var(--text-secondary)" }}>{faq.a}</p>
          </details>
        ))}
      </div>
    </main>
  );
}
