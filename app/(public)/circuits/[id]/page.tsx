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
  Timer,
  Zap,
  Layers,
  Flag,
  Shield,
  HelpCircle,
} from "lucide-react";
import { GRAND_PRIX_LIST, GrandPrixCircuit } from "@/lib/grand-prix";

export const revalidate = 86400; // Static revalidation daily

export function generateStaticParams() {
  return GRAND_PRIX_LIST.map((c) => ({ id: c.id }));
}

const CANONICAL_BASE = "https://www.formula1telemetry.com/circuits";

function findCircuit(idParam: string): GrandPrixCircuit | undefined {
  const norm = decodeURIComponent(idParam).toLowerCase().trim();
  return GRAND_PRIX_LIST.find(
    (c) =>
      c.id.toLowerCase() === norm ||
      c.round.toString() === norm ||
      c.circuitName.toLowerCase().replace(/[^a-z0-9]+/g, "-") === norm ||
      c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === norm
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const c = findCircuit(id);

  if (!c) {
    return {
      title: "Circuit Telemetry Profile | Formula 1 Telemetry",
      description: "Formula 1 circuit telemetry profiles, speed traps, and lap records.",
    };
  }

  const title = `${c.circuitName} F1 Telemetry & Specs`;
  const description = `Circuit telemetry specs for ${c.circuitName} in ${c.country}. Lap distance of ${c.lapDistanceMeters}m, ${c.turns} turns, ${c.topSpeedTrapKmH} km/h speed trap, and lap record.`;

  return {
    title,
    description: description.slice(0, 160),
    alternates: {
      canonical: `${CANONICAL_BASE}/${c.id}`,
    },
    openGraph: {
      title,
      description,
      url: `${CANONICAL_BASE}/${c.id}`,
      type: "website",
    },
  };
}

export default async function CircuitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = findCircuit(id);

  if (!c) {
    notFound();
  }

  const canonicalUrl = `${CANONICAL_BASE}/${c.id}`;

  const placeSchema = {
    "@context": "https://schema.org",
    "@type": "Place",
    "@id": `${canonicalUrl}/#place`,
    name: c.circuitName,
    description: c.description,
    address: {
      "@type": "PostalAddress",
      addressCountry: c.country,
    },
    publicAccess: true,
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
        name: "Circuits",
        item: "https://www.formula1telemetry.com/circuits",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: c.circuitName,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 w-full max-w-full overflow-hidden">
        {/* Navigation & Breadcrumbs */}
        <div className="flex items-center justify-between">
          <Link
            href="/circuits"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to 24 Circuits Directory</span>
          </Link>
          <nav aria-label="Breadcrumb" className="text-xs font-mono text-zinc-500 hidden sm:flex items-center gap-2">
            <Link href="/" className="hover:text-zinc-300">Home</Link>
            <span>/</span>
            <Link href="/circuits" className="hover:text-zinc-300">Circuits</Link>
            <span>/</span>
            <span className="text-zinc-200">{c.circuitName}</span>
          </nav>
        </div>

        {/* Hero Header */}
        <header className="p-6 sm:p-8 rounded-2xl bg-carbon-900 border border-zinc-800 shadow-2xl relative overflow-hidden space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="racing" className="text-xs font-mono">ROUND {c.round} VENUE</Badge>
            <Badge variant="outline" className="text-xs font-mono">{c.country}</Badge>
            <span className="text-xs font-mono text-zinc-400">{c.name}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            {c.circuitName}
          </h1>

          {/* AEO Direct Answer Target Box (40-60 words) */}
          <div className="p-4 rounded-xl bg-carbon-950/80 border border-zinc-800 text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-3xl">
            <p>
              <strong className="text-white font-semibold">What are the technical specs of {c.circuitName}?</strong> Located in {c.country}, {c.circuitName} spans {c.lapDistanceMeters.toLocaleString()} meters with {c.turns} turns and {c.drsZones} DRS zones. The track features a terminal speed trap of {c.topSpeedTrapKmH} km/h, {c.heavyBrakingZones} heavy braking zones, and a lap record of {c.lapRecord.time} held by {c.lapRecord.driver}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-zinc-400 pt-2 border-t border-zinc-800/80">
            <div className="flex items-center gap-1.5">
              <Timer className="w-4 h-4 text-amber-400" />
              <span>Official Lap Record: {c.lapRecord.time} ({c.lapRecord.driver}, {c.lapRecord.year})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-racing-cyan" />
              <span>Full Throttle: {c.fullThrottlePercent}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-racing-red" />
              <span>Top Speed Trap: {c.topSpeedTrapKmH} km/h</span>
            </div>
          </div>
        </header>

        {/* Circuit Metric KPI Cards */}
        <section aria-label="Circuit Telemetry Parameters" className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="border-zinc-800 bg-carbon-900/90">
            <CardContent className="p-4 space-y-1 font-mono">
              <span className="text-[10px] text-zinc-500 uppercase block">Track Lap Length</span>
              <span className="text-2xl font-black text-white">{c.lapDistanceMeters.toLocaleString()}m</span>
              <span className="text-xs text-zinc-400 block">{c.totalLaps} race laps</span>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-carbon-900/90">
            <CardContent className="p-4 space-y-1 font-mono">
              <span className="text-[10px] text-zinc-500 uppercase block">Corners &amp; Layout</span>
              <span className="text-2xl font-black text-racing-red">{c.turns} Turns</span>
              <span className="text-xs text-zinc-400 block">{c.drsZones} DRS Activation Zones</span>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-carbon-900/90">
            <CardContent className="p-4 space-y-1 font-mono">
              <span className="text-[10px] text-zinc-500 uppercase block">Braking Severity</span>
              <span className="text-2xl font-black text-amber-400">{c.heavyBrakingZones}</span>
              <span className="text-xs text-zinc-400 block">zones &gt; 4.8G load</span>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-carbon-900/90">
            <CardContent className="p-4 space-y-1 font-mono">
              <span className="text-[10px] text-zinc-500 uppercase block">Pit Lane Loss Delta</span>
              <span className="text-2xl font-black text-racing-cyan">{c.pitLaneDeltaSeconds}s</span>
              <span className="text-xs text-zinc-400 block">transit + box delta</span>
            </CardContent>
          </Card>
        </section>

        {/* 200+ WORDS DATA-DERIVED PROSE ARTICLE */}
        <article className="p-6 sm:p-8 rounded-2xl bg-carbon-900/60 border border-zinc-800 space-y-6 text-zinc-300 leading-relaxed text-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-racing-red" />
            <span>Circuit Geometry &amp; Aerodynamic Setup Demands</span>
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-zinc-300">
            <p>
              <strong>{c.circuitName}</strong>, home of the <strong>{c.name}</strong> (Round {c.round} of the 2026 World Championship), presents one of motorsport&apos;s most demanding technical layouts. Covering <strong>{c.lapDistanceMeters.toLocaleString()} meters</strong> with <strong>{c.turns} distinct turns</strong>, cars subject their aerodynamic and mechanical packages to continuous high-g lateral transitions. Power units run at wide-open throttle for <strong>{c.fullThrottlePercent}% of every lap</strong>, placing a severe duty cycle on the turbocharger, hybrid MGU-H energy recovery, and MGU-K electric deploy channels.
            </p>
            <p>
              Aerodynamic configurations are governed by the balance between high-speed straightline velocity and medium-speed cornering stability. With terminal speed trap readings reaching <strong>{c.topSpeedTrapKmH} km/h</strong> through the primary speed traps, engineers dial in wing angles that optimize drag reduction through the {c.drsZones} DRS corridors without compromising downforce into {c.keyApexTurns}. The track demands {c.gearShiftsPerLap} manual paddle gear shifts per lap, testing gearbox synchromesh and hydraulic actuator reliability over {c.totalLaps} grueling grand prix laps.
            </p>
            <p>
              Tyre thermal degradation at {c.circuitName} is heavily influenced by asphalt micro-roughness, ambient surface temperatures ({c.weather.trackTemp}°C nominal), and high-energy longitudinal braking forces in the {c.heavyBrakingZones} heavy braking zones. Strategists must account for a <strong>pit lane loss delta of {c.pitLaneDeltaSeconds} seconds</strong>, which governs whether a one-stop or two-stop strategy yields the faster overall race duration. With an official lap record of <strong>{c.lapRecord.time} set by {c.lapRecord.driver} in {c.lapRecord.year}</strong>, this circuit remains a definitive proving ground for Formula 1 engineering excellence.
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Overtaking Rating: <strong>{c.overtakingDifficulty}</strong> ({c.drsZones} DRS zones)</span>
            </div>
            <Link href={`/races/${c.round}`}>
              <Button variant="racing" size="sm" className="text-xs font-mono gap-1.5">
                <span>View {c.name} Results &amp; Trace</span>
                <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </Button>
            </Link>
          </div>
        </article>

        {/* Technical Specification Table */}
        <section aria-label="Circuit Telemetry Specifications" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Official Circuit Specification Matrix</span>
            </h2>
            <span className="text-xs font-mono text-zinc-500">FIA HOMOLOGATED CIRCUIT</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-carbon-900 shadow-xl">
            <table className="w-full text-left font-mono text-xs">
              <caption className="sr-only">Detailed Technical Specifications for {c.circuitName}</caption>
              <thead className="bg-zinc-950 text-zinc-400 uppercase text-[11px] border-b border-zinc-800">
                <tr>
                  <th scope="col" className="py-2.5 px-4">Track Metric</th>
                  <th scope="col" className="py-2.5 px-4">Official Measurement</th>
                  <th scope="col" className="py-2.5 px-4">Engineering Relevance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-white">Circuit Name</td>
                  <td className="py-2.5 px-4 font-bold text-white">{c.circuitName}</td>
                  <td className="py-2.5 px-4 text-zinc-400">Hosted Grand Prix: {c.name}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-white">Track Lap Distance</td>
                  <td className="py-2.5 px-4 text-white font-bold">{c.lapDistanceMeters.toLocaleString()} meters</td>
                  <td className="py-2.5 px-4 text-zinc-400">{c.totalLaps} laps ({Math.round((c.lapDistanceMeters * c.totalLaps) / 1000)} km race distance)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-white">Corner Count</td>
                  <td className="py-2.5 px-4 text-white font-bold">{c.turns} Turns</td>
                  <td className="py-2.5 px-4 text-zinc-400">Critical apex zones at {c.keyApexTurns}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-white">Speed Trap Velocity</td>
                  <td className="py-2.5 px-4 text-amber-400 font-bold">{c.topSpeedTrapKmH} km/h</td>
                  <td className="py-2.5 px-4 text-zinc-400">Maximum terminal straight velocity before braking</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-white">Full Throttle Ratio</td>
                  <td className="py-2.5 px-4 text-racing-red font-bold">{c.fullThrottlePercent}%</td>
                  <td className="py-2.5 px-4 text-zinc-400">High ICE duty cycle; {c.gearShiftsPerLap} shifts per lap</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-white">DRS Corridors</td>
                  <td className="py-2.5 px-4 text-racing-cyan font-bold">{c.drsZones} DRS Zones</td>
                  <td className="py-2.5 px-4 text-zinc-400">Yields +14 to +18 km/h overtake delta</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-white">Pit Lane Loss Delta</td>
                  <td className="py-2.5 px-4 text-zinc-200">{c.pitLaneDeltaSeconds} seconds</td>
                  <td className="py-2.5 px-4 text-zinc-400">Standard stop duration loss for pit strategy modeling</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-white">Official Lap Record</td>
                  <td className="py-2.5 px-4 text-emerald-400 font-bold">{c.lapRecord.time}</td>
                  <td className="py-2.5 px-4 text-zinc-400">{c.lapRecord.driver} ({c.lapRecord.year})</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Cross-Link Card to Race and Telemetry */}
        <section aria-label="Related Grand Prix Telemetry" className="p-6 rounded-2xl bg-gradient-to-r from-carbon-900 via-carbon-900 to-red-950/40 border border-racing-red/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Analyze {c.name} Telemetry &amp; Speed Curves</span>
            </h3>
            <p className="text-xs text-zinc-400">
              View official session classifications, fastest lap telemetry benchmarks, and tyre degradation curves for this circuit.
            </p>
          </div>
          <Link href={`/races/${c.round}`} className="shrink-0">
            <Button variant="racing" size="sm" className="font-bold text-xs gap-1.5">
              <span>View Round {c.round} Race Page</span>
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </Button>
          </Link>
        </section>
      </div>
    </>
  );
}
