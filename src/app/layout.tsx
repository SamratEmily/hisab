import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "হিসাব — Hisab | টাকা-পয়সার হিসাব",
  description:
    "আপনার টাকা-পয়সার হিসাব রাখুন সহজেই। Track money you owe and money owed to you.",
  keywords: ["hisab", "money tracker", "bangladesh", "দেনা", "পাওনা"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
