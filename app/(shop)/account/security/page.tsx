import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { SecurityClient } from "@/components/account/SecurityClient";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = { title: "Login & Security", robots: { index: false } };

export default function SecurityPage() {
  return (
    <RequireAuth>
      <main className="container" style={{ paddingBottom: 24 }}>
        <Breadcrumb
          items={[{ label: "Your Account", href: "/account" }, { label: "Login & Security" }]}
        />
        <h1 className="pageTitle">Login &amp; Security</h1>
        <SecurityClient />
      </main>
    </RequireAuth>
  );
}
