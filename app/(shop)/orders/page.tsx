import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { OrdersPageClient } from "@/components/orders/OrdersPageClient";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = { title: "Your Orders", robots: { index: false } };

export default function OrdersPage() {
  return (
    <RequireAuth>
      <main className="container" style={{ paddingBottom: 24, maxWidth: 980 }}>
        <Breadcrumb
          items={[{ label: "Your Account", href: "/account" }, { label: "Your Orders" }]}
        />
        <h1 className="pageTitle">Your Orders</h1>
        <OrdersPageClient />
      </main>
    </RequireAuth>
  );
}
