"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@/types";
import { authService } from "@/lib/auth/authService";

export type AuthStatus = "loading" | "guest" | "authed";

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (name: string, email: string, password: string) => Promise<User>;
  signOut: () => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    const current = authService.getCurrentUser();
    setUserState(current);
    setStatus(current ? "authed" : "guest");
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const u = await authService.signIn(email, password);
    setUserState(u);
    setStatus("authed");
    return u;
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const u = await authService.signUp(name, email, password);
    setUserState(u);
    setStatus("authed");
    return u;
  }, []);

  const signOut = useCallback(() => {
    authService.signOut();
    setUserState(null);
    setStatus("guest");
  }, []);

  const setUser = useCallback((u: User) => {
    setUserState(u);
    setStatus("authed");
  }, []);

  const value = useMemo(
    () => ({ user, status, signIn, signUp, signOut, setUser }),
    [user, status, signIn, signUp, signOut, setUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
