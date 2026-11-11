"use client";

import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import { ProBadge } from "@/components/layout/pro-badge";
import { Disc3 } from "lucide-react";

const StintVisualizerDynamic = dynamic(
  () => import("@/components/pro/stint-visualizer").then((m) => m.StintVisualizer),
  {
    loading: () => (
      <div className="w-full h-[580px] rounded-2xl border border-zinc-800 bg-carbon-900/60 p-6 flex flex-col justify-between animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-6 w-48 bg-zinc-800 rounded" />
          <div className="h-6 w-32 bg-zinc-800 rounded" />
        </div>
        <div className="h-80 w-full bg-zinc-950/40 rounded-lg flex items-center justify-center border border-zinc-800/40">
          <span className="text-xs font-mono text-zinc-500">Loading tyre stint degradation model...</span>
        </div>
        <div className="h-10 w-full bg-zinc-800/40 rounded" />
      </div>
    ),
    ssr: false,
  }
);

export default function StrategyProPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Badge variant="racing" className="text-xs">TYRE STRATEGY ENGINE</Badge>
          <ProBadge />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase flex items-center gap-2.5">
          <Disc3 className="w-6 h-6 text-amber-400" />
          Tyre Compounds, Stint Lifecycles &amp; Pit Windows
        </h1>
        <p className="text-xs text-zinc-400">
          Stint length optimizer, degradation cliff modeling, and undercut vs overcut simulations.
        </p>
      </div>

      <StintVisualizerDynamic />
    </div>
  );
}
