"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProBadge } from "@/components/layout/pro-badge";
import {
  Activity,
  Zap,
  TrendingUp,
  Cpu,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  Radio,
  BarChart3,
} from "lucide-react";
import { TelemetryChart } from "@/components/pro/telemetry-chart";
import { useDriverStandings } from "@/hooks/use-jolpica";

export default function LandingPage() {
  const { data: standings } = useDriverStandings("current");
  const topDrivers = standings?.slice(0, 3) || [];

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/60">
        {/* Glow ambient background lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-racing-red/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-700/80 text-xs font-mono text-zinc-300 shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-racing-red animate-pulse" />
            <span>2026 WORLD CHAMPIONSHIP TELEMETRY SUITE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase">
            The Pitwall In <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-racing-red via-red-500 to-amber-500">
              Your Browser
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-zinc-400 leading-relaxed">
            Professional lap-by-lap telemetry traces, tyre degradation modeling, session replays,
            and predictive race outcomes. 100% client-side data streamed directly from Jolpica & OpenF1.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/pricing">
              <Button variant="racing" size="lg" className="w-full sm:w-auto font-bold tracking-wide gap-2 text-sm">
                <span>Unlock Pro Monthly ($9.99/mo)</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm">
                Explore Free Paddock
              </Button>
            </Link>
          </div>

          {/* Quick Stats Ticker */}
          {topDrivers.length > 0 && (
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-zinc-400">
              <span className="text-zinc-500 uppercase tracking-widest text-[11px]">Championship Leaders:</span>
              {topDrivers.map((item, idx) => (
                <div key={item.Driver.driverId} className="flex items-center gap-1.5">
                  <span className="text-amber-400 font-bold">P{idx + 1}</span>
                  <span className="text-white font-semibold">
                    {item.Driver.givenName[0]}. {item.Driver.familyName}
                  </span>
                  <span className="text-zinc-500">({item.points} pts)</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 2. LIVE INTERACTIVE TELEMETRY PREVIEW */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center space-y-2 mb-8">
          <Badge variant="racing" className="text-xs">PRO FEATURE PREVIEW</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            High-Resolution Speed & Throttle Traces
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Overlay two drivers on any circuit to pinpoint exactly where time is won or lost in braking zones, apex corners, and DRS straights.
          </p>
        </div>

        <TelemetryChart />
      </section>

      {/* 3. CORE CAPABILITIES (3-COLUMN GRID) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-zinc-800/60 bg-carbon-900/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-racing-red">Engineered for Accuracy</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Designed For Race Engineers & Fans
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
                  Real car channels: throttle percentage, brake application, RPM, gear selection, and DRS actuation delivered via OpenF1.
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
                  Fast-F1 inspired compound degradation curves. Compare Soft, Medium, and Hard stints with undercut window simulations.
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
                  Scrub through any historical or current session lap-by-lap. Monitor gap deltas, pit intervals, and sector time evolutions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. FREE VS PRO COMPARISON MATRIX */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-zinc-800/60 max-w-5xl mx-auto w-full">
        <div className="text-center space-y-2 mb-10">
          <Badge variant="outline" className="text-xs">TRANSPARENT TIERS</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Free vs Pro Subscription</h2>
          <p className="text-xs text-zinc-400">Simple, predictable monthly pricing powered by Dodo Payments.</p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-carbon-900/90 shadow-2xl">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider text-[11px] border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Feature Capability</th>
                <th className="py-3 px-4 text-center">Free Paddock</th>
                <th className="py-3 px-4 text-center text-amber-400 font-bold">Pro Monthly ($9.99/mo)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              <tr>
                <td className="py-3 px-4">Official Season Calendar & Schedule</td>
                <td className="py-3 px-4 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-400 inline" /></td>
                <td className="py-3 px-4 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-400 inline" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4">Race Classifications & Grid Order</td>
                <td className="py-3 px-4 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-400 inline" /></td>
                <td className="py-3 px-4 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-400 inline" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4">Driver & Constructor Standings</td>
                <td className="py-3 px-4 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-400 inline" /></td>
                <td className="py-3 px-4 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-400 inline" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4">Fastest Lap Telemetry Overlays (Speed, Throttle, Brake)</td>
                <td className="py-3 px-4 text-center text-zinc-600"><Lock className="w-3.5 h-3.5 inline" /></td>
                <td className="py-3 px-4 text-center"><CheckCircle2 className="w-4 h-4 text-amber-400 inline" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4">Interactive Tyre Stint Visualizer & Degradation Curves</td>
                <td className="py-3 px-4 text-center text-zinc-600"><Lock className="w-3.5 h-3.5 inline" /></td>
                <td className="py-3 px-4 text-center"><CheckCircle2 className="w-4 h-4 text-amber-400 inline" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4">Interactive Session Replay Timing Tower</td>
                <td className="py-3 px-4 text-center text-zinc-600"><Lock className="w-3.5 h-3.5 inline" /></td>
                <td className="py-3 px-4 text-center"><CheckCircle2 className="w-4 h-4 text-amber-400 inline" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4">Predictive Podium & Race Outcome Engine</td>
                <td className="py-3 px-4 text-center text-zinc-600"><Lock className="w-3.5 h-3.5 inline" /></td>
                <td className="py-3 px-4 text-center"><CheckCircle2 className="w-4 h-4 text-amber-400 inline" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4">Dodo Self-Service Customer Billing Portal</td>
                <td className="py-3 px-4 text-center text-zinc-600">-</td>
                <td className="py-3 px-4 text-center"><CheckCircle2 className="w-4 h-4 text-amber-400 inline" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-zinc-800/60 bg-gradient-to-b from-carbon-900 to-carbon-950 text-center">
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
  );
}

