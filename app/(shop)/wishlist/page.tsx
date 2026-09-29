import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { WishlistPageClient } from "@/components/wishlist/WishlistPageClient";

export const metadata: Metadata = {
  title: "Your Wishlist",
  description: "Products you have saved on Shopora.",
  robots: { index: false },
};

export default function WishlistPage() {
  return (
    <RequireAuth>
      <main className="container" style={{ paddingBottom: 24 }}>
        <h1 className="pageTitle">Your Wishlist</h1>
        <WishlistPageClient />
      </main>
    </RequireAuth>
  );
}
