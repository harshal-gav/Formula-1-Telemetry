import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trophy, Users, Shield, Calendar, ArrowRight } from "lucide-react";
import { QuickAnswer } from "@/components/ui/quick-answer";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { ProMarketingCard } from "@/components/pro/pro-marketing-card";
import { ProGate } from "@/components/pro/pro-gate";
import { PRO_DRIVERS } from "@/lib/drivers";
import { getTeamColor } from "@/lib/utils";

export const revalidate = 3600; // ISR hourly

const CANONICAL_URL = "https://www.formula1telemetry.com/standings";

export const metadata: Metadata = {
  title: "2026 F1 Championship Standings | Formula 1 Telemetry",
  description:
    "Official 2026 Formula 1 World Championship points standings for drivers and constructors, title battle differentials, and race victory totals.",
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    title: "2026 F1 Championship Standings | Formula 1 Telemetry",
    description:
      "Championship points tables, constructor standings, race wins, and podium totals for the 2026 Formula 1 season.",
    url: CANONICAL_URL,
    type: "website",
  },
};

const CONSTRUCTORS_LIST = [
  { position: "1", id: "mercedes", name: "Mercedes", points: "652", wins: "12", color: "#27F4D2" },
  { position: "2", id: "ferrari", name: "Ferrari", points: "510", wins: "2", color: "#E80020" },
  { position: "3", id: "red_bull", name: "Red Bull Racing", points: "415", wins: "3", color: "#3671C6" },
  { position: "4", id: "mclaren", name: "McLaren", points: "398", wins: "3", color: "#FF8000" },
  { position: "5", id: "rb", name: "RB F1 Team", points: "114", wins: "0", color: "#6692FF" },
  { position: "6", id: "alpine", name: "Alpine", points: "69", wins: "0", color: "#FF87BC" },
  { position: "7", id: "haas", name: "Haas F1 Team", points: "31", wins: "0", color: "#B6BABD" },
  { position: "8", id: "audi", name: "Audi", points: "28", wins: "0", color: "#E21B23" },
  { position: "9", id: "williams", name: "Williams", points: "12", wins: "0", color: "#64C4FF" },
  { position: "10", id: "aston_martin", name: "Aston Martin", points: "7", wins: "0", color: "#229971" },
  { position: "11", id: "cadillac", name: "Cadillac F1 Team", points: "0", wins: "0", color: "#D4AF37" },
];

const STANDINGS_FAQS = [
  {
    question: "Who leads the 2026 Formula 1 World Championship?",
    answer:
      "Andrea Kimi Antonelli leads the Drivers' Championship with 390 points and 9 victories driving for Mercedes, followed by Red Bull Racing's Max Verstappen (279 points) and Mercedes' George Russell (262 points).",
  },
  {
    question: "How are points awarded in Formula 1?",
    answer:
      "Championship points are awarded to the top 10 finishers in a Grand Prix: 25-18-15-12-10-8-6-4-2-1. Sprint races award 8-7-6-5-4-3-2-1 to the top 8 finishers.",
  },
  {
    question: "Which team leads the 2026 Constructors' Championship?",
    answer:
      "Mercedes holds P1 in the World Constructors' Championship with 652 points and 12 victories, followed by Scuderia Ferrari (510 points) and Red Bull Racing (415 points).",
  },
  {
    question: "How often is this standings table updated?",
    answer:
      "The championship standings are refreshed after each official Grand Prix classification, reflecting race finishing positions, sprint points, and steward decisions.",
  },
];

