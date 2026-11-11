"use client";

import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import { ProBadge } from "@/components/layout/pro-badge";
import { Radio, ShieldAlert } from "lucide-react";

const ReplayTowerDynamic = dynamic(
  () => import("@/components/pro/replay-tower").then((m) => m.ReplayTower),
  {
    loading: () => (
      <div className="w-full h-[620px] rounded-2xl border border-zinc-800 bg-carbon-900/60 p-6 flex flex-col justify-between animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-6 w-48 bg-zinc-800 rounded" />
          <div className="h-6 w-32 bg-zinc-800 rounded" />
        </div>
        <div className="h-96 w-full bg-zinc-950/40 rounded-lg flex items-center justify-center border border-zinc-800/40">
          <span className="text-xs font-mono text-zinc-500">Initialising session replay timing tower...</span>
        </div>
        <div className="h-10 w-full bg-zinc-800/40 rounded" />
      </div>
    ),
    ssr: false,
  }
);

export default function ReplayProPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Badge variant="racing" className="text-xs">TIMING &amp; TELEMETRY TOWER</Badge>
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

      <ReplayTowerDynamic />

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
