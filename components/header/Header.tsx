"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Header.module.css";
import { Logo } from "./Logo";
import { SearchBar } from "./SearchBar";
import { AccountMenu } from "./AccountMenu";
import { DeliverTo } from "./DeliverTo";
import { LanguageMenu } from "./LanguageMenu";
import { CartLink } from "./CartLink";
import { NavBar } from "./NavBar";
import { AllMenuDrawer } from "./AllMenuDrawer";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header} id="top">
      <div className={styles.topBar}>
        <button
          type="button"
          className={styles.mobileHamburger}
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <span className={styles.hamburger} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>

        <Logo />

        <div className={styles.deliverDesktop}>
          <DeliverTo />
        </div>

        <div className={styles.searchDesktop}>
          <SearchBar />
        </div>

        <div className={styles.langDesktop}>
          <LanguageMenu />
        </div>

        <div className={styles.accountDesktop}>
          <AccountMenu />
        </div>

        <Link href="/orders" className={`${styles.headerAction} ${styles.ordersDesktop}`}>
          <span className={styles.actionLine1}>Returns</span>
          <span className={styles.actionLine2}>&amp; Orders</span>
        </Link>

        <CartLink />
      </div>

      {/* Mobile: full-width search row, sticky while scrolling */}
      <div className={styles.searchMobile}>
        <SearchBar />
      </div>

      {/* Mobile: deliver-to strip */}
      <div className={styles.deliverMobile}>
        <DeliverTo variant="mobile" />
      </div>

      <NavBar onOpenMenu={() => setMenuOpen(true)} />

      <AllMenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
