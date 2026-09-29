"use client";

import type { User } from "@/types";
import { delay } from "@/lib/utils";
import { readJSON, removeKey, writeJSON } from "@/lib/storage";
import { DEMO_PASSWORD, DEMO_USER } from "@/lib/data/users";

/**
 * Local demo authentication. Accounts live in localStorage and passwords
 * are only lightly obfuscated — this is deliberately NOT a real auth
 * system and must never hold real credentials. The UI depends only on
 * this service's interface, so it can be swapped for a real backend.
 */

const USERS_KEY = "shopora.users";
const SESSION_KEY = "shopora.session";

interface StoredUser extends User {
  secret: string;
}

export type AuthErrorCode = "not_found" | "wrong_password" | "email_taken" | "unknown";

export class AuthError extends Error {
  code: AuthErrorCode;
  constructor(code: AuthErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

// Demo-grade obfuscation only.
function encodeSecret(password: string): string {
  return btoa(`shopora:${password}`);
}

function loadUsers(): StoredUser[] {
  const users = readJSON<StoredUser[]>(USERS_KEY, []);
  if (!users.some((u) => u.id === DEMO_USER.id)) {
    users.unshift({ ...DEMO_USER, secret: encodeSecret(DEMO_PASSWORD) });
    writeJSON(USERS_KEY, users);
  }
  return users;
}

function saveUsers(users: StoredUser[]): void {
  writeJSON(USERS_KEY, users);
}

function toPublic({ secret: _secret, ...user }: StoredUser): User {
  return user;
}

export const authService = {
  getCurrentUser(): User | null {
    return readJSON<User | null>(SESSION_KEY, null);
  },

  async emailExists(email: string): Promise<boolean> {
    await delay(450);
    return loadUsers().some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  },

  async signIn(email: string, password: string): Promise<User> {
    await delay(700);
    const user = loadUsers().find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
    );
    if (!user) {
      throw new AuthError("not_found", "We cannot find an account with that email address.");
    }
    if (user.secret !== encodeSecret(password)) {
      throw new AuthError("wrong_password", "Your password is incorrect.");
    }
    const publicUser = toPublic(user);
    writeJSON(SESSION_KEY, publicUser);
    return publicUser;
  },

  async signUp(name: string, email: string, password: string): Promise<User> {
    await delay(900);
    const users = loadUsers();
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      throw new AuthError(
        "email_taken",
        "An account already exists with this email address. Sign in instead.",
      );
    }
    const user: StoredUser = {
      id: `u-${Date.now().toString(36)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
      secret: encodeSecret(password),
    };
    users.push(user);
    saveUsers(users);
    const publicUser = toPublic(user);
    writeJSON(SESSION_KEY, publicUser);
    return publicUser;
  },

  signOut(): void {
    removeKey(SESSION_KEY);
  },

  async updateProfile(userId: string, patch: { name?: string; email?: string }): Promise<User> {
    await delay(500);
    const users = loadUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new AuthError("not_found", "Account not found.");
    if (
      patch.email &&
      users.some(
        (u) => u.id !== userId && u.email.toLowerCase() === patch.email!.trim().toLowerCase(),
      )
    ) {
      throw new AuthError("email_taken", "That email is already in use by another account.");
    }
    users[idx] = {
      ...users[idx],
      name: patch.name?.trim() || users[idx].name,
      email: patch.email?.trim().toLowerCase() || users[idx].email,
    };
    saveUsers(users);
    const publicUser = toPublic(users[idx]);
    writeJSON(SESSION_KEY, publicUser);
    return publicUser;
  },

  async changePassword(userId: string, current: string, next: string): Promise<void> {
    await delay(600);
    const users = loadUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new AuthError("not_found", "Account not found.");
    if (users[idx].secret !== encodeSecret(current)) {
      throw new AuthError("wrong_password", "Your current password is incorrect.");
    }
    users[idx] = { ...users[idx], secret: encodeSecret(next) };
    saveUsers(users);
  },

  /** Demo-only "forgot password": resets directly without email delivery. */
  async resetPassword(email: string, next: string): Promise<void> {
    await delay(800);
    const users = loadUsers();
    const idx = users.findIndex((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (idx === -1) {
      throw new AuthError("not_found", "We cannot find an account with that email address.");
    }
    users[idx] = { ...users[idx], secret: encodeSecret(next) };
    saveUsers(users);
  },
};
