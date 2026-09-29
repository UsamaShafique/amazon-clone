import type { Metadata } from "next";
import { Suspense } from "react";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your Shopora demo account.",
  robots: { index: false },
};

export default function SignUpPage() {
  return (
    <Suspense fallback={<Skeleton height={420} width={400} />}>
      <SignUpForm />
    </Suspense>
  );
}
