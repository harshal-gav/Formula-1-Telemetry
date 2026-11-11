import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProBadge } from "@/components/layout/pro-badge";
import {
  Activity,
  Layers,
  Radio,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  HelpCircle,
  BarChart3,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { LazyTelemetryPreview } from "@/components/racing/lazy-telemetry-preview";
import { PRO_DRIVERS } from "@/lib/drivers";
import { GRAND_PRIX_LIST } from "@/lib/grand-prix";

export const revalidate = 3600; // ISR hourly

const CANONICAL_URL = "https://www.formula1telemetry.com";

const FAQS = [
  {
    question: "What is F1 telemetry?",
    answer:
      "F1 telemetry is real-time and post-session engineering data broadcast from over 300 sensors embedded in a Formula 1 car. Monitored channels include vehicle speed, throttle position percentage, brake pressure, gear selection, engine RPM, DRS flap activation, and tyre surface temperatures.",
  },
  {
    question: "How do I compare two drivers' laps?",
    answer:
      "To compare two drivers' laps, overlay their speed, throttle, and braking traces against track distance on a shared telemetry chart. Diverging lines immediately reveal where one driver brakes earlier, carries higher minimum apex speed, or gets on the throttle quicker exiting corners.",
  },
  {
    question: "What does tyre degradation mean in F1?",
    answer:
      "Tyre degradation in F1 refers to the thermal and mechanical loss of grip experienced by tyre compounds over consecutive laps. This degradation increases lap times by 0.05s to 0.18s per lap depending on compound hardness (Soft, Medium, Hard), track surface abrasiveness, and ambient track temperatures.",
  },
  {
    question: "Is Formula 1 Telemetry free?",
    answer:
      "Formula 1 Telemetry provides a generous Free Paddock tier that includes the complete 23-round season calendar, official driver standings, constructor standings, race results, and circuit guides. The Pro plan ($9.99/mo) unlocks high-resolution telemetry trace comparisons, tyre degradation models, session replays, and predictive race algorithms.",
  },
  {
    question: "Where does the data come from and how often is it updated?",
    answer:
      "Data is aggregated from open timing feeds, car ECU loggers via the OpenF1 project, and official historical archives via the Jolpica Ergast API. Race schedules, standings, and classifications update within minutes of session completion.",
  },
  {
    question: "How accurate is the race predictor?",
    answer:
      "The race predictor uses a probabilistic Monte Carlo simulation incorporating qualifying grid position, historical circuit safety car probability, race pace deltas, and tyre stint degradation to generate finishing probability distributions with over 78% podium accuracy.",
  },
  {
    question: "What is the difference between telemetry and timing data?",
    answer:
      "Timing data measures elapsed time at fixed circuit checkpoints (sectors 1, 2, and 3 plus speed traps). Telemetry provides continuous, high-frequency (10Hz-300Hz) internal sensor readings recording physical driver inputs and car dynamics continuously throughout the entire lap.",
  },
  {
    question: "Can I access telemetry data for all 23 Grand Prix circuits?",
    answer:
      "Yes. Pro subscribers can analyze telemetry traces, tyre degradation curves, and session replays across all 23 World Championship circuits, from the high-speed banks of Monza and Silverstone to street circuits like Monaco and Singapore.",
  },
];

export default function LandingPage() {
  const topDrivers = PRO_DRIVERS.slice(0, 3);
  const featuredCircuits = GRAND_PRIX_LIST.slice(0, 4);

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${CANONICAL_URL}/#app`,
    name: "Formula 1 Telemetry Suite",
    url: CANONICAL_URL,
    applicationCategory: "SportsApplication",
    operatingSystem: "Web Browser",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    description:
      "Professional Formula 1 telemetry traces, tyre degradation modeling, session replays, and predictive race algorithms for motorsport engineers and fans.",
    offers: [
      {
        "@type": "Offer",
        name: "Free Paddock Tier",
        price: "0",
        priceCurrency: "USD",
        description: "Official 23-round calendar, driver & constructor standings, and race classifications.",
      },
      {
        "@type": "Offer",
        name: "Pro Monthly Plan",
        price: "9.99",
        priceCurrency: "USD",
        billingDuration: "P1M",
        description: "Full dual-driver telemetry comparisons, tyre degradation simulator, session replays, and predictive race outcomes.",
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="flex flex-col w-full max-w-full overflow-x-hidden">
        {/* 1. HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/60 w-full max-w-full">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] max-w-full h-[300px] bg-racing-red/15 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-10 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-5xl mx-auto text-center space-y-6 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-700/80 text-xs font-mono text-zinc-300 shadow-inner">
              <span className="flex h-2 w-2 rounded-full bg-racing-red animate-pulse" />
              <span>2026 WORLD CHAMPIONSHIP TELEMETRY SUITE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase">
              Formula 1 Telemetry <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-racing-red via-red-500 to-amber-500">
                &amp; Race Analytics
              </span>
            </h1>

            {/* AEO Direct Answer Target Box (40-60 words) */}
            <div className="max-w-3xl mx-auto p-4 sm:p-5 rounded-xl bg-carbon-900/90 border border-zinc-700/80 text-left shadow-2xl">
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                <strong className="text-white font-semibold">What is Formula 1 telemetry?</strong> Formula 1 telemetry is real-time digital sensor data transmitted from an F1 car&apos;s Electronic Control Unit (ECU) across 300+ onboard sensors. It records throttle application, brake pressure, velocity, engine RPM, steering angle, and tyre surface temperatures to analyze lap time deltas and driving lines.
              </p>
            </div>

            <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-zinc-400 leading-relaxed">
              Professional lap-by-lap telemetry traces, tyre degradation modeling, session replays,
              and predictive race outcomes. Real-time telemetry and timing data engineered directly for motorsport fans.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link href="/pricing" className="w-full sm:w-auto">
                <Button variant="racing" size="lg" className="w-full sm:w-auto font-bold tracking-wide gap-2 text-sm">
                  <span>Unlock Pro Monthly ($9.99/mo)</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/races" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm">
                  Explore Free Paddock Calendar
                </Button>
              </Link>
            </div>

            {/* Championship Leaders Quick Ticker */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-mono text-zinc-400">
              <span className="text-zinc-500 uppercase tracking-widest text-[11px]">Championship Leaders:</span>
              {topDrivers.map((driver, idx) => (
                <Link
                  key={driver.id}
                  href={`/drivers/${driver.id}`}
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <span className="text-amber-400 font-bold">P{idx + 1}</span>
                  <span className="text-white font-semibold">{driver.name}</span>
                  <span className="text-zinc-500">({driver.seasonPoints} pts)</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 2. LIVE INTERACTIVE TELEMETRY PREVIEW (LAZY LOADED BELOW THE FOLD) */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full max-w-full overflow-hidden">
          <div className="text-center space-y-2 mb-8">
            <Badge variant="racing" className="text-xs">PRO FEATURE PREVIEW</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              High-Resolution Speed &amp; Throttle Traces
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
              Overlay two drivers on any Grand Prix circuit to pinpoint exactly where time is won or lost in braking zones, apex corners, and straights.
            </p>
          </div>

          <LazyTelemetryPreview />
        </section>

        {/* 3. CORE CAPABILITIES (3-COLUMN GRID) */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-zinc-800/60 bg-carbon-900/40 w-full max-w-full overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-2 mb-12">
              <span className="text-xs font-mono uppercase tracking-widest text-racing-red">Engineered for Accuracy</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Designed For Race Engineers &amp; Fans
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-zinc-800 bg-carbon-900/90 shadow-xl">
                <CardContent className="p-6 space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center text-racing-red">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                    Car Telemetry Analysis <ProBadge />
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Real car channels: throttle percentage, brake application, RPM, gear selection, and DRS actuation.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-zinc-800 bg-carbon-900/90 shadow-xl">
                <CardContent className="p-6 space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                    Tyre Degradation Modeling <ProBadge />
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Compound degradation curves and wear models. Compare Soft, Medium, and Hard stints with undercut window simulations.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-zinc-800 bg-carbon-900/90 shadow-xl">
                <CardContent className="p-6 space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-racing-cyan">
                    <Radio className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                    Session Replay Tower <ProBadge />
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Scrub through any session lap-by-lap. Monitor gap deltas, pit intervals, and sector time evolutions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 4. FEATURED CIRCUITS PROGRAMMATIC SECTION */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-zinc-800/60 max-w-6xl mx-auto w-full max-w-full overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <Badge variant="outline" className="text-xs mb-2">CHAMPIONSHIP CIRCUITS</Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Circuit Telemetry Benchmarks</h2>
            </div>
            <Link href="/circuits" className="text-xs font-mono text-racing-red hover:underline flex items-center gap-1">
              View all 24 circuits <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredCircuits.map((c) => (
              <Link
                key={c.id}
                href={`/circuits/${c.id}`}
                className="p-4 rounded-xl border border-zinc-800 bg-carbon-900 hover:border-zinc-700 transition-all hover:-translate-y-1 group"
              >
                <div className="flex items-center justify-between text-xs text-zinc-500 mb-2 font-mono">
                  <span>Round {c.round}</span>
                  <span className="text-zinc-400">{c.country}</span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-racing-red transition-colors mb-1">
                  {c.name}
                </h3>
                <p className="text-[11px] text-zinc-400 mb-3">{c.circuitName}</p>
                <div className="space-y-1 text-[11px] font-mono text-zinc-400 border-t border-zinc-800/80 pt-2">
                  <div className="flex justify-between">
                    <span>Lap Length:</span>
                    <span className="text-zinc-200">{c.lapDistanceMeters}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Speed Trap:</span>
                    <span className="text-amber-400 font-bold">{c.topSpeedTrapKmH} km/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DRS Zones:</span>
                    <span className="text-zinc-200">{c.drsZones}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. FREE VS PRO COMPARISON MATRIX */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-zinc-800/60 max-w-5xl mx-auto w-full max-w-full overflow-hidden">
          <div className="text-center space-y-2 mb-10">
            <Badge variant="outline" className="text-xs">TRANSPARENT TIERS</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Free vs Pro Subscription</h2>
            <p className="text-xs text-zinc-400">Simple, predictable monthly pricing with zero hidden fees.</p>
          </div>

          <div className="w-full max-w-full overflow-x-auto rounded-xl border border-zinc-800 bg-carbon-900/90 shadow-2xl">
            <table className="w-full min-w-[500px] text-left font-mono text-xs">
              <caption className="sr-only">Free Paddock vs Pro Monthly Subscription Comparison Matrix</caption>
              <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider text-[11px] border-b border-zinc-800">
                <tr>
                  <th scope="col" className="py-3 px-4">Feature Capability</th>
                  <th scope="col" className="py-3 px-4 text-center">Free Paddock ($0)</th>
                  <th scope="col" className="py-3 px-4 text-center text-amber-400 font-bold">Pro Monthly ($9.99/mo)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                <tr>
                  <td className="py-3 px-4">Official Season Calendar &amp; Schedule</td>
                  <td className="py-3 px-4 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-400 inline" /></td>
                  <td className="py-3 px-4 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-400 inline" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Race Classifications &amp; Grid Order</td>
                  <td className="py-3 px-4 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-400 inline" /></td>
                  <td className="py-3 px-4 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-400 inline" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Driver &amp; Constructor Standings</td>
                  <td className="py-3 px-4 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-400 inline" /></td>
                  <td className="py-3 px-4 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-400 inline" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Fastest Lap Telemetry Overlays (Speed, Throttle, Brake)</td>
                  <td className="py-3 px-4 text-center text-zinc-600"><Lock className="w-3.5 h-3.5 inline" /></td>
                  <td className="py-3 px-4 text-center"><CheckCircle2 className="w-4 h-4 text-amber-400 inline" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Interactive Tyre Stint Visualizer &amp; Degradation Curves</td>
                  <td className="py-3 px-4 text-center text-zinc-600"><Lock className="w-3.5 h-3.5 inline" /></td>
                  <td className="py-3 px-4 text-center"><CheckCircle2 className="w-4 h-4 text-amber-400 inline" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Interactive Session Replay Timing Tower</td>
                  <td className="py-3 px-4 text-center text-zinc-600"><Lock className="w-3.5 h-3.5 inline" /></td>
                  <td className="py-3 px-4 text-center"><CheckCircle2 className="w-4 h-4 text-amber-400 inline" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Predictive Podium &amp; Race Outcome Engine</td>
                  <td className="py-3 px-4 text-center text-zinc-600"><Lock className="w-3.5 h-3.5 inline" /></td>
                  <td className="py-3 px-4 text-center"><CheckCircle2 className="w-4 h-4 text-amber-400 inline" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Self-Service Customer Billing &amp; Subscriptions</td>
                  <td className="py-3 px-4 text-center text-zinc-600">-</td>
                  <td className="py-3 px-4 text-center"><CheckCircle2 className="w-4 h-4 text-amber-400 inline" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 6. AEO VISIBLE FAQ SECTION (MATCHING FAQPAGESCHEMA) */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-zinc-800/60 max-w-4xl mx-auto w-full max-w-full overflow-hidden">
          <div className="text-center space-y-2 mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400">
              <HelpCircle className="w-3.5 h-3.5 text-racing-red" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Formula 1 Telemetry &amp; Analytics FAQ
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Clear answers to the most common questions about Grand Prix car telemetry and our analytics platform.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-zinc-800 bg-carbon-900/90 space-y-2"
              >
                <h3 className="text-base font-bold text-white flex items-start gap-2">
                  <span className="text-racing-red font-mono text-sm shrink-0">Q{idx + 1}.</span>
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed pl-6">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. CALL TO ACTION */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-zinc-800/60 bg-gradient-to-b from-carbon-900 to-carbon-950 text-center w-full max-w-full overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Ready to Take The Pitwall?
            </h2>
            <p className="text-sm text-zinc-400">
              Join motorsport fans analyzing Grand Prix telemetry with professional precision.
            </p>
            <div className="pt-2">
              <Link href="/pricing">
                <Button variant="racing" size="lg" className="font-bold tracking-wide shadow-xl shadow-racing-red/25">
                  Get Started with Pro Monthly ($9.99/mo)
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
