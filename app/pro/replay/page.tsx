"use client";

import { ReplayTower } from "@/components/pro/replay-tower";
import { Badge } from "@/components/ui/badge";
import { ProBadge } from "@/components/layout/pro-badge";
import { Radio, ShieldAlert } from "lucide-react";

export default function ReplayProPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Badge variant="racing" className="text-xs">TIMING & TELEMETRY TOWER</Badge>
          <ProBadge />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase flex items-center gap-2.5">
          <Radio className="w-6 h-6 text-purple-400" />
          Interactive Grand Prix Session Replay
        </h1>
        <p className="text-xs text-zinc-400">
          Scrub through race laps with animated intervals, sector times, tyre compound trackers, and fastest lap highlights.
        </p>
      </div>

      <ReplayTower />

      <div className="p-4 rounded-xl bg-carbon-900 border border-zinc-800 flex items-start gap-3 text-xs text-zinc-400 font-mono">
        <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-zinc-200 block">Optimized Playback Engine</span>
          <p className="leading-relaxed text-[11px]">
            Session timing feeds are cached client-side in localStorage and synchronized via a deterministic playback clock for smooth, zero-latency scrub performance.
          </p>
        </div>
      </div>
    </div>
  );
}

