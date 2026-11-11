import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const CANONICAL_URL = "https://www.formula1telemetry.com";

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_URL),
  title: {
    default: "Formula 1 Telemetry | F1 Data Analytics & Comparison",
    template: "%s | Formula 1 Telemetry",
  },
  description:
    "Compare Formula 1 car telemetry traces, speed traps, tyre degradation models, session replays, and predictive race outcomes across 24 Grand Prix.",
  authors: [{ name: "Formula 1 Telemetry Analytics Team" }],
  creator: "Formula 1 Telemetry",
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: CANONICAL_URL,
    title: "Formula 1 Telemetry | F1 Data Analytics & Comparison",
    description:
      "High-resolution Formula 1 car telemetry traces, tyre degradation modeling, session replays, and predictive race outcomes.",
    siteName: "Formula 1 Telemetry",
    images: [
      {
        url: `${CANONICAL_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Formula 1 Telemetry Analytics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Formula 1 Telemetry | F1 Data Analytics & Comparison",
    description:
      "High-resolution Formula 1 car telemetry traces, tyre degradation modeling, session replays, and predictive race outcomes.",
    images: [`${CANONICAL_URL}/opengraph-image`],
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${CANONICAL_URL}/#organization`,
    name: "Formula 1 Telemetry",
    url: CANONICAL_URL,
    logo: `${CANONICAL_URL}/icon.svg`,
    description:
      "Independent Formula 1 telemetry analytics platform delivering high-frequency speed traces, tyre degradation curves, and race strategy replays.",
    sameAs: [
      "https://github.com/formula1telemetry",
      "https://twitter.com/f1telemetry",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${CANONICAL_URL}/#website`,
    url: CANONICAL_URL,
    name: "Formula 1 Telemetry",
    publisher: {
      "@id": `${CANONICAL_URL}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${CANONICAL_URL}/drivers?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-carbon-950 text-zinc-100 antialiased racing-grid-bg w-full max-w-full overflow-x-hidden`}>
        <Providers>
          <Navbar />
          <main className="flex-1 flex flex-col w-full max-w-full overflow-x-hidden">{children}</main>
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
