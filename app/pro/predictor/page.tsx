"use client";

import { PredictorCard } from "@/components/pro/predictor-card";
import { Badge } from "@/components/ui/badge";
import { ProBadge } from "@/components/layout/pro-badge";
import { Sparkles } from "lucide-react";

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
          Grand Prix Podium & Winner Probability Engine
        </h1>
        <p className="text-xs text-zinc-400">
          Client-side statistical modeling analyzing grid qualification, sector deltas, and circuit overtaking characteristics.
        </p>
      </div>

      <PredictorCard />
    </div>
  );
}

