import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, ChevronRight, Activity, Timer, HelpCircle, ArrowRight } from "lucide-react";
import { GRAND_PRIX_LIST } from "@/lib/grand-prix";

export const revalidate = 86400; // Static revalidation daily

const CANONICAL_URL = "https://www.formula1telemetry.com/circuits";

export const metadata: Metadata = {
  title: "2026 F1 Circuits & Track Telemetry Benchmarks | F1 Telemetry",
  description:
    "Explore all 24 Formula 1 Grand Prix circuits. Track lengths, turn counts, DRS zones, speed trap benchmarks, lap records, and aerodynamic demands.",
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    title: "2026 F1 Circuits & Track Telemetry Benchmarks | F1 Telemetry",
    description:
      "Comprehensive telemetry specs, speed traps, and lap records across all 24 World Championship circuits.",
    url: CANONICAL_URL,
    type: "website",
  },
};

const CIRCUITS_FAQS = [
  {
    question: "What is the longest circuit on the 2026 F1 calendar?",
    answer:
      "Circuit de Spa-Francorchamps in Belgium (Round 10) is the longest track on the 2026 calendar, measuring 7,004 meters with 19 turns and extreme elevation changes through Eau Rouge and Raidillon.",
  },
  {
    question: "What is the shortest track on the 2026 F1 calendar?",
    answer:
      "Circuit de Monaco (Round 6) is the shortest circuit at 3,337 meters, featuring 19 low-speed corners, zero straights over 600m, and the lowest top speed trap of the season at 292.5 km/h.",
  },
  {
    question: "Which F1 circuit has the highest top speed trap?",
    answer:
      "Autodromo Nazionale Monza (Round 13) holds the record for highest terminal velocity on the calendar, with cars reaching 354.2 km/h into the Turn 1 chicane.",
  },
  {
    question: "How do DRS zones impact circuit telemetry?",
    answer:
      "Opening the Drag Reduction System (DRS) rear wing flap reduces aerodynamic drag by approximately 20-25%, yielding an instant acceleration boost of 14 km/h to 22 km/h on straights.",
  },
];

export default function CircuitsDirectoryPage() {
  const circuits = GRAND_PRIX_LIST;

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
        name: "Circuits",
        item: CANONICAL_URL,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: CIRCUITS_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Breadcrumb nav */}
        <nav aria-label="Breadcrumb" className="text-xs font-mono text-zinc-500 flex items-center gap-2">
          <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-zinc-200">Circuits</span>
        </nav>

        {/* Page Header */}
        <header className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="racing" className="text-xs">CIRCUIT ARCHITECTURE</Badge>
            <span className="text-xs font-mono text-zinc-500">23 CHAMPIONSHIP VENUES</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase flex items-center gap-3">
            <MapPin className="w-8 h-8 sm:w-10 h-10 text-racing-red" />
            <span>Formula 1 Circuits &amp; Track Telemetry</span>
          </h1>

          {/* AEO Direct Answer Target Box (40-60 words) */}
          <div className="p-4 rounded-xl bg-carbon-900 border border-zinc-800 text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-3xl">
            <p>
              <strong className="text-white font-semibold">What are the 2026 Formula 1 circuits?</strong> The 2026 championship is hosted across 23 world-renowned racing tracks, ranging from high-speed power temples like Monza (354.2 km/h) and Silverstone to technical street circuits like Monaco and Singapore. Each circuit profile includes official lap records, corner counts, DRS corridors, and tyre degradation ratings.
            </p>
          </div>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
            Technical telemetry profiles, circuit geometries, heavy braking zones, and official all-time lap records across all 23 Grand Prix tracks.
          </p>
        </header>

        {/* 23 Circuits Grid */}
        <section aria-label="23 Formula 1 Circuits" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {circuits.filter((c) => c.round > 0).map((c) => (
            <article key={c.id}>
              <Link href={`/circuits/${c.id}`}>
                <Card className="hover:border-zinc-700 transition-all hover:-translate-y-1 bg-carbon-900/90 group h-full">
                  <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-zinc-500">
                          ROUND {c.round}
                        </span>
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {c.country}
                        </Badge>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                    </div>

                    <div>
                      <h2 className="font-extrabold text-lg text-white group-hover:text-racing-red transition-colors tracking-tight">
                        {c.circuitName}
                      </h2>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {c.name}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-3 border-t border-zinc-800/80 text-xs font-mono text-zinc-400">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Track Length:</span>
                        <span className="text-zinc-200">{c.lapDistanceMeters.toLocaleString()}m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Corners:</span>
                        <span className="text-zinc-200">{c.turns} Turns ({c.drsZones} DRS)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Top Speed Trap:</span>
                        <span className="text-amber-400 font-bold">{c.topSpeedTrapKmH} km/h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Full Throttle:</span>
                        <span className="text-racing-red font-semibold">{c.fullThrottlePercent}%</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs font-mono text-racing-cyan">
                      <span className="flex items-center gap-1">
                        <Timer className="w-3.5 h-3.5" />
                        <span>Lap Record:</span>
                      </span>
                      <span className="text-white font-bold">{c.lapRecord.time}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </article>
          ))}
        </section>

        {/* Visible FAQ Section */}
        <section aria-label="Frequently Asked Questions" className="pt-8 border-t border-zinc-800/80 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-racing-red" />
              <span>Circuit Architecture &amp; Telemetry FAQ</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Technical answers regarding circuit telemetry, top speed traps, and track records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CIRCUITS_FAQS.map((faq, i) => (
              <div key={i} className="p-4 rounded-xl border border-zinc-800 bg-carbon-900/60 space-y-1.5">
                <h3 className="text-sm font-bold text-zinc-200">{faq.question}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

