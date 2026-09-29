"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./Header.module.css";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";

const LIST_LINKS = [
  { label: "Your Wishlist", href: "/wishlist" },
  { label: "Create a List", href: "/wishlist" },
  { label: "Saved for Later", href: "/cart" },
];

const ACCOUNT_LINKS = [
  { label: "Your Account", href: "/account" },
  { label: "Your Orders", href: "/orders" },
  { label: "Your Addresses", href: "/account/addresses" },
  { label: "Payment Options", href: "/account/payments" },
  { label: "Login & Security", href: "/account/security" },
  { label: "Your Preferences", href: "/account/preferences" },
];

export function AccountMenu() {
  const { user, status, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const firstName = user?.name.split(" ")[0];

  return (
    <div
      className={styles.menuHover}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={user ? "/account" : "/signin"}
        className={styles.headerAction}
        aria-haspopup="true"
        aria-expanded={open}
        onFocus={() => setOpen(true)}
      >
        <span className={styles.actionLine1}>
          Hello, {status === "authed" && firstName ? firstName : "sign in"}
        </span>
        <span className={styles.actionLine2}>
          Account &amp; Lists <span className={styles.caret} aria-hidden="true" />
        </span>
      </Link>
      {open && (
        <div className={styles.dropdown} role="menu">
          {!user && (
            <div className={styles.dropdownSignin}>
              <Button
                size="sm"
                className={styles.dropdownSigninBtn}
                onClick={() => {
                  setOpen(false);
                  router.push("/signin");
                }}
              >
                Sign in
              </Button>
              <p className={styles.dropdownNew}>
                New customer?{" "}
                <Link href="/signup" className="link" onClick={() => setOpen(false)}>
                  Start here.
                </Link>
              </p>
            </div>
          )}
          <div className={styles.dropdownColumns}>
            <div>
              <h3 className={styles.dropdownHeading}>Your Lists</h3>
              <ul className={styles.dropdownList}>
                {LIST_LINKS.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} onClick={() => setOpen(false)}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={styles.dropdownHeading}>Your Account</h3>
              <ul className={styles.dropdownList}>
                {ACCOUNT_LINKS.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} onClick={() => setOpen(false)}>
                      {l.label}
                    </Link>
                  </li>
                ))}
                {user ? (
                  <li>
                    <button
                      type="button"
                      className={styles.dropdownSignout}
                      onClick={() => {
                        signOut();
                        setOpen(false);
                        router.push("/");
                      }}
                    >
                      Sign Out
                    </button>
                  </li>
                ) : (
                  <li>
                    <Link href="/signin" onClick={() => setOpen(false)}>
                      Sign In
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
