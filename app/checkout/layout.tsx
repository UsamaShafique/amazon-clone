import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CheckoutHeader } from "@/components/checkout/CheckoutChrome";
import { RequireAuth } from "@/components/auth/RequireAuth";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <CheckoutHeader />
      <RequireAuth>{children}</RequireAuth>
    </div>
  );
}
