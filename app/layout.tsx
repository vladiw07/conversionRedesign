import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://your-domain.com"; // TODO: replace with your real domain (or Vercel URL)
const siteName = "Conversion-Focused Website Redesign";
const title = "Conversion-Focused Website Redesign for Coaches & Consultants";
const description =
  "Front-end website redesign for business coaches and consultants. Clear messaging, stronger authority, and higher conversions — built to generate more booked calls.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: title,
    template: `%s | ${siteName}`,
  },

  description,

  applicationName: siteName,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",

  keywords: [
    "website redesign for coaches",
    "consultant website redesign",
    "conversion-focused website redesign",
    "front-end website redesign",
    "coach website design",
    "consultant website design",
    "improve website conversions",
    "book more calls",
    "landing page redesign",
    "sales page redesign",
    "core web vitals",
    "website performance optimization",
  ],

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title,
    description,
    locale: "en_US",
    images: [
      {
        // Create later: /public/og.png (1200x630)
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },

  icons: {
    icon: "favicon.ico",
    // Optional if you add them later:
    // apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
