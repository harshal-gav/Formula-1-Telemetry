"use client";

import { useGP } from "@/context/gp-context";
import { Badge } from "@/components/ui/badge";
import { MapPin, Flag, ChevronDown } from "lucide-react";

export function GPSelector() {
  const { selectedGP, setSelectedGPId, allGPs } = useGP();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 px-4 rounded-xl bg-carbon-900 border border-zinc-800 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-racing-red shrink-0">
          <MapPin className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-500 uppercase">Active Grand Prix:</span>
            <Badge variant="outline" className="text-[10px] font-mono text-racing-red border-racing-red/40">
              ROUND {selectedGP.round}
            </Badge>
          </div>
          <span className="text-base font-extrabold text-white block">
            {selectedGP.name}
          </span>
          <span className="text-xs font-mono text-zinc-400">
            {selectedGP.circuitName} ({selectedGP.country})
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Track quick specs */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800/80">
          <span className="text-zinc-400">{selectedGP.lapDistanceMeters.toLocaleString()}m</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400">{selectedGP.totalLaps} Laps</span>
          <span className="text-zinc-600">•</span>
          <span className="text-amber-400 font-bold">{selectedGP.topSpeedTrapKmH} km/h trap</span>
        </div>

        {/* Dropdown Selector */}
        <div className="relative">
          <select
            value={selectedGP.id}
            onChange={(e) => setSelectedGPId(e.target.value)}
            className="appearance-none bg-zinc-950 hover:bg-zinc-800 border border-zinc-700/80 rounded-lg px-4 py-2 pr-9 text-xs font-mono font-bold text-white focus:outline-none focus:ring-1 focus:ring-racing-red cursor-pointer transition-colors shadow-inner"
          >
            {allGPs.map((gp) => (
              <option key={gp.id} value={gp.id}>
                R{gp.round}: {gp.name} ({gp.country})
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

