"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import { CATEGORIES } from "@/lib/data/categories";

const QUICK_LINKS = [
  { label: "Today's Deals", href: "/search?deals=1&sort=discount" },
  { label: "Best Sellers", href: "/search?sort=reviews" },
  { label: "New Releases", href: "/search?sort=newest" },
  { label: "Customer Service", href: "/help" },
];

export function NavBar({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <nav className={styles.navBar} aria-label="Main navigation">
      <button type="button" className={styles.navAll} onClick={onOpenMenu}>
        <span className={styles.hamburger} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        All
      </button>
      <div className={styles.navLinks}>
        {QUICK_LINKS.map((l) => (
          <Link key={l.label} href={l.href} className={styles.navLink}>
            {l.label}
          </Link>
        ))}
        {CATEGORIES.map((c) => (
          <Link key={c.slug} href={`/category/${c.slug}`} className={styles.navLink}>
            {c.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
