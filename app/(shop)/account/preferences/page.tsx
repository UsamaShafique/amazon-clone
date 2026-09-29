import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { PreferencesClient } from "@/components/account/PreferencesClient";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Preferences & Communication",
  robots: { index: false },
};

export default function PreferencesPage() {
  return (
    <RequireAuth>
      <main className="container" style={{ paddingBottom: 24 }}>
        <Breadcrumb
          items={[{ label: "Your Account", href: "/account" }, { label: "Preferences" }]}
        />
        <h1 className="pageTitle">Preferences &amp; Communication</h1>
        <PreferencesClient />
      </main>
    </RequireAuth>
  );
}
