import type { Metadata } from "next";
import { Cinzel, IM_Fell_English, Courier_Prime } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-cinzel",
  display: "swap",
});

const imFell = IM_Fell_English({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-im-fell",
  display: "swap",
});

const courier = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-courier",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Digital Kitab of English Grammar",
  description:
    "Kompendium interaktif bergaya kitab klasik untuk mencatat dan mempelajari tense Bahasa Inggris. Tambah, revisi, dan hapus entri tense Anda.",
  keywords: ["English Grammar", "Tense", "Kitab", "Belajar Bahasa Inggris"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${cinzel.variable} ${imFell.variable} ${courier.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
