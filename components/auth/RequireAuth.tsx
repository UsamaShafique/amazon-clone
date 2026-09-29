"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Client-side route guard: demo auth lives in localStorage, so protection
 * happens after hydration. Guests are redirected to /signin with a
 * redirect back to where they were headed.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "guest") {
      router.replace(`/signin?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [status, router, pathname]);

  if (status !== "authed") {
    return (
      <div className="container" style={{ padding: "24px 16px" }} aria-busy="true">
        <p className="visually-hidden">Checking your sign-in status…</p>
        <Skeleton height={32} width="40%" />
        <div style={{ height: 12 }} />
        <Skeleton height={180} />
        <div style={{ height: 12 }} />
        <Skeleton height={180} />
      </div>
    );
  }

  return <>{children}</>;
}
