import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  ArrowLeft,
  Activity,
  Gauge,
  Disc3,
  Timer,
  Zap,
  HelpCircle,
  Flag,
  Shield,
  Layers,
} from "lucide-react";
import { GRAND_PRIX_LIST, GrandPrixCircuit } from "@/lib/grand-prix";
import { PRO_DRIVERS } from "@/lib/drivers";

export const revalidate = 3600; // ISR hourly

export function generateStaticParams() {
  return GRAND_PRIX_LIST.map((gp) => ({ round: gp.round.toString() }));
}

const CANONICAL_BASE = "https://www.formula1telemetry.com/races";

function findGrandPrix(roundParam: string): GrandPrixCircuit | undefined {
  const normalized = decodeURIComponent(roundParam).toLowerCase().trim();
  return GRAND_PRIX_LIST.find(
    (gp) =>
      gp.round.toString() === normalized ||
      gp.id.toLowerCase() === normalized ||
      gp.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === normalized
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ round: string }>;
}): Promise<Metadata> {
  const { round } = await params;
  const gp = findGrandPrix(round);

  if (!gp) {
    return {
      title: "Grand Prix Round | Formula 1 Telemetry",
      description: "Formula 1 race telemetry traces, circuit speeds, and session classifications.",
    };
  }

  const title = `${gp.name} Telemetry & Results | F1 Telemetry`;
  const description = `Analyze the 2026 ${gp.name} at ${gp.circuitName}. High-resolution speed trap velocity of ${gp.topSpeedTrapKmH} km/h, ${gp.turns} turns, tyre degradation, and telemetry benchmarks.`;

  return {
    title,
    description: description.slice(0, 160),
    alternates: {
      canonical: `${CANONICAL_BASE}/${gp.round}`,
    },
    openGraph: {
      title,
      description,
      url: `${CANONICAL_BASE}/${gp.round}`,
      type: "website",
    },
  };
}

