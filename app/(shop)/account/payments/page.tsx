import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { PaymentsClient } from "@/components/account/PaymentsClient";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = { title: "Payment Options", robots: { index: false } };

export default function PaymentsPage() {
  return (
    <RequireAuth>
      <main className="container" style={{ paddingBottom: 24 }}>
        <Breadcrumb
          items={[{ label: "Your Account", href: "/account" }, { label: "Payment Options" }]}
        />
        <h1 className="pageTitle">Payment Options</h1>
        <PaymentsClient />
      </main>
    </RequireAuth>
  );
}
