import type { Metadata } from "next";
import { Suspense } from "react";
import { SuccessClient } from "@/components/checkout/SuccessClient";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = { title: "Order placed", robots: { index: false } };

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div style={{ maxWidth: 760, margin: "24px auto", padding: "0 16px" }}>
          <Skeleton height={280} />
        </div>
      }
    >
      <SuccessClient />
    </Suspense>
  );
}
