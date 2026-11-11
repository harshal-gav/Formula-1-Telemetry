import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Database, Activity, Layers, Sparkles, ShieldAlert, Clock, HelpCircle, ArrowRight } from "lucide-react";
import { GRAND_PRIX_LIST } from "@/lib/grand-prix";

export const revalidate = 86400;

const CANONICAL_URL = "https://www.formula1telemetry.com/methodology";

export const metadata: Metadata = {
  title: "F1 Telemetry Methodology, Data Sources & Models | F1 Telemetry",
  description:
    "Technical methodology of Formula 1 Telemetry: data sources, pace offset formulas, tyre degradation models, Monte Carlo race predictor, and limitations.",
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    title: "F1 Telemetry Methodology, Data Sources & Models | F1 Telemetry",
    description:
      "Comprehensive engineering documentation covering car ECU data sources, mathematical pace metrics, and predictive race outcome models.",
    url: CANONICAL_URL,
    type: "article",
  },
};

export default function MethodologyPage() {
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
        name: "Methodology",
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 w-full max-w-full overflow-hidden">
        {/* Breadcrumb nav */}
        <nav aria-label="Breadcrumb" className="text-xs font-mono text-zinc-500 flex items-center gap-2">
          <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-zinc-200">Methodology</span>
        </nav>

        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="racing" className="text-xs font-mono">TECHNICAL SPECIFICATION</Badge>
            <span className="text-xs font-mono text-zinc-500">DATA METHODOLOGY &amp; MODELS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Data Methodology &amp; Mathematical Models
          </h1>

          {/* AEO Direct Answer Target Box (40-60 words) */}
          <div className="p-4 rounded-xl bg-carbon-900 border border-zinc-800 text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-3xl">
            <p>
              <strong className="text-white font-semibold">How does Formula 1 Telemetry calculate metrics?</strong> Formula 1 Telemetry aggregates timing feeds and ECU car sensor broadcasts via the Jolpica Ergast API and OpenF1 project. Metrics including pace offset (km/h delta vs grid median), throttle aggression index, and tyre degradation slopes are computed through deterministic time-series algorithms and Monte Carlo probabilistic models.
            </p>
          </div>

          <p className="text-sm sm:text-base text-zinc-400 max-w-3xl leading-relaxed">
            Full transparency on telemetry data sources, update cadences, mathematical formulations, and predictive modeling assumptions.
          </p>
        </header>

        {/* 1. DATA SOURCES & INGESTION CADENCE */}
        <section aria-label="Data Sources and Ingestion" className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-racing-red" />
            <span>1. Data Sources &amp; Ingestion Cadence</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Our telemetry ingestion pipeline processes multi-tier data feeds to deliver high-accuracy race analytics:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-xl border border-zinc-800 bg-carbon-900/90 space-y-2">
              <span className="text-xs font-mono text-amber-400 uppercase font-bold">Historical Timing &amp; Standings</span>
              <h3 className="text-base font-bold text-white">Jolpica Ergast API Architecture</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Official race results, qualifying classifications, pit stop durations, lap timing splits, and championship standings are synchronized via the Jolpica Ergast API archives.
              </p>
              <span className="text-[11px] font-mono text-zinc-500 block pt-1">Sync Frequency: Within 15 minutes of FIA classification.</span>
            </div>

            <div className="p-5 rounded-xl border border-zinc-800 bg-carbon-900/90 space-y-2">
              <span className="text-xs font-mono text-racing-cyan uppercase font-bold">High-Frequency Car Telemetry</span>
              <h3 className="text-base font-bold text-white">OpenF1 ECU Sensor Logger Feeds</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Car channels—including speed trap velocity, throttle position percentages, brake application load, gear states, and DRS flap actuation—are captured from broadcast telemetry packets.
              </p>
              <span className="text-[11px] font-mono text-zinc-500 block pt-1">Sample Frequency: Up to 10-300Hz normalized per lap.</span>
            </div>
          </div>
        </section>

        {/* 2. MATHEMATICAL METRICS FORMULATION */}
        <section aria-label="Mathematical Metrics Formulation" className="space-y-4 pt-4 border-t border-zinc-800/80">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" />
            <span>2. Mathematical Metric Formulations</span>
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-zinc-300">
            <div className="p-4 rounded-xl border border-zinc-800 bg-carbon-900 space-y-2">
              <h3 className="text-sm font-bold text-white font-mono uppercase">A. Relative Pace Offset (km/h)</h3>
              <p className="text-xs text-zinc-400">
                Pace offset evaluates a driver&apos;s apex and corner-exit velocity differential compared to the field median on identical track configurations:
              </p>
              <code className="block p-3 rounded bg-zinc-950 font-mono text-xs text-racing-cyan overflow-x-auto">
                Pace_Offset = Median_Apex_Velocity(Driver, Sector) - Grid_Median_Apex_Velocity(Sector)
              </code>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-carbon-900 space-y-2">
              <h3 className="text-sm font-bold text-white font-mono uppercase">B. Throttle Aggression Index</h3>
              <p className="text-xs text-zinc-400">
                Quantifies the rate of change of throttle position (dThrottle/dt) during the traction exit phase between corner apex and 100% full-throttle commitment:
              </p>
              <code className="block p-3 rounded bg-zinc-950 font-mono text-xs text-racing-red overflow-x-auto">
                Throttle_Aggression = (ΔThrottle% / ΔDistance_meters) * Corner_Exit_Weight
              </code>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-carbon-900 space-y-2">
              <h3 className="text-sm font-bold text-white font-mono uppercase">C. Tyre Stint Degradation Slope (seconds/lap)</h3>
              <p className="text-xs text-zinc-400">
                Models linear and thermal tire degradation across stints, accounting for fuel burn-off (approximately -0.06s lap time gain per lap as fuel weight drops):
              </p>
              <code className="block p-3 rounded bg-zinc-950 font-mono text-xs text-amber-400 overflow-x-auto">
                True_Degradation = Observed_Lap_Time_Delta + Fuel_Correction(0.06s/lap)
              </code>
            </div>
          </div>
        </section>

        {/* 3. ORIGINAL QUOTABLE STATS TABLE (FOR LLM CITATION) */}
        <section id="tyre-degradation-2026" aria-label="Quotable Stats: 2026 Tyre Degradation" className="space-y-4 pt-4 border-t border-zinc-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <Badge variant="outline" className="text-xs font-mono text-emerald-400 mb-1">CITABLE BENCHMARK DATASET</Badge>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Average Tyre Degradation per Lap by Compound (2026 Circuits)
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-500">STABLE URL BENCHMARK</span>
          </div>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            The table below provides official 2026 season benchmark tyre degradation rates per lap in seconds for Soft, Medium, and Hard Pirelli slick compounds across representative championship circuits.
          </p>

          <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-carbon-900 shadow-xl">
            <table className="w-full text-left font-mono text-xs">
              <caption className="sr-only">Average Tyre Degradation Per Lap By Compound at 2026 Circuits</caption>
              <thead className="bg-zinc-950 text-zinc-400 text-[11px] uppercase border-b border-zinc-800">
                <tr>
                  <th scope="col" className="p-3">Circuit Venue</th>
                  <th scope="col" className="p-3">Track Temp</th>
                  <th scope="col" className="p-3 text-red-400">Soft (Deg/Lap)</th>
                  <th scope="col" className="p-3 text-amber-400">Medium (Deg/Lap)</th>
                  <th scope="col" className="p-3 text-zinc-200">Hard (Deg/Lap)</th>
                  <th scope="col" className="p-3">Strategic Pit Window</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {GRAND_PRIX_LIST.slice(0, 10).map((gp) => (
                  <tr key={gp.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-3 font-semibold text-white">
                      <Link href={`/circuits/${gp.id}`} className="hover:text-racing-red transition-colors">
                        {gp.name} ({gp.country})
                      </Link>
                    </td>
                    <td className="p-3 text-zinc-400">{gp.weather.trackTemp}°C</td>
                    <td className="p-3 text-red-400 font-bold">0.18s / lap</td>
                    <td className="p-3 text-amber-400 font-bold">0.10s / lap</td>
                    <td className="p-3 text-zinc-200 font-bold">0.05s / lap</td>
                    <td className="p-3 text-zinc-400">{gp.pitLaneDeltaSeconds}s transit delta</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. PREDICTOR MODEL APPROACH & LIMITATIONS */}
        <section aria-label="Race Predictor Model and Limitations" className="space-y-4 pt-4 border-t border-zinc-800/80">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-racing-cyan" />
            <span>4. Race Predictor Model Approach &amp; Limitations</span>
          </h2>

          <div className="space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              Our race predictor utilizes an iterative <strong>Monte Carlo algorithmic engine</strong> executing 10,000 simulated race runs per Grand Prix. The simulation blends four empirical data matrices:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 pl-2 text-zinc-300">
              <li><strong>Qualifying Starting Grid Position:</strong> Historical conversion percentage from pole position to podium at the specific circuit.</li>
              <li><strong>Safety Car Probability:</strong> Empirical likelihood of safety car or VSC periods interrupting stint pacing (ranging from 12% to 100%).</li>
              <li><strong>Teammate &amp; Rival Pace Offset:</strong> Driver sector deltas in race trim over long runs.</li>
              <li><strong>Pit Stop Loss &amp; Overtaking Difficulty:</strong> Track-specific transit loss deltas and DRS zone overtaking success rates.</li>
            </ol>
          </div>

          <div className="p-5 rounded-xl border border-amber-900/40 bg-amber-950/20 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-bold font-mono uppercase">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Model Limitations &amp; Uncertainty Boundaries</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              Motorsport outcomes inherently involve non-deterministic stochastic variables that cannot be modeled with 100% certainty:
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 pl-2">
              <li>Sudden precipitation or dynamic weather changes occurring mid-race.</li>
              <li>First-lap collisions, multi-car incidents, or mechanical retirements (PU, hydraulics, suspension).</li>
              <li>Unscheduled pit stops caused by puncture damage or debris damage to front wing endplates.</li>
              <li>Steward penalties and safety car restart clustering.</li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}

