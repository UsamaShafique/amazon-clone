"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./auth.module.css";
import { Input, PasswordInput } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { authService, AuthError } from "@/lib/auth/authService";
import { isValidEmail } from "@/lib/utils";

type Step = "email" | "password";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";
  const { signIn } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [alert, setAlert] = useState<{ title: string; body: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Forgot-password modal state
  const [resetOpen, setResetOpen] = useState(false);
  const [resetPassword, setResetPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const continueWithEmail = async (e: FormEvent) => {
    e.preventDefault();
    setAlert(null);
    if (!email.trim()) {
      setFieldError("Enter your email address");
      return;
    }
    if (!isValidEmail(email)) {
      setFieldError("Enter a valid email address (e.g. you@example.com)");
      return;
    }
    setFieldError("");
    setLoading(true);
    const exists = await authService.emailExists(email);
    setLoading(false);
    if (!exists) {
      setAlert({
        title: "We cannot find an account",
        body: "There is no Shopora account with that email address.",
      });
      return;
    }
    setStep("password");
  };

  const submitPassword = async (e: FormEvent) => {
    e.preventDefault();
    setAlert(null);
    if (!password) {
      setFieldError("Enter your password");
      return;
    }
    setFieldError("");
    setLoading(true);
    try {
      const user = await signIn(email, password);
      showToast(`Welcome back, ${user.name.split(" ")[0]}!`);
      router.push(redirect);
    } catch (err) {
      setLoading(false);
      if (err instanceof AuthError && err.code === "wrong_password") {
        setAlert({ title: "There was a problem", body: "Your password is incorrect." });
      } else {
        setAlert({
          title: "There was a problem",
          body: err instanceof Error ? err.message : "Something went wrong. Try again.",
        });
      }
    }
  };

  const submitReset = async (e: FormEvent) => {
    e.preventDefault();
    if (resetPassword.length < 8) {
      setResetError("New password must be at least 8 characters.");
      return;
    }
    setResetError("");
    setResetLoading(true);
    try {
      await authService.resetPassword(email, resetPassword);
      setResetLoading(false);
      setResetOpen(false);
      setResetPassword("");
      showToast("Password updated. Sign in with your new password.", "success");
    } catch (err) {
      setResetLoading(false);
      setResetError(err instanceof Error ? err.message : "Could not reset password.");
    }
  };

  const signupHref = `/signup${email ? `?email=${encodeURIComponent(email)}` : ""}${
    redirect !== "/" ? `${email ? "&" : "?"}redirect=${encodeURIComponent(redirect)}` : ""
  }`;

  return (
    <>
      <div className={styles.demoBox}>
        <strong>Demo account:</strong> <code>demo@shopora.com</code> / <code>demo1234</code> —
        seeded with orders, addresses and payment methods.
      </div>

      {alert && (
        <div className="alertBox" role="alert" style={{ width: "min(400px, 100%)" }}>
          <span className="alertIcon" aria-hidden="true">
            !
          </span>
          <div>
            <strong>{alert.title}</strong>
            {alert.body}
            {alert.title.includes("cannot find") && (
              <p style={{ margin: "6px 0 0" }}>
                <Link className="link" href={signupHref}>
                  Create your Shopora account
                </Link>
              </p>
            )}
          </div>
        </div>
      )}

      <div className={styles.card}>
        <h1 className={styles.cardTitle}>Sign in or create account</h1>

        {step === "email" ? (
          <form onSubmit={continueWithEmail} noValidate>
            <Input
              label="Enter mobile number or email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldError}
              autoFocus
            />
            <Button type="submit" fullWidth loading={loading}>
              Continue
            </Button>
            <p className={styles.fine}>
              By continuing, you agree to Shopora&apos;s{" "}
              <Link href="/help" className="link">
                Conditions of Use
              </Link>{" "}
              and{" "}
              <Link href="/help" className="link">
                Privacy Notice
              </Link>
              . (Demo — no real data is collected.)
            </p>
            <Link href="/help" className="link" style={{ fontSize: 13 }}>
              Need help?
            </Link>
          </form>
        ) : (
          <form onSubmit={submitPassword} noValidate>
            <div className={styles.emailRow}>
              <span className={styles.emailRowAddress}>{email}</span>
              <button
                type="button"
                className="link"
                style={{ background: "none", border: "none", fontSize: 13 }}
                onClick={() => {
                  setStep("email");
                  setPassword("");
                  setAlert(null);
                  setFieldError("");
                }}
              >
                Change
              </button>
            </div>
            <div className={styles.passwordLabelRow}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>Password</span>
              <button
                type="button"
                className="link"
                style={{ background: "none", border: "none", fontSize: 13 }}
                onClick={() => {
                  setResetOpen(true);
                  setResetError("");
                }}
              >
                Forgot password?
              </button>
            </div>
            <PasswordInput
              aria-label="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldError}
              autoFocus
            />
            <Button type="submit" fullWidth loading={loading}>
              Sign in
            </Button>
            <p className={styles.fine}>
              Keep me signed in on this device — sessions persist locally in this demo.
            </p>
          </form>
        )}
      </div>

      <div className={styles.divider}>
        <span>New to Shopora?</span>
      </div>
      <Button
        variant="outline"
        fullWidth
        className={styles.secondary}
        onClick={() => router.push(signupHref)}
      >
        Create your Shopora account
      </Button>

      <div className={styles.workRow}>
        <strong>Buying for work?</strong>
        <br />
        <Link href="/help" className="link">
          Learn about Shopora Business (demo)
        </Link>
      </div>

      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Password assistance"
        width={420}
      >
        <p className="muted" style={{ fontSize: 13 }}>
          In a real store we&apos;d email a one-time code to <strong>{email || "you"}</strong>.
          For this demo, set a new password directly.
        </p>
        {!email || !isValidEmail(email) ? (
          <p className="alertBox" style={{ display: "block" }}>
            Go back and enter your account email first.
          </p>
        ) : (
          <form onSubmit={submitReset} noValidate>
            <PasswordInput
              label="New password"
              autoComplete="new-password"
              value={resetPassword}
              onChange={(e) => setResetPassword(e.target.value)}
              error={resetError}
              hint="At least 8 characters"
            />
            <Button type="submit" fullWidth loading={resetLoading}>
              Save new password
            </Button>
          </form>
        )}
      </Modal>
    </>
  );
}
