import type { Metadata } from "next";
import { ReviewStep } from "@/components/checkout/ReviewStep";

export const metadata: Metadata = { title: "Checkout — Review order", robots: { index: false } };

export default function CheckoutReviewPage() {
  return <ReviewStep />;
}
