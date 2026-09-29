import type { Metadata } from "next";
import { AddressStep } from "@/components/checkout/AddressStep";

export const metadata: Metadata = { title: "Checkout — Address", robots: { index: false } };

export default function CheckoutAddressPage() {
  return <AddressStep />;
}
