"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProBadge } from "@/components/layout/pro-badge";
import {
  Activity,
  BarChart2,
  Disc3,
  Radio,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Gauge,
} from "lucide-react";

export default function ProDashboardHub() {
  const proModules = [
    {
      title: "Live Race Telemetry & Pit Wall Feed",
      description: "Real-time 10Hz streaming car telemetry across all 22 drivers and 11 teams. Speed, RPM, shift lights, throttle, brake, DRS, ERS, and 4-corner thermals.",
      href: "/pro/live",
      icon: Gauge,
      badge: "LIVE SENSOR STREAM",
      color: "text-racing-red",
    },
    {
      title: "Fastest Lap Telemetry Trace",
      description: "Dual-driver speed, throttle %, brake pressure, and gear comparison traces over single flying laps.",
      href: "/pro/telemetry",
      icon: Activity,
      badge: "REAL-TIME SYNC",
      color: "text-racing-red",
    },
    {
      title: "Lap-by-Lap Pace Distribution",
      description: "Stint pace consistency, degradation delta, and lap time distribution violin plots across all cars.",
      href: "/pro/laps",
      icon: BarChart2,
      badge: "STINT ANALYSIS",
      color: "text-racing-cyan",
    },
    {
      title: "Tyre Stints & Degradation Simulator",
      description: "Compound lifecycle modeling (Soft, Medium, Hard, Wet), degradation cliff curves, and pit windows.",
      href: "/pro/strategy",
      icon: Disc3,
      badge: "TYRE LIFECYCLE",
      color: "text-amber-400",
    },
    {
      title: "Interactive Session Replay Tower",
      description: "Step through historical or current Grand Prix sessions lap-by-lap with simulated near-live timing feed.",
      href: "/pro/replay",
      icon: Radio,
      badge: "PLAYBACK ENGINE",
      color: "text-purple-400",
    },
    {
      title: "AI Grand Prix Outcome Predictor",
      description: "Browser-side predictive heuristics calculating win percentages and Top-3 podium finish probabilities.",
      href: "/pro/predictor",
      icon: Sparkles,
      badge: "ESTIMATES ONLY",
      color: "text-emerald-400",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="racing" className="text-xs">PRO SUITE ACTIVE</Badge>
          <ProBadge />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
          Pro Engineering Hub
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
          Welcome to the telemetry paddock. Select an analytical suite below to inspect car data, tyre strategies, and race prediction heuristics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proModules.map((mod) => {
          const Icon = mod.icon;
          return (
            <Card key={mod.href} className="border-zinc-800 bg-carbon-900/90 hover:border-zinc-700 transition-all hover:translate-y-[-2px] flex flex-col justify-between group shadow-xl">
              <CardHeader className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className={`w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center ${mod.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {mod.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold text-white group-hover:text-racing-red transition-colors">
                  {mod.title}
                </CardTitle>
                <CardDescription className="text-xs text-zinc-400 leading-relaxed">
                  {mod.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link href={mod.href} className="w-full">
                  <Button variant="outline" size="sm" className="w-full text-xs font-mono justify-between">
                    <span>Launch Analysis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

