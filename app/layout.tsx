import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Analytics } from "@vercel/analytics/react";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://formula1telemetry.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Formula 1 Telemetry | Grand Prix Analytics & Telemetry Comparison",
    template: "%s | Formula 1 Telemetry",
  },
  description:
    "Grand Prix telemetry, tyre degradation curves, pit strategy modeling, session replays, and race predictions.",
  keywords: [
    "formula 1 telemetry",
    "f1 telemetry",
    "grand prix telemetry",
    "formula 1 telemetry comparison",
    "real-time telemetry",
    "pitwall analytics",
    "tyre degradation model",
    "f1 race predictor",
    "lap time progression",
    "f1 session replay",
    "f1 timing tower",
  ],
  authors: [{ name: "Formula 1 Telemetry Analytics" }],
  creator: "Formula 1 Telemetry",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    title: "Formula 1 Telemetry | Grand Prix Analytics & Telemetry Comparison",
    description:
      "High-resolution car telemetry traces, tyre degradation modeling, session replays, and predictive race outcomes.",
    siteName: "Formula 1 Telemetry",
  },
  twitter: {
    card: "summary_large_image",
    title: "Formula 1 Telemetry | Grand Prix Analytics & Telemetry Comparison",
    description:
      "High-resolution car telemetry traces, tyre degradation modeling, session replays, and predictive race outcomes.",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.svg", type: "image/svg+xml" },
    ],
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
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-carbon-950 text-zinc-100 antialiased racing-grid-bg w-full max-w-full overflow-x-hidden">
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
