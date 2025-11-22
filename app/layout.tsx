import type { Metadata } from "next";
import "./globals.css";
import React from "react";

import { Toaster } from "@/components/ui/sonner";
import OnboardingWrapper from "@/context/onboarding-wrapper";
import Providers from "@/providers/tansack-provider";
import { VerificationProvider } from "@/providers/verification-provider";

import { getSession } from "./actions/session.actions";
import { dmSans } from "./fonts";
// import { OnboardingProvider } from '@/context/onboarding-context';

export const metadata: Metadata = {
  title: {
    template: "%s | Gramaze Healthcare Platform",
    default: "Gramaze Platform - Modern Healthcare Solutions",
  },
  description:
    "A comprehensive healthcare platform connecting patients with caregivers",
  keywords: [
    "healthcare",
    "patient care",
    "caregivers",
    "medical platform",
    "health tracking",
  ],
  authors: [
    { name: "Smartrob Technologies", url: "https://gramze.vercel.app" },
  ],
  creator: "Smartrob Technologies",
  publisher: "Smartrob Technologies",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#4f46e5",
      },
    ],
  },
  // themeColor: [
  //   { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  //   { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  // ],
  appleWebApp: {
    title: "Healthcare Platform",
    statusBarStyle: "black-translucent",
    capable: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  return (
    <html lang="en">
      <body className={`h-full ${dmSans.variable} antialiased`}>
        <VerificationProvider isVerified={session.isVerified || false}>
          <Providers>
            <OnboardingWrapper serverSession={session}>
              <main className="h-full">{children}</main>
              <Toaster richColors expand={true} />
            </OnboardingWrapper>
          </Providers>
        </VerificationProvider>
      </body>
    </html>
  );
}
