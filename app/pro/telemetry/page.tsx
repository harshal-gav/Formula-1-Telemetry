"use client";

import { TelemetryChart } from "@/components/pro/telemetry-chart";
import { Badge } from "@/components/ui/badge";
import { ProBadge } from "@/components/layout/pro-badge";
import { Activity, Info } from "lucide-react";

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

      <TelemetryChart />

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

