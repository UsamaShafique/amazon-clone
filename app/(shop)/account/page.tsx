import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/account/account.module.css";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { AccountGreeting } from "@/components/account/AccountGreeting";
import { RecentlyViewedSection } from "@/components/home/RecentlyViewedSection";

export const metadata: Metadata = {
  title: "Your Account",
  robots: { index: false },
};

const MODULES = [
  {
    emoji: "📦",
    title: "Your Orders",
    desc: "Track packages, view order details or buy items again",
    href: "/orders",
  },
  {
    emoji: "🔒",
    title: "Login & Security",
    desc: "Edit your name, email and password",
    href: "/account/security",
  },
  {
    emoji: "🏠",
    title: "Your Addresses",
    desc: "Edit addresses and delivery preferences for orders",
    href: "/account/addresses",
  },
  {
    emoji: "💳",
    title: "Payment Options",
    desc: "Manage or add demo payment methods",
    href: "/account/payments",
  },
  {
    emoji: "🤍",
    title: "Your Wishlist",
    desc: "View, add to cart or remove your saved items",
    href: "/wishlist",
  },
  {
    emoji: "🛒",
    title: "Your Cart & Saved Items",
    desc: "Pick up where you left off, including items saved for later",
    href: "/cart",
  },
  {
    emoji: "⚙️",
    title: "Preferences & Communication",
    desc: "Choose which (pretend) emails and alerts you receive",
    href: "/account/preferences",
  },
  {
    emoji: "🎧",
    title: "Customer Service",
    desc: "Browse help topics and frequently asked questions",
    href: "/help",
  },
];

export default function AccountPage() {
  return (
    <RequireAuth>
      <main className="container" style={{ paddingBottom: 24, maxWidth: 1100 }}>
        <AccountGreeting />
        <div className={styles.hubGrid}>
          {MODULES.map((m) => (
            <Link key={m.title} href={m.href} className={styles.hubCard}>
              <span className={styles.hubEmoji} aria-hidden="true">
                {m.emoji}
              </span>
              <span>
                <h2 className={styles.hubTitle}>{m.title}</h2>
                <p className={styles.hubDesc}>{m.desc}</p>
              </span>
            </Link>
          ))}
        </div>
        <RecentlyViewedSection title="Inspired by your browsing history" />
      </main>
    </RequireAuth>
  );
}
