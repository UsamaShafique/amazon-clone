"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./Header.module.css";
import { CATEGORIES } from "@/lib/data/categories";
import { useAuth } from "@/components/providers/AuthProvider";

interface AllMenuDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function AllMenuDrawer({ open, onClose }: AllMenuDrawerProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const item = (label: string, href: string) => (
    <li key={`${label}-${href}`}>
      <Link href={href} className={styles.drawerLink} onClick={onClose}>
        {label}
        <span aria-hidden="true" className={styles.drawerChevron}>
          ›
        </span>
      </Link>
    </li>
  );

  return (
    <div className={styles.drawerOverlay} onClick={onClose}>
      <div
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label="Browse Shopora"
        onClick={(e) => e.stopPropagation()}
      >
        <Link
          href={user ? "/account" : "/signin"}
          className={styles.drawerHello}
          onClick={onClose}
        >
          <span aria-hidden="true">👤</span> Hello,{" "}
          {user ? user.name.split(" ")[0] : "sign in"}
        </Link>
        <button
          ref={closeRef}
          type="button"
          className={styles.drawerClose}
          onClick={onClose}
          aria-label="Close menu"
        >
          ✕
        </button>

        <div className={styles.drawerBody}>
          <section>
            <h3 className={styles.drawerHeading}>Trending</h3>
            <ul className={styles.drawerList}>
              {item("Today's Deals", "/search?deals=1&sort=discount")}
              {item("Best Sellers", "/search?sort=reviews")}
              {item("New Releases", "/search?sort=newest")}
            </ul>
          </section>
          <hr className={styles.drawerRule} />
          <section>
            <h3 className={styles.drawerHeading}>Shop by Department</h3>
            <ul className={styles.drawerList}>
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/category/${c.slug}`}
                    className={styles.drawerLink}
                    onClick={onClose}
                  >
                    <span>
                      <span aria-hidden="true" className={styles.drawerEmoji}>
                        {c.emoji}
                      </span>{" "}
                      {c.name}
                    </span>
                    <span aria-hidden="true" className={styles.drawerChevron}>
                      ›
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <hr className={styles.drawerRule} />
          <section>
            <h3 className={styles.drawerHeading}>Help &amp; Settings</h3>
            <ul className={styles.drawerList}>
              {item("Your Account", "/account")}
              {item("Your Orders", "/orders")}
              {item("Your Wishlist", "/wishlist")}
              {item("Customer Service", "/help")}
              <li>
                {user ? (
                  <button
                    type="button"
                    className={styles.drawerLink}
                    onClick={() => {
                      signOut();
                      onClose();
                      router.push("/");
                    }}
                  >
                    Sign Out
                    <span aria-hidden="true" className={styles.drawerChevron}>
                      ›
                    </span>
                  </button>
                ) : (
                  <Link href="/signin" className={styles.drawerLink} onClick={onClose}>
                    Sign In
                    <span aria-hidden="true" className={styles.drawerChevron}>
                      ›
                    </span>
                  </Link>
                )}
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
