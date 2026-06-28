import type { Metadata, Viewport } from "next";
import { Inter, Tajawal } from "next/font/google";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

import {
  MAIN_CONTENT_ID,
  SkipNavigation,
} from "@/components/common/SkipNavigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { isLocale, routing } from "@/lib/i18n/routing";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
  preload: true,
});

const cookieYesWebsiteKey = process.env.NEXT_PUBLIC_COOKIEYES_WEBSITE_KEY;

export const metadata: Metadata = {
  title: {
    default: "elReda Advertising",
    template: "%s | elReda Advertising",
  },
  description:
    "A full-service creative and technology agency helping businesses build brands, websites, stores, systems, and marketing from one place.",
};

export const viewport: Viewport = {
  viewportFit: "cover",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      // TODO: Add licensed self-hosted Clash Display font files later and wire them through next/font/local.
      className={`${inter.variable} ${tajawal.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-black text-text-primary">
        {cookieYesWebsiteKey ? (
          <Script
            id="cookieyes"
            src={`https://cdn-cookieyes.com/client_data/${cookieYesWebsiteKey}/script.js`}
            strategy="beforeInteractive"
          />
        ) : null}
        <SkipNavigation />
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main
            id={MAIN_CONTENT_ID}
            tabIndex={-1}
            className="flex-1 bg-[image:var(--gradient-dark)] outline-none"
          >
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
