"use client";

import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import { ProBadge } from "@/components/layout/pro-badge";
import { Sparkles } from "lucide-react";

const PredictorCardDynamic = dynamic(
  () => import("@/components/pro/predictor-card").then((m) => m.PredictorCard),
  {
    loading: () => (
      <div className="w-full h-[540px] rounded-2xl border border-zinc-800 bg-carbon-900/60 p-6 flex flex-col justify-between animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-6 w-48 bg-zinc-800 rounded" />
          <div className="h-6 w-32 bg-zinc-800 rounded" />
        </div>
        <div className="h-80 w-full bg-zinc-950/40 rounded-lg flex items-center justify-center border border-zinc-800/40">
          <span className="text-xs font-mono text-zinc-500">Calculating Monte Carlo race probabilities...</span>
        </div>
        <div className="h-10 w-full bg-zinc-800/40 rounded" />
      </div>
    ),
    ssr: false,
  }
);

export default function PredictorProPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Badge variant="racing" className="text-xs">PREDICTIVE HEURISTICS</Badge>
          <ProBadge />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase flex items-center gap-2.5">
          <Sparkles className="w-6 h-6 text-emerald-400" />
          Grand Prix Podium &amp; Winner Probability Engine
        </h1>
        <p className="text-xs text-zinc-400">
          Client-side statistical modeling analyzing grid qualification, sector deltas, and circuit overtaking characteristics.
        </p>
      </div>

      <PredictorCardDynamic />
    </div>
  );
}