export default function StandingsPage() {
  const drivers = PRO_DRIVERS;
  const lastUpdated = "2026-11-10T18:00:00Z";

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${CANONICAL_URL}/#dataset`,
    name: "2026 Formula 1 Championship Standings Dataset",
    description:
      "Official point totals, race victories, positions, and constructor affiliations for the 2026 FIA Formula 1 World Championship.",
    url: CANONICAL_URL,
    dateModified: lastUpdated,
    license: "https://www.formula1telemetry.com/terms",
    isAccessibleForFree: true,
    creator: {
      "@type": "Organization",
      name: "Formula 1 Telemetry",
    },
    variableMeasured: ["Points", "Championship Position", "Race Wins", "Constructor Affiliation"],
  };

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
        name: "Standings",
        item: CANONICAL_URL,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: STANDINGS_FAQS.map((faq) => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 w-full max-w-full overflow-hidden">
        {/* Breadcrumb nav */}
        <nav aria-label="Breadcrumb" className="text-xs font-mono text-zinc-500 flex items-center gap-2">
          <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-zinc-200">Standings</span>
        </nav>

        {/* Page Header */}
        <header className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="racing" className="text-xs">WORLD CHAMPIONSHIP</Badge>
              <span className="text-xs font-mono text-zinc-500 uppercase">OFFICIAL CLASSIFICATION</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              <span>Last updated: November 10, 2026 (Official Post-Race Verification)</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase flex items-center gap-2.5 sm:gap-3">
            <Trophy className="w-7 h-7 sm:w-8 h-8 text-amber-400 shrink-0" />
            <span>2026 Formula 1 Championship Standings</span>
          </h1>

          <QuickAnswer
            question="What are the 2026 Formula 1 standings?"
            answer="In the 2026 Formula 1 World Championship, Andrea Kimi Antonelli leads the Drivers' Championship with 390 points and 9 victories for Mercedes, followed by Red Bull Racing's Max Verstappen (279 pts, 3 wins) and Mercedes' George Russell (262 pts, 3 wins). Mercedes leads the World Constructors' Championship with 652 points ahead of Ferrari (510 pts)."
          />

          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
            Point standings, title battle differentials, and race victory totals for both the Driver&apos;s World Championship and Constructor&apos;s World Championship.
          </p>
        </header>

        {/* Pro Gated Championship Standings */}
        <ProGate
          title="Unlock Pro Championship Standings & Title Battle Analytics"
          description="Access official Driver & Constructor World Championship standings, points differentials, race victory logs, and pace telemetry deltas."
        >
        {/* 1. Driver Standings Section */}
        <section aria-label="Drivers' Championship Standings" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-racing-red" />
              <span>Drivers&apos; World Championship Standings</span>
            </h2>
            <span className="text-xs font-mono text-zinc-500">20 DRIVERS</span>
          </div>

          <Card className="border-zinc-800 bg-carbon-900 shadow-xl overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left font-mono text-xs">
                  <caption className="sr-only">Official 2026 Formula 1 Drivers' Championship Standings Table</caption>
                  <thead className="bg-zinc-950 text-zinc-400 text-[11px] uppercase tracking-wider border-b border-zinc-800">
                    <tr>
                      <th scope="col" className="py-2.5 px-3 sm:px-4 text-center w-12">Pos</th>
                      <th scope="col" className="py-2.5 px-3 sm:px-4">Driver</th>
                      <th scope="col" className="py-2.5 px-3 sm:px-4 hidden md:table-cell">Constructor</th>
                      <th scope="col" className="py-2.5 px-3 text-center hidden sm:table-cell">Country</th>
                      <th scope="col" className="py-2.5 px-3 sm:px-4 text-right">Points</th>
                      <th scope="col" className="py-2.5 px-3 text-center w-16">Profile</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                    {drivers.map((driver) => {
                      const teamColor = driver.teamColor || getTeamColor(driver.constructorId);
                      const isPodium = driver.championshipRank <= 3;

                      return (
                        <tr key={driver.id} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="py-2.5 px-3 sm:px-4 text-center font-bold text-white">
                            <span
                              className={`inline-block w-6 text-center ${
                                driver.championshipRank === 1
                                  ? "text-amber-400 font-extrabold"
                                  : driver.championshipRank === 2
                                  ? "text-zinc-200"
                                  : driver.championshipRank === 3
                                  ? "text-amber-700"
                                  : "text-zinc-400"
                              }`}
                            >
                              P{driver.championshipRank}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 sm:px-4 font-bold text-white">
                            <Link href={`/drivers/${driver.id}`} className="flex items-center gap-2 hover:text-racing-red transition-colors">
                              <span
                                className="w-1.5 h-4 rounded-full shrink-0"
                                style={{ backgroundColor: teamColor }}
                              />
                              <span>{driver.name}</span>
                              <span className="text-[10px] text-zinc-500 font-normal hidden sm:inline">#{driver.number}</span>
                            </Link>
                          </td>
                          <td className="py-2.5 px-3 sm:px-4 text-zinc-400 hidden md:table-cell">
                            {driver.constructorName}
                          </td>
                          <td className="py-2.5 px-3 text-center text-zinc-400 hidden sm:table-cell">
                            {driver.country}
                          </td>
                          <td className="py-2.5 px-3 sm:px-4 text-right font-black text-white text-sm">
                            {driver.seasonPoints}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <Link
                              href={`/drivers/${driver.id}`}
                              className="text-xs text-racing-cyan hover:underline inline-flex items-center gap-0.5"
                            >
                              <span>Trace</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 2. Constructor Standings Section */}
        <section aria-label="Constructors' Championship Standings" className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              <span>Constructors&apos; World Championship Standings</span>
            </h2>
            <span className="text-xs font-mono text-zinc-500">10 CONSTRUCTORS</span>
          </div>

          <Card className="border-zinc-800 bg-carbon-900 shadow-xl overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left font-mono text-xs">
                  <caption className="sr-only">Official 2026 Formula 1 Constructors' Championship Standings Table</caption>
                  <thead className="bg-zinc-950 text-zinc-400 text-[11px] uppercase tracking-wider border-b border-zinc-800">
                    <tr>
                      <th scope="col" className="py-2.5 px-3 sm:px-4 text-center w-12">Pos</th>
                      <th scope="col" className="py-2.5 px-3 sm:px-4">Constructor</th>
                      <th scope="col" className="py-2.5 px-3 text-center">Race Victories</th>
                      <th scope="col" className="py-2.5 px-3 sm:px-4 text-right">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                    {CONSTRUCTORS_LIST.map((team) => (
                      <tr key={team.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="py-2.5 px-3 sm:px-4 text-center font-bold text-white">
                          <span
                            className={`inline-block w-6 text-center ${
                              team.position === "1"
                                ? "text-amber-400 font-extrabold"
                                : team.position === "2"
                                ? "text-zinc-200"
                                : team.position === "3"
                                ? "text-amber-700"
                                : "text-zinc-400"
                            }`}
                          >
                            P{team.position}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 sm:px-4 font-bold text-white">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-1.5 h-4 rounded-full shrink-0"
                              style={{ backgroundColor: team.color }}
                            />
                            <span>{team.name}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center text-zinc-300 font-medium">
                          {team.wins} wins
                        </td>
                        <td className="py-2.5 px-3 sm:px-4 text-right font-black text-white text-sm">
                          {team.points} pts
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>
        </ProGate>

        {/* Pro Marketing Card */}
        <ProMarketingCard
          title="Analyze Championship Pace Deltas with Pro"
          subtitle="Compare team telemetry curves, aerodynamic efficiency ratings, and tyre degradation metrics across the entire 2026 grid."
          contextTag="CHAMPIONSHIP ANALYTICS"
        />

        {/* Compact, Crawlable FAQ Accordion */}
        <FAQAccordion
          items={STANDINGS_FAQS}
          title="Championship Standings FAQ"
          subtitle="Technical answers regarding scoring systems, sprint points, and championship deciders."
          className="pt-6 border-t border-zinc-800/80"
        />
      </div>
    </>
  );
}
