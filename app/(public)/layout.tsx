import { Suspense } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FooterAd } from "@/components/ads/footer-ad";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Suspense>
        <FooterAd />
      </Suspense>
      <Footer />
    </div>
  );
}
