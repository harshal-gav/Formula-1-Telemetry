import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, ChevronRight, Flag, Activity, Gauge } from "lucide-react";
import { QuickAnswer } from "@/components/ui/quick-answer";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { ProMarketingCard } from "@/components/pro/pro-marketing-card";
import { ProGate } from "@/components/pro/pro-gate";
import { GRAND_PRIX_LIST } from "@/lib/grand-prix";

export const revalidate = 3600; // ISR hourly

const CANONICAL_URL = "https://www.formula1telemetry.com/races";

export const metadata: Metadata = {
  title: "2026 F1 Race Calendar & Results | Formula 1 Telemetry",
  description:
    "Explore the complete 2026 Formula 1 race schedule, Grand Prix dates, circuit specifications, telemetry overviews, and round results for all 23 rounds.",
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    title: "2026 F1 Race Calendar & Results | Formula 1 Telemetry",
    description:
      "Complete 2026 Formula 1 season calendar with circuit telemetry benchmarks, session schedules, and race results.",
    url: CANONICAL_URL,
    type: "website",
  },
};

const RACES_FAQS = [
  {
    question: "How many races are on the 2026 Formula 1 calendar?",
    answer:
      "The 2026 Formula 1 World Championship schedule features 23 official Grand Prix rounds spanning across Europe, the Americas, Asia, Australia, and the Middle East.",
  },
  {
    question: "How quickly are F1 telemetry and race results published?",
    answer:
      "Official race results, qualifying classifications, and lap timing charts are published within 15 minutes of session completion. Car telemetry overlays and tyre degradation models are processed continuously throughout race weekends.",
  },
  {
    question: "Where can I view circuit telemetry parameters like top speed and DRS zones?",
    answer:
      "Each Grand Prix round links to its dedicated race detail and circuit telemetry benchmark page, detailing track length, turn count, heavy braking zones (>4.8G deceleration), full throttle percentage, and speed trap benchmarks.",
  },
  {
    question: "What is the fastest track on the 2026 F1 calendar?",
    answer:
      "Monza (Autodromo Nazionale Monza, Round 13) is the fastest circuit on the 2026 calendar, featuring an average lap speed exceeding 260 km/h and top speed traps reaching 354.2 km/h at the Variante del Rettifilo.",
  },
];

export default function RacesPage() {
  const races = GRAND_PRIX_LIST;

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
        name: "Races",
        item: CANONICAL_URL,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: RACES_FAQS.map((faq) => ({
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
          <span className="text-zinc-200">Races</span>
        </nav>

        {/* Page Header */}
        <header className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="racing" className="text-xs">SEASON SCHEDULE</Badge>
            <span className="text-xs font-mono text-zinc-500">23 OFFICIAL ROUNDS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase flex items-center gap-3">
            <Calendar className="w-8 h-8 sm:w-10 h-10 text-racing-red" />
            <span>2026 Formula 1 Grand Prix Calendar</span>
          </h1>

          <QuickAnswer
            question="What is the 2026 Formula 1 schedule?"
            answer="The 2026 Formula 1 championship consists of 23 Grand Prix rounds starting with the Australian Grand Prix at Albert Park in March and concluding in Abu Dhabi in December. Each round features complete lap timing data, fastest lap telemetry benchmarks, tyre compound degradation curves, and finishing classifications."
          />

          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
            Complete official timetable, circuit telemetry benchmarks, speed trap velocities, and race outcomes for the 2026 World Championship.
          </p>
        </header>

        {/* Grid of 23 Races - Pro Access Only */}
        <ProGate
          title="Unlock Grand Prix Calendar & Race Telemetry"
          description="Access official session timetables, circuit telemetry benchmarks, speed trap velocities, live telemetry feeds, and finishing classifications across all 23 Grand Prix rounds."
        >
          <section aria-label="Grand Prix Rounds" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {races.filter((r) => r.round > 0).map((race) => {
              const isCompleted = race.status === "completed";

              return (
                <article key={race.round}>
                  <Link href={`/races/${race.round}`}>
                    <Card className="hover:border-zinc-700 transition-all hover:-translate-y-1 bg-carbon-900/90 group h-full">
                      <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-zinc-500">
                              ROUND {race.round}
                            </span>
                            <Badge variant={isCompleted ? "secondary" : "racing"} className="text-[10px]">
                              {isCompleted ? "COMPLETED" : "UPCOMING"}
                            </Badge>
                          </div>
                          <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                        </div>

                        <div>
                          <h2 className="font-extrabold text-lg text-white group-hover:text-racing-red transition-colors tracking-tight">
                            {race.name}
                          </h2>
                          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1 font-mono">
                            <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                            <span>{race.circuitName}</span>
                            <span>•</span>
                            <span>{race.country}</span>
                          </div>
                          {race.result && (
                            <div className="mt-2 text-xs font-mono text-amber-400 font-semibold flex items-center gap-1">
                              <Flag className="w-3 h-3 text-racing-red" />
                              <span>Winner: {race.result.winner}</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2 pt-3 border-t border-zinc-800/80 text-xs font-mono text-zinc-400">
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-500">Circuit Specs:</span>
                            <span className="text-zinc-200">{race.lapDistanceMeters}m • {race.turns} Turns</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-500">Speed Trap:</span>
                            <span className="text-amber-400 font-semibold">{race.topSpeedTrapKmH} km/h</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-500">Overtaking:</span>
                            <span className="text-zinc-300">{race.overtakingDifficulty} ({race.drsZones} DRS)</span>
                          </div>
                        </div>

                        <div className="pt-2 flex items-center justify-between text-xs font-mono text-racing-cyan">
                          <span className="flex items-center gap-1">
                            <Activity className="w-3.5 h-3.5" />
                            <span>Telemetry Profile</span>
                          </span>
                          <span className="text-[11px] text-zinc-500">Lap Record: {race.lapRecord.time}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </article>
              );
            })}
          </section>
        </ProGate>

        {/* Pro Marketing Banner for Race Calendar */}
        <ProMarketingCard
          title="Analyze Flying Lap Telemetry for Every Race"
          subtitle="Pro members get full throttle and braking telemetry traces, tyre degradation curves, and session replays across all 23 Grand Prix circuits."
          contextTag="RACE TELEMETRY PASS"
        />

        {/* Compact, Crawlable FAQ Accordion */}
        <FAQAccordion
          items={RACES_FAQS}
          title="Grand Prix Calendar & Timing FAQ"
          subtitle="Technical answers regarding season dates, session timing, and circuit telemetry benchmarks."
          className="pt-6 border-t border-zinc-800/80"
        />
      </div>
    </>
  );
}
