import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: {
    default: "Benua Sport — Toko Olahraga Online Ready Stock & Pre-Order",
    template: "%s | Benua Sport", // Jadi kalau di page lain title-nya "Promo", otomatis ke-render "Promo | Benua Sport"
  },
  description:
    "Belanja perlengkapan olahraga Ready Stock & Pre-Order transparan. Kunci slot batch terbatas dengan DP 30% dan pantau status pesananmu.",
  keywords: [
    "toko olahraga",
    "pre order sepatu",
    "perlengkapan olahraga",
    "badminton",
    "sepatu lari",
    "Benua Sport",
  ],
  authors: [{ name: "Benua Sport Team" }],
  metadataBase: new URL("https://benuasport.com"), // Ganti pake domain asli lu nanti
  openGraph: {
    title: "Benua Sport — Toko Olahraga Online Ready Stock & Pre-Order",
    description:
      "Belanja perlengkapan olahraga dengan status transparan dari DP sampai barang sampai.",
    url: "https://benuasport.vercel.app",
    siteName: "Benua Sport",
    locale: "id_ID",
    type: "website",
  },
  verification: {
    google: "AIJbjadH8ChZ48Nt-nh08iimALMhH3luSJRHApgf9_w",
  },
  robots: {
    index: true,
    follow: true,
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>
          <CartProvider>
            <Header />
            {children}
            <Footer />
            <CartDrawer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
