import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'leaflet/dist/leaflet.css';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { I18nProviderClient } from "@/locales/client";
import { getLocale } from "@/locales/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portal Informasi Blok M",
  description: "Website informasi resmi untuk wilayah Blok M.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <I18nProviderClient locale={locale}>
          <Header />
          <main className="flex-grow container mx-auto px-6 py-8">
            {children}
          </main>
          <Footer />
        </I18nProviderClient>
      </body>
    </html>
  );
}
