import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://formula1telemetry.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Apex Pulse | Formula 1 Grand Prix Telemetry & Analytics",
    template: "%s | Apex Pulse",
  },
  description:
    "Unofficial Grand Prix telemetry, tyre degradation curves, pit strategy modeling, session replays, and race predictions powered by Jolpica and OpenF1.",
  keywords: [
    "grand prix telemetry",
    "formula 1 telemetry comparison",
    "openf1 telemetry",
    "pitwall analytics",
    "tyre degradation model",
    "f1 race predictor",
    "lap time progression",
    "f1 session replay",
    "f1 timing tower",
  ],
  authors: [{ name: "Apex Pulse Analytics" }],
  creator: "Apex Pulse",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    title: "Apex Pulse | Grand Prix Telemetry & Analytics",
    description:
      "High-resolution car telemetry traces, tyre degradation modeling, session replays, and predictive race outcomes.",
    siteName: "Apex Pulse",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apex Pulse | Grand Prix Telemetry & Analytics",
    description:
      "High-resolution car telemetry traces, tyre degradation modeling, session replays, and predictive race outcomes.",
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
      <body className="min-h-screen flex flex-col bg-carbon-950 text-zinc-100 antialiased racing-grid-bg">
        <Providers>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
