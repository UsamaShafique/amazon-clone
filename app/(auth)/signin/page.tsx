import type { Metadata } from "next";
import { Suspense } from "react";
import { SignInForm } from "@/components/auth/SignInForm";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Shopora demo account.",
  robots: { index: false },
};

export default function SignInPage() {
  return (
    <Suspense fallback={<Skeleton height={320} width={400} />}>
      <SignInForm />
    </Suspense>
  );
}
