import Link from "next/link";
import styles from "./Footer.module.css";
import { CATEGORIES } from "@/lib/data/categories";
import { BackToTop } from "./BackToTop";

const COLUMNS: Array<{ heading: string; links: Array<{ label: string; href: string }> }> = [
  {
    heading: "Get to Know Us",
    links: [
      { label: "About Shopora", href: "/help" },
      { label: "Customer Service", href: "/help" },
      { label: "Today's Deals", href: "/search?deals=1&sort=discount" },
      { label: "Best Sellers", href: "/search?sort=reviews" },
    ],
  },
  {
    heading: "Shop with Us",
    links: [
      { label: "Your Account", href: "/account" },
      { label: "Your Orders", href: "/orders" },
      { label: "Your Wishlist", href: "/wishlist" },
      { label: "Your Cart", href: "/cart" },
    ],
  },
  {
    heading: "Popular Departments",
    links: CATEGORIES.slice(0, 4).map((c) => ({
      label: c.name,
      href: `/category/${c.slug}`,
    })),
  },
  {
    heading: "Let Us Help You",
    links: [
      { label: "Shipping & Delivery", href: "/help" },
      { label: "Returns & Replacements", href: "/help" },
      { label: "Help Center", href: "/help" },
      { label: "Sign In", href: "/signin" },
    ],
  },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <BackToTop />
      <div className={styles.columnsWrap}>
        <div className={styles.columns}>
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className={styles.heading}>{col.heading}</h3>
              <ul className={styles.list}>
                {col.links.map((l) => (
                  <li key={`${col.heading}-${l.label}`}>
                    <Link href={l.href} className={styles.footerLink}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.bottom}>
        <p className={styles.brand}>
          <span aria-hidden="true">🛍️</span> shopora
        </p>
        <p className={styles.legal}>
          © 2026 Shopora Demo. This is a portfolio project inspired by large marketplace
          UX patterns — it is not affiliated with, endorsed by, or connected to Amazon.com.
          No real payments are processed and no real customer data is collected.
        </p>
      </div>
    </footer>
  );
}
