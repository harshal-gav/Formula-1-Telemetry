import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Apex Pulse | Formula 1 Grand Prix Telemetry & Analytics",
  description:
    "Unofficial Grand Prix telemetry, tyre degradation curves, pit strategy modeling, and session replays powered by Jolpica and OpenF1.",
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

