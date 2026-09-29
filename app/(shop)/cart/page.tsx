import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/CartPageClient";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Review the items in your Shopora cart, save them for later or check out.",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <main className="container" style={{ paddingBottom: 24 }}>
      <CartPageClient />
    </main>
  );
}
