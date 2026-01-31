import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Soontae Joo',
    default: 'Soontae Joo | Full-Stack Developer',
  },
  description: 'Soontae Joo - Full-Stack Developer Portfolio. Building innovative web experiences.',
  keywords: ['Soontae Joo', 'Developer', 'Portfolio', 'Full-Stack', 'React', 'Next.js'],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://portfolio-2026-ivory-one.vercel.app',
    title: 'Soontae Joo | Full-Stack Developer',
    description: 'Building innovative web experiences.',
    siteName: 'Soontae Joo Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Soontae Joo Portfolio',
      },
    ],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

import { AdminProvider } from "@/providers/AdminProvider";

import { AdminControl } from "@/components/AdminControl";

import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Background } from "@/components/Background";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Background />
            <AdminProvider>
              <Navbar />
              {children}
              <AdminControl />
              <Toaster />
            </AdminProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
