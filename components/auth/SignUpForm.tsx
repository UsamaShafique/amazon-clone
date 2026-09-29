"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./auth.module.css";
import { Input, PasswordInput } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/providers/AuthProvider";
import { AuthError } from "@/lib/auth/authService";
import { cx, isValidEmail } from "@/lib/utils";

export function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alert, setAlert] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const requirements = useMemo(
    () => [
      { label: "At least 8 characters", met: password.length >= 8 },
      { label: "Contains a number", met: /\d/.test(password) },
      { label: "Contains a letter", met: /[a-zA-Z]/.test(password) },
    ],
    [password],
  );

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setAlert(null);
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = "Enter your name";
    if (!email.trim()) nextErrors.email = "Enter your email";
    else if (!isValidEmail(email)) nextErrors.email = "Enter a valid email address";
    if (!requirements.every((r) => r.met))
      nextErrors.password = "Password doesn't meet the requirements below";
    if (confirm !== password) nextErrors.confirm = "Passwords must match";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      await signUp(name, email, password);
      setSuccess(true);
      setTimeout(() => router.push(redirect), 1200);
    } catch (err) {
      setLoading(false);
      if (err instanceof AuthError && err.code === "email_taken") {
        setAlert(err.message);
      } else {
        setAlert(err instanceof Error ? err.message : "Something went wrong. Try again.");
      }
    }
  };

  if (success) {
    return (
      <div className={styles.card} role="status">
        <h1 className={styles.cardTitle}>Account created 🎉</h1>
        <p>
          Welcome to Shopora, <strong>{name.split(" ")[0]}</strong>! You&apos;re signed in and
          being redirected…
        </p>
      </div>
    );
  }

  return (
    <>
      {alert && (
        <div className="alertBox" role="alert" style={{ width: "min(400px, 100%)" }}>
          <span className="alertIcon" aria-hidden="true">
            !
          </span>
          <div>
            <strong>There was a problem</strong>
            {alert}{" "}
            <Link href="/signin" className="link">
              Sign in instead
            </Link>
          </div>
        </div>
      )}

      <div className={styles.card}>
        <h1 className={styles.cardTitle}>Create account</h1>
        <form onSubmit={submit} noValidate>
          <Input
            label="Your name"
            autoComplete="name"
            placeholder="First and last name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            autoFocus
          />
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <PasswordInput
            label="Password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          <ul className={styles.requirements} aria-label="Password requirements">
            {requirements.map((r) => (
              <li key={r.label} className={cx(r.met ? styles.reqMet : styles.reqUnmet)}>
                {r.met ? "✓" : "○"} {r.label}
              </li>
            ))}
          </ul>
          <PasswordInput
            label="Re-enter password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            error={errors.confirm}
          />
          <Button type="submit" fullWidth loading={loading}>
            Create your Shopora account
          </Button>
          <p className={styles.fine}>
            By creating an account, you agree to Shopora&apos;s{" "}
            <Link href="/help" className="link">
              Conditions of Use
            </Link>
            . This is a demo — don&apos;t use a real password.
          </p>
        </form>
        <p className={styles.switchRow}>
          Already have an account?{" "}
          <Link href="/signin" className="link">
            Sign in ›
          </Link>
        </p>
      </div>
    </>
  );
}
