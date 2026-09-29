import type { Metadata } from "next";
import { PaymentStep } from "@/components/checkout/PaymentStep";

export const metadata: Metadata = { title: "Checkout — Payment", robots: { index: false } };

export default function CheckoutPaymentPage() {
  return <PaymentStep />;
}
