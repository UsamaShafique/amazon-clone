import type { ReactNode } from "react";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <a href="#main-content" className="visually-hidden">
        Skip to main content
      </a>
      <Header />
      <div id="main-content">{children}</div>
      <Footer />
    </div>
  );
}
