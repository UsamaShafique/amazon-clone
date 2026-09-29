import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "Shopora — Shop everything, delivered fast",
    template: "%s | Shopora",
  },
  description:
    "Shopora is a demo marketplace: electronics, computers, home, fashion, beauty, toys, sports and books with fast delivery. A portfolio project — not a real store.",
  openGraph: {
    siteName: "Shopora",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
