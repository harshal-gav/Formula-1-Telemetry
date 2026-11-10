"use client";

import { StintVisualizer } from "@/components/pro/stint-visualizer";
import { Badge } from "@/components/ui/badge";
import { ProBadge } from "@/components/layout/pro-badge";
import { Disc3 } from "lucide-react";

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
          Tyre Compounds, Stint Lifecycles & Pit Windows
        </h1>
        <p className="text-xs text-zinc-400">
          Stint length optimizer, degradation cliff modeling, and undercut vs overcut simulations.
        </p>
      </div>

      <StintVisualizer />
    </div>
  );
}

