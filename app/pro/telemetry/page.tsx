"use client";

import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import { ProBadge } from "@/components/layout/pro-badge";
import { Activity, Info } from "lucide-react";

const TelemetryChartDynamic = dynamic(
  () => import("@/components/pro/telemetry-chart").then((m) => m.TelemetryChart),
  {
    loading: () => (
      <div className="w-full h-[520px] rounded-2xl border border-zinc-800 bg-carbon-900/60 p-6 flex flex-col justify-between animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-6 w-56 bg-zinc-800 rounded" />
          <div className="flex gap-2">
            <div className="h-7 w-20 bg-zinc-800 rounded" />
            <div className="h-7 w-20 bg-zinc-800 rounded" />
          </div>
        </div>
        <div className="h-80 w-full bg-zinc-950/40 rounded-lg flex items-center justify-center border border-zinc-800/40">
          <span className="text-xs font-mono text-zinc-500">Loading interactive telemetry trace...</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-zinc-800/80">
          <div className="h-14 bg-zinc-800/50 rounded" />
          <div className="h-14 bg-zinc-800/50 rounded" />
          <div className="h-14 bg-zinc-800/50 rounded" />
          <div className="h-14 bg-zinc-800/50 rounded" />
        </div>
      </div>
    ),
    ssr: false,
  }
);

export default function TelemetryProPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Badge variant="racing" className="text-xs">TELEMETRY SUITE</Badge>
          <ProBadge />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase flex items-center gap-2.5">
          <Activity className="w-6 h-6 text-racing-red" />
          Car Telemetry Comparison Trace
        </h1>
        <p className="text-xs text-zinc-400">
          Synchronized throttle, brake, speed, and gear trace comparison.
        </p>
      </div>

      <TelemetryChartDynamic />

      <div className="p-4 rounded-xl bg-carbon-900 border border-zinc-800 flex items-start gap-3 text-xs text-zinc-400 font-mono">
        <Info className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[11px]">
          Data channels are sampled at 3.7 Hz from car GPS and ECU loggers. Traces are normalized by lap distance (meters)
          to ensure accurate braking point alignment across different driver apex lines.
        </p>
      </div>
    </div>
  );
}
