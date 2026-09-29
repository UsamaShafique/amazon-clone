"use client";

import Link from "next/link";
import styles from "./home.module.css";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export function SignInCard() {
  const { status } = useAuth();
  const router = useRouter();
  if (status !== "guest") return null;
  return (
    <section className={styles.signinCard} aria-label="Sign in">
      <h2 className={styles.signinTitle}>Sign in for the best experience</h2>
      <p className="muted">
        Track orders, keep a wishlist and check out faster with a Shopora account.
      </p>
      <Button onClick={() => router.push("/signin")} className={styles.signinBtn}>
        Sign in securely
      </Button>
      <p className={styles.signinNew}>
        New customer?{" "}
        <Link href="/signup" className="link">
          Start here.
        </Link>
      </p>
    </section>
  );
}
