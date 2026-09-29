import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { AddressesClient } from "@/components/account/AddressesClient";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = { title: "Your Addresses", robots: { index: false } };

export default function AddressesPage() {
  return (
    <RequireAuth>
      <main className="container" style={{ paddingBottom: 24 }}>
        <Breadcrumb
          items={[{ label: "Your Account", href: "/account" }, { label: "Your Addresses" }]}
        />
        <h1 className="pageTitle">Your Addresses</h1>
        <AddressesClient />
      </main>
    </RequireAuth>
  );
}
