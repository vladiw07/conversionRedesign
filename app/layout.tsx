import Script from "next/script";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/**
 * IMPORTANT:
 * Set this to your real production URL (custom domain preferred).
 * Example: "https://conversion-redesign.vercel.app" or "https://yourdomain.com"
 */
const SITE_URL = "https://conversion-redesign.vercel.app/";

const BRAND = "ConversionFlow";
const SERVICE = "Conversion-Focused Website Redesign";
const TITLE = "Conversion-Focused Website Redesign for Coaches & Consultants";
const DESCRIPTION =
  "Front-end website redesign for business coaches and consultants — focused on clarity, authority, and conversions to generate more booked calls.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb", // Tailwind blue-600 vibe
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  // For Ads: keep title tight and exact-match to the offer
  title: TITLE,
  description: DESCRIPTION,

  applicationName: BRAND,
  referrer: "origin-when-cross-origin",

  // Canonical: good once you're on a stable production domain.
  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
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
    url: SITE_URL,
    siteName: BRAND,
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: "/og.png", // put a 1200x630 og.png in /public
        width: 1200,
        height: 630,
        alt: TITLE,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },

  icons: {
    icon: "/favicon4.ico", // put your favicon.ico in /public
    // apple: "/apple-touch-icon.png", // optional later
  },

  // Helps some crawlers understand language/region (global English)
  other: {
    "content-language": "en",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `${BRAND} — ${SERVICE}`,
    url: SITE_URL,
    description: DESCRIPTION,
    areaServed: "Worldwide",
    availableLanguage: ["English"],
    // Keep it honest: you offer front-end redesign for coaches/consultants
    serviceType: "Front-end website redesign",
    audience: {
      "@type": "Audience",
      audienceType: "Business coaches and consultants",
    },
  };

  return (
    <html lang="en">
      <head>
        {/* Google Ads tag */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17933281806"
          strategy="afterInteractive"
        />

        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17933281806');
          `}
        </Script>

      {/* Microsoft Clarity */}
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
        >
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "vcu0xd6lbz");
          `}
        </Script>

        
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Structured data (helps Google understand what the page is) */}
        <Script
          id="ld-json"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {children}
      </body>
    </html>
  );
}
