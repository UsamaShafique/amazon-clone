"use client";

import { useState, type FormEvent } from "react";
import styles from "./account.module.css";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { authService, AuthError } from "@/lib/auth/authService";
import { Input, PasswordInput } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { isValidEmail } from "@/lib/utils";

type Editing = "none" | "name" | "email" | "password";

export function SecurityClient() {
  const { user, setUser } = useAuth();
  const { showToast } = useToast();
  const [editing, setEditing] = useState<Editing>("none");
  const [value, setValue] = useState("");
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const startEdit = (mode: Editing) => {
    setEditing(mode);
    setError("");
    setValue(mode === "name" ? user.name : mode === "email" ? user.email : "");
    setCurrent("");
    setNext("");
  };

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (editing === "name" && !value.trim()) {
      setError("Enter your name");
      return;
    }
    if (editing === "email" && !isValidEmail(value)) {
      setError("Enter a valid email address");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const updated = await authService.updateProfile(
        user.id,
        editing === "name" ? { name: value } : { email: value },
      );
      setUser(updated);
      setEditing("none");
      showToast("Your account has been updated");
    } catch (err) {
      setError(err instanceof AuthError ? err.message : "Could not save changes.");
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (next.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await authService.changePassword(user.id, current, next);
      setEditing("none");
      showToast("Password changed");
    } catch (err) {
      setError(err instanceof AuthError ? err.message : "Could not change password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.sectionCard}>
      <div className={styles.row}>
        <div style={{ flex: 1 }}>
          <p className={styles.rowLabel}>Name</p>
          {editing === "name" ? (
            <form onSubmit={saveProfile} noValidate>
              <Input value={value} onChange={(e) => setValue(e.target.value)} error={error} autoFocus />
              <div className={styles.formActions}>
                <Button type="submit" size="sm" loading={saving}>
                  Save changes
                </Button>
                <Button variant="outline" size="sm" onClick={() => setEditing("none")}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <p className={styles.rowValue}>{user.name}</p>
          )}
        </div>
        {editing !== "name" && (
          <Button variant="outline" size="sm" onClick={() => startEdit("name")}>
            Edit
          </Button>
        )}
      </div>

      <div className={styles.row}>
        <div style={{ flex: 1 }}>
          <p className={styles.rowLabel}>Email</p>
          {editing === "email" ? (
            <form onSubmit={saveProfile} noValidate>
              <Input
                type="email"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                error={error}
                autoFocus
              />
              <div className={styles.formActions}>
                <Button type="submit" size="sm" loading={saving}>
                  Save changes
                </Button>
                <Button variant="outline" size="sm" onClick={() => setEditing("none")}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <p className={styles.rowValue}>{user.email}</p>
          )}
        </div>
        {editing !== "email" && (
          <Button variant="outline" size="sm" onClick={() => startEdit("email")}>
            Edit
          </Button>
        )}
      </div>

      <div className={styles.row}>
        <div style={{ flex: 1 }}>
          <p className={styles.rowLabel}>Password</p>
          {editing === "password" ? (
            <form onSubmit={savePassword} noValidate>
              <PasswordInput
                label="Current password"
                autoComplete="current-password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
              />
              <PasswordInput
                label="New password"
                autoComplete="new-password"
                value={next}
                onChange={(e) => setNext(e.target.value)}
                error={error}
                hint="At least 8 characters"
              />
              <div className={styles.formActions}>
                <Button type="submit" size="sm" loading={saving}>
                  Save changes
                </Button>
                <Button variant="outline" size="sm" onClick={() => setEditing("none")}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <p className={styles.rowValue}>••••••••</p>
          )}
        </div>
        {editing !== "password" && (
          <Button variant="outline" size="sm" onClick={() => startEdit("password")}>
            Edit
          </Button>
        )}
      </div>

      <div className={styles.row}>
        <div>
          <p className={styles.rowLabel}>Two-step verification</p>
          <p className={styles.rowValue}>
            Not available in the demo — in production this would manage 2FA devices.
          </p>
        </div>
        <Button variant="outline" size="sm" disabled>
          Manage
        </Button>
      </div>
    </div>
  );
}