export default async function RaceDetailPage({
  params,
}: {
  params: Promise<{ round: string }>;
}) {
  const { round } = await params;
  const gp = findGrandPrix(round);

  if (!gp) {
    notFound();
  }

  const isCompleted = gp.status === "completed";
  const canonicalUrl = `${CANONICAL_BASE}/${gp.round}`;

  const sportsEventSchema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "@id": `${canonicalUrl}/#event`,
    name: `2026 ${gp.name}`,
    description: gp.description,
    startDate: "2026-03-01T15:00:00Z",
    location: {
      "@type": "Place",
      name: gp.circuitName,
      address: {
        "@type": "PostalAddress",
        addressCountry: gp.country,
      },
    },
    sport: "Formula 1 Auto Racing",
    competitor: PRO_DRIVERS.slice(0, 5).map((d) => ({
      "@type": "Person",
      name: d.name,
      affiliation: {
        "@type": "SportsTeam",
        name: d.constructorName,
      },
    })),
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
        name: "Races",
        item: "https://www.formula1telemetry.com/races",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: gp.name,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sportsEventSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 w-full max-w-full overflow-hidden">
        {/* Navigation & Breadcrumbs */}
        <div className="flex items-center justify-between">
          <Link
            href="/races"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to 2026 Calendar</span>
          </Link>
          <nav aria-label="Breadcrumb" className="text-xs font-mono text-zinc-500 hidden sm:flex items-center gap-2">
            <Link href="/" className="hover:text-zinc-300">Home</Link>
            <span>/</span>
            <Link href="/races" className="hover:text-zinc-300">Races</Link>
            <span>/</span>
            <span className="text-zinc-200">Round {gp.round}</span>
          </nav>
        </div>

        {/* Hero Header */}
        <header className="p-6 sm:p-8 rounded-2xl bg-carbon-900 border border-zinc-800 shadow-2xl relative overflow-hidden space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="racing" className="text-xs font-mono">ROUND {gp.round} OF 24</Badge>
            <Badge variant={isCompleted ? "secondary" : "racing"} className="text-xs">
              {isCompleted ? "OFFICIAL COMPLETED EVENT" : "UPCOMING BENCHMARK"}
            </Badge>
            <span className="text-xs font-mono text-zinc-400">{gp.country}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            {gp.name} Telemetry &amp; Race Analysis
          </h1>

          {/* AEO Direct Answer Target Box (40-60 words) */}
          <div className="p-4 rounded-xl bg-carbon-950/80 border border-zinc-800 text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-3xl">
            <p>
              <strong className="text-white font-semibold">What are the telemetry characteristics of the {gp.name}?</strong> Held at the {gp.circuitName}, this {gp.lapDistanceMeters.toLocaleString()}m circuit demands {gp.fullThrottlePercent}% full-throttle commitment per lap across {gp.turns} corners and {gp.drsZones} DRS zones. Cars reach speed trap peaks of {gp.topSpeedTrapKmH} km/h with {gp.heavyBrakingZones} heavy deceleration zones exceeding 4.8G.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-zinc-400 pt-2 border-t border-zinc-800/80">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-racing-red" />
              <span>{gp.circuitName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Timer className="w-4 h-4 text-amber-400" />
              <span>Lap Record: {gp.lapRecord.time} ({gp.lapRecord.driver}, {gp.lapRecord.year})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-racing-cyan" />
              <span>Safety Car Prob: {Math.round(gp.safetyCarProbability * 100)}%</span>
            </div>
          </div>
        </header>

        {/* Circuit Telemetry Metric Cards */}
        <section aria-label="Key Telemetry Metrics" className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="border-zinc-800 bg-carbon-900/90">
            <CardContent className="p-4 space-y-1 font-mono">
              <span className="text-[10px] text-zinc-500 uppercase block">Top Speed Trap</span>
              <span className="text-2xl font-black text-white">{gp.topSpeedTrapKmH}</span>
              <span className="text-xs text-zinc-400 block">km/h terminal speed</span>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-carbon-900/90">
            <CardContent className="p-4 space-y-1 font-mono">
              <span className="text-[10px] text-zinc-500 uppercase block">Full Throttle</span>
              <span className="text-2xl font-black text-racing-red">{gp.fullThrottlePercent}%</span>
              <span className="text-xs text-zinc-400 block">of lap distance</span>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-carbon-900/90">
            <CardContent className="p-4 space-y-1 font-mono">
              <span className="text-[10px] text-zinc-500 uppercase block">Heavy Braking</span>
              <span className="text-2xl font-black text-amber-400">{gp.heavyBrakingZones}</span>
              <span className="text-xs text-zinc-400 block">zones &gt; 4.8G load</span>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-carbon-900/90">
            <CardContent className="p-4 space-y-1 font-mono">
              <span className="text-[10px] text-zinc-500 uppercase block">Pit Lane Loss</span>
              <span className="text-2xl font-black text-racing-cyan">{gp.pitLaneDeltaSeconds}s</span>
              <span className="text-xs text-zinc-400 block">stationary + transit delta</span>
            </CardContent>
          </Card>
        </section>

        {/* 200+ WORDS DATA-DERIVED PROSE ARTICLE */}
        <article className="p-6 sm:p-8 rounded-2xl bg-carbon-900/60 border border-zinc-800 space-y-6 text-zinc-300 leading-relaxed text-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-racing-red" />
            <span>Engineering Deep Dive &amp; Telemetry Trace Analysis</span>
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-zinc-300">
            <p>
              The <strong>{gp.name}</strong> staged at the <strong>{gp.circuitName}</strong> represents a signature aerodynamic and mechanical benchmark on the 2026 Formula 1 championship calendar. Spanning an exact lap length of <strong>{gp.lapDistanceMeters.toLocaleString()} meters</strong>, cars negotiate {gp.turns} distinct corners requiring {gp.gearShiftsPerLap} gear shifts per completed lap. Power units operate at wide-open throttle for {gp.fullThrottlePercent}% of each tour, testing internal combustion efficiency, MGU-K energy harvesting on long straights, and aerodynamic drag efficiency across {gp.drsZones} designated DRS activation corridors.
            </p>
            <p>
              Braking stability is paramount at {gp.circuitName}, with drivers braking down from terminal velocities of {gp.topSpeedTrapKmH} km/h into {gp.heavyBrakingZones} primary deceleration zones. The signature apex focus occurs at <strong>{gp.keyApexTurns}</strong>, where lateral tyre loading stresses both front and rear axles simultaneously. Teams frequently face trade-offs between aerodynamic downforce and top-end straight-line velocity. Running higher rear wing angles enhances corner-exit traction and reduces thermal tyre slip through mid-speed bends, but sacrifices up to 8-11 km/h at the main straight speed trap, leaving cars vulnerable during overtaking defense.
            </p>
            <p>
              Tyre degradation modeling plays a pivotal strategic role during race stints. The pit lane delta time stands at <strong>{gp.pitLaneDeltaSeconds} seconds</strong> from entry line to exit blend, requiring strategists to time pit windows carefully to avoid releasing drivers into heavy midfield traffic. With an expected safety car probability of <strong>{Math.round(gp.safetyCarProbability * 100)}%</strong>, pitwall engineers constantly monitor virtual safety car windows, dynamic tyre degradation deltas (averaging 0.08s to 0.14s per lap on Medium compounds), and track temperature variations ({gp.weather.trackTemp}°C nominal benchmark) to execute game-winning undercuts.
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Overtaking Difficulty Rating: <strong>{gp.overtakingDifficulty}</strong></span>
            </div>
            <Link href={`/circuits/${gp.id}`}>
              <Button variant="outline" size="sm" className="text-xs font-mono gap-1.5">
                <span>Explore Full Circuit Profile</span>
                <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </Button>
            </Link>
          </div>
        </article>

        {/* Telemetry Trace Alternative Specification Table */}
        <section aria-label="Circuit Telemetry Specifications" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Full Circuit Telemetry Benchmark Table</span>
            </h2>
            <span className="text-xs font-mono text-zinc-500">OFFICIAL BENCHMARK DATA</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-carbon-900 shadow-xl">
            <table className="w-full text-left font-mono text-xs">
              <caption className="sr-only">Comprehensive Engineering Telemetry Specifications for {gp.name}</caption>
              <thead className="bg-zinc-950 text-zinc-400 uppercase text-[11px] border-b border-zinc-800">
                <tr>
                  <th scope="col" className="py-2.5 px-4">Parameter Channel</th>
                  <th scope="col" className="py-2.5 px-4">Engineering Value</th>
                  <th scope="col" className="py-2.5 px-4">Strategic &amp; Driver Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-white">Circuit Lap Distance</td>
                  <td className="py-2.5 px-4">{gp.lapDistanceMeters.toLocaleString()} meters</td>
                  <td className="py-2.5 px-4 text-zinc-400">{gp.totalLaps} race laps total distance</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-white">Terminal Speed Trap Velocity</td>
                  <td className="py-2.5 px-4 text-amber-400 font-bold">{gp.topSpeedTrapKmH} km/h</td>
                  <td className="py-2.5 px-4 text-zinc-400">Peak straightline speed before brake application</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-white">Corner Count &amp; Layout</td>
                  <td className="py-2.5 px-4">{gp.turns} Turns</td>
                  <td className="py-2.5 px-4 text-zinc-400">Critical apex zones at {gp.keyApexTurns}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-white">Full Throttle Commitment</td>
                  <td className="py-2.5 px-4 text-racing-red font-bold">{gp.fullThrottlePercent}%</td>
                  <td className="py-2.5 px-4 text-zinc-400">High ICE demand with {gp.gearShiftsPerLap} gear shifts/lap</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-white">DRS Corridors</td>
                  <td className="py-2.5 px-4">{gp.drsZones} Activation Zones</td>
                  <td className="py-2.5 px-4 text-zinc-400">Drag reduction deltas yield +14 to +18 km/h overtake speed</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-white">Pit Stop Transit Loss</td>
                  <td className="py-2.5 px-4">{gp.pitLaneDeltaSeconds} seconds</td>
                  <td className="py-2.5 px-4 text-zinc-400">Strategic baseline for undercut and overcut windows</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-white">Official Lap Record</td>
                  <td className="py-2.5 px-4 text-racing-cyan font-bold">{gp.lapRecord.time}</td>
                  <td className="py-2.5 px-4 text-zinc-400">{gp.lapRecord.driver} ({gp.lapRecord.year})</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Pro Telemetry CTA Banner */}
        <section aria-label="Pro Telemetry Access" className="p-6 rounded-2xl bg-gradient-to-r from-carbon-900 via-carbon-900 to-red-950/40 border border-racing-red/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Unlock Dual-Driver Telemetry Overlay for {gp.name}</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Compare braking points, speed traces, throttle curves, and tyre wear lap-by-lap on this circuit.
            </p>
          </div>
          <Link href="/pricing" className="shrink-0">
            <Button variant="racing" size="sm" className="font-bold text-xs gap-1.5">
              <span>Access Pro Suite ($9.99/mo)</span>
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </Button>
          </Link>
        </section>
      </div>
    </>
  );
}
