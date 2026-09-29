import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { OrderDetailClient } from "@/components/orders/OrderDetailClient";

export const metadata: Metadata = { title: "Order details", robots: { index: false } };

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  return (
    <RequireAuth>
      <main className="container" style={{ paddingBottom: 24, maxWidth: 980 }}>
        <OrderDetailClient orderId={decodeURIComponent(orderId)} />
      </main>
    </RequireAuth>
  );
}
