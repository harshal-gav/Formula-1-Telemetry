import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, ChevronRight, User, HelpCircle, Activity, Award } from "lucide-react";
import { PRO_DRIVERS } from "@/lib/drivers";
import { getTeamColor } from "@/lib/utils";

export const revalidate = 3600; // ISR hourly

const CANONICAL_URL = "https://www.formula1telemetry.com/drivers";

export const metadata: Metadata = {
  title: "2026 F1 Drivers Grid & Profiles | Formula 1 Telemetry",
  description:
    "Complete 2026 Formula 1 driver roster, championship standings, career numbers, team telemetry benchmarks, and driver comparisons for all active drivers.",
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    title: "2026 F1 Drivers Grid & Profiles | Formula 1 Telemetry",
    description:
      "Profiles, career statistics, telemetry offsets, and championship standings for all 20 active Formula 1 drivers.",
    url: CANONICAL_URL,
    type: "website",
  },
};

const DRIVER_FAQS = [
  {
    question: "Who are the top drivers in the 2026 Formula 1 World Championship?",
    answer:
      "The 2026 championship battle is contested by Max Verstappen (#1, Red Bull Racing), Lando Norris (#4, McLaren), Charles Leclerc (#16, Ferrari), Oscar Piastri (#81, McLaren), and Lewis Hamilton (#44, Ferrari), along with the complete 20-driver grid.",
  },
  {
    question: "How is driver telemetry pace offset calculated?",
    answer:
      "Driver pace offset reflects relative corner-entry and apex speed differentials in km/h compared against median grid telemetry across identical track sectors, adjusted for car aerodynamic baseline downforce.",
  },
  {
    question: "Can I compare telemetry traces between teammates?",
    answer:
      "Yes. The telemetry comparison suite allows subscribers to overlay teammate traces (such as Norris vs Piastri or Leclerc vs Hamilton) using identical car setups to analyze braking points, throttle pickup, and steering inputs.",
  },
  {
    question: "How often are driver championship standings updated?",
    answer:
      "Driver championship points, podium counts, and rankings update automatically within minutes of the official FIA race classification for each Grand Prix.",
  },
];

export default function DriversPage() {
  const drivers = PRO_DRIVERS;

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
        name: "Drivers",
        item: CANONICAL_URL,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: DRIVER_FAQS.map((faq) => ({
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
          <span className="text-zinc-200">Drivers</span>
        </nav>

        {/* Page Header */}
        <header className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="racing" className="text-xs">DRIVER ROSTER</Badge>
            <span className="text-xs font-mono text-zinc-500">20 ACTIVE COMPETITORS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase flex items-center gap-3">
            <Users className="w-8 h-8 sm:w-10 h-10 text-racing-red" />
            <span>2026 Formula 1 Championship Drivers</span>
          </h1>

          {/* AEO Direct Answer Target Box (40-60 words) */}
          <div className="p-4 rounded-xl bg-carbon-900 border border-zinc-800 text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-3xl">
            <p>
              <strong className="text-white font-semibold">Who are the 2026 Formula 1 drivers?</strong> The 2026 Formula 1 grid features 20 elite drivers representing 10 constructor teams, headlined by Max Verstappen (Red Bull Racing), Lando Norris (McLaren), and Charles Leclerc (Ferrari). Each driver profile provides individual telemetry benchmarks, throttle aggression ratings, and season points standings.
            </p>
          </div>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
            Driver profiles, car racing numbers, constructor affiliations, and championship performance metrics for the active World Championship grid.
          </p>
        </header>

        {/* Grid of 20 Drivers (Server-rendered HTML) */}
        <section aria-label="Championship Drivers" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {drivers.map((driver) => {
            const teamColor = driver.teamColor || getTeamColor(driver.constructorId);

            return (
              <article key={driver.id}>
                <Link href={`/drivers/${driver.id}`}>
                  <Card className="hover:border-zinc-700 bg-carbon-900/90 hover:-translate-y-1 transition-all group overflow-hidden relative h-full">
                    <div
                      className="absolute top-0 left-0 w-1.5 h-full"
                      style={{ backgroundColor: teamColor }}
                    />
                    <CardContent className="p-5 pl-6 flex flex-col justify-between h-full space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-mono text-xl font-black tracking-tight"
                            style={{ color: teamColor }}
                          >
                            #{driver.number}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500 uppercase px-1.5 py-0.5 rounded bg-zinc-800/80">
                            {driver.code}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5" />
                          <span>P{driver.championshipRank}</span>
                        </span>
                      </div>

                      <div>
                        <h2 className="font-bold text-base text-white group-hover:text-racing-red transition-colors flex items-center justify-between">
                          <span>{driver.name}</span>
                          <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                        </h2>
                        <span className="text-xs text-zinc-400 block mt-0.5 font-medium">
                          {driver.constructorName}
                        </span>
                        <span className="text-[11px] text-zinc-500 font-mono">
                          {driver.country}
                        </span>
                      </div>

                      <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                        <div>
                          <span className="text-zinc-500 text-[10px] block">Points</span>
                          <span className="text-white font-bold">{driver.seasonPoints} pts</span>
                        </div>
                        <div className="text-right">
                          <span className="text-zinc-500 text-[10px] block">Pace Delta</span>
                          <span className="text-racing-cyan font-bold">
                            {driver.speedOffset > 0 ? `+${driver.speedOffset} km/h` : `${driver.speedOffset} km/h`}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </article>
            );
          })}
        </section>

        {/* Visible FAQ Section */}
        <section aria-label="Frequently Asked Questions" className="pt-8 border-t border-zinc-800/80 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-racing-red" />
              <span>Driver Profiles &amp; Telemetry FAQ</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Technical answers regarding telemetry pace metrics, driver numbers, and teammate comparisons.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DRIVER_FAQS.map((faq, i) => (
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
