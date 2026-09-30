import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

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
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
