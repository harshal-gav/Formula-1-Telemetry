import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle2, Rss, ArrowLeft, Activity, Database } from "lucide-react";

export const revalidate = 86400;

const CANONICAL_URL = "https://www.formula1telemetry.com/changelog";

export const metadata: Metadata = {
  title: "Formula 1 Telemetry Platform Changelog & Data Feed",
  description:
    "Track live platform updates, telemetry model improvements, race results sync logs, and data feed releases on Formula 1 Telemetry.",
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    title: "Formula 1 Telemetry Platform Changelog & Data Feed",
    description:
      "Public changelog and telemetry data feed release history for the Formula 1 Telemetry platform.",
    url: CANONICAL_URL,
    type: "website",
  },
};

const CHANGELOG_ITEMS = [
  {
    date: "November 10, 2026",
    version: "v2.4.0",
    title: "Championship Classification & Abu Dhabi Telemetry Sync",
    badge: "DATA SYNC",
    changes: [
      "Synchronized official FIA championship points standings following Round 24.",
      "Published high-resolution telemetry traces and braking zones for the 2026 season finale.",
      "Updated tyre degradation curves and stint lifespan models across all 24 circuits.",
      "Exposed public JSON results feed at /api/feed/results.json.",
    ],
  },
  {
    date: "October 28, 2026",
    version: "v2.3.0",
    title: "Dual-Driver Overlay Engine & High-Frequency Throttle Logging",
    badge: "FEATURE",
    changes: [
      "Engineered client-side dual-driver dropdown selection across the full 22-driver grid (11 teams).",
      "Optimized DOM rendering with single-data source interaction-based option population.",
      "Added accessible data table alternatives for all telemetry curves.",
      "Upgraded server components for instant bot crawlability and sub-2.5s LCP on mobile.",
    ],
  },
  {
    date: "September 15, 2026",
    version: "v2.2.0",
    title: "Monte Carlo Race Predictor & Safety Car Calibration",
    badge: "ALGORITHM",
    changes: [
      "Integrated 10,000-iteration Monte Carlo race simulation engine.",
      "Calibrated circuit safety car probabilities based on 10-year historical incidence rates.",
      "Added pit lane loss delta benchmarks across all 24 Grand Prix venues.",
    ],
  },
];

export default function ChangelogPage() {
  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.formula1telemetry.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Changelog",
        item: CANONICAL_URL,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 w-full max-w-full overflow-hidden">
        {/* Breadcrumb nav */}
        <nav aria-label="Breadcrumb" className="text-xs font-mono text-zinc-500 flex items-center gap-2">
          <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-zinc-200">Changelog</span>
        </nav>

        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="racing" className="text-xs font-mono">PLATFORM UPDATES</Badge>
            <span className="text-xs font-mono text-zinc-500">LIVE FEED</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Platform Changelog &amp; Data Feed
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            A public log of telemetry model updates, timing data synchronizations, and platform feature releases.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <Link
              href="/api/feed/results"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-racing-cyan hover:text-white transition-colors"
            >
              <Rss className="w-3.5 h-3.5" />
              <span>Public JSON Feed (/api/feed/results)</span>
            </Link>
          </div>
        </header>

        {/* Timeline */}
        <section aria-label="Changelog Timeline" className="space-y-8 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-zinc-800">
          {CHANGELOG_ITEMS.map((item, idx) => (
            <div key={idx} className="relative pl-10 space-y-3">
              {/* Dot */}
              <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-carbon-950 border-2 border-racing-red flex items-center justify-center -translate-x-1/2">
                <div className="w-1.5 h-1.5 rounded-full bg-racing-red" />
              </div>

              <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
                <span className="text-white font-bold">{item.version}</span>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-400">{item.date}</span>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {item.badge}
                </Badge>
              </div>

              <Card className="border-zinc-800 bg-carbon-900/90">
                <CardContent className="p-5 space-y-3">
                  <h2 className="text-base font-bold text-white tracking-tight">
                    {item.title}
                  </h2>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    {item.changes.map((change, cIdx) => (
                      <li key={cIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}

