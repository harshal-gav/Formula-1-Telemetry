"use client";

import { useState, useMemo } from "react";
import { useGP } from "@/context/gp-context";
import { PRO_DRIVERS, ProDriver } from "@/lib/drivers";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  calculateRaceStrategies,
  simulateLapDegradation,
  COMPOUND_PROFILES,
} from "@/lib/strategy/calculator";
import { Disc3, Timer, Filter } from "lucide-react";

interface DriverStintDisplay {
  driverId: string;
  driverName: string;
  driverNumber: string;
  constructorName: string;
  teamColor: string;
  stints: Array<{
    compound: "SOFT" | "MEDIUM" | "HARD";
    startLap: number;
    endLap: number;
    pitStopDuration?: string;
  }>;
}

function generateStintsForGrid(totalLaps: number, overtakingDifficulty: string): DriverStintDisplay[] {
  const isHighDeg = totalLaps > 60 || overtakingDifficulty === "Low";

  return PRO_DRIVERS.map((driver, idx) => {
    const pos = idx + 1;
    // Vary strategies realistically across the grid
    let stints: DriverStintDisplay["stints"] = [];

    if (pos === 2 || pos === 7 || pos === 12) {
      // Soft start aggressive 1-stop or 2-stop
      const s1End = Math.max(12, Math.round(totalLaps * 0.28));
      stints = [
        { compound: "SOFT", startLap: 1, endLap: s1End, pitStopDuration: "2.2s" },
        { compound: "HARD", startLap: s1End + 1, endLap: totalLaps },
      ];
    } else if (pos === 3 || (isHighDeg && (pos === 4 || pos === 8 || pos === 14))) {
      // 2-Stop (Medium -> Hard -> Soft/Medium)
      const s1End = Math.round(totalLaps * 0.35);
      const s2End = Math.round(totalLaps * 0.72);
      stints = [
        { compound: "MEDIUM", startLap: 1, endLap: s1End, pitStopDuration: "2.4s" },
        { compound: "HARD", startLap: s1End + 1, endLap: s2End, pitStopDuration: "2.3s" },
        { compound: pos % 2 === 0 ? "SOFT" : "MEDIUM", startLap: s2End + 1, endLap: totalLaps },
      ];
    } else if (pos === 9 || pos === 15 || pos === 18) {
      // Reverse strategy (Hard -> Medium)
      const s1End = Math.round(totalLaps * 0.58);
      stints = [
        { compound: "HARD", startLap: 1, endLap: s1End, pitStopDuration: "2.5s" },
        { compound: "MEDIUM", startLap: s1End + 1, endLap: totalLaps },
      ];
    } else {
      // Standard 1-stop (Medium -> Hard)
      const s1End = Math.round(totalLaps * 0.42);
      stints = [
        { compound: "MEDIUM", startLap: 1, endLap: s1End, pitStopDuration: "2.3s" },
        { compound: "HARD", startLap: s1End + 1, endLap: totalLaps },
      ];
    }

    return {
      driverId: driver.id,
      driverName: driver.name,
      driverNumber: String(driver.number),
      constructorName: driver.constructorName,
      teamColor: driver.teamColor,
      stints,
    };
  });
}

export function StintVisualizer({ totalLaps: propTotalLaps }: { totalLaps?: number }) {
  const { selectedGP } = useGP();
  const totalLaps = propTotalLaps || selectedGP.totalLaps;
  const [selectedCompound, setSelectedCompound] = useState<"SOFT" | "MEDIUM" | "HARD">("MEDIUM");
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>("ALL");
  const [showAllDrivers, setShowAllDrivers] = useState<boolean>(false);

  const strategies = useMemo(
    () => calculateRaceStrategies(totalLaps, selectedGP.baseLapTimeSeconds, selectedGP.pitLaneDeltaSeconds),
    [totalLaps, selectedGP.baseLapTimeSeconds, selectedGP.pitLaneDeltaSeconds]
  );

  const degradationData = useMemo(
    () => simulateLapDegradation(selectedCompound, Math.min(45, Math.round(totalLaps * 0.7)), selectedGP.baseLapTimeSeconds),
    [selectedCompound, totalLaps, selectedGP.baseLapTimeSeconds]
  );

  const isUpcoming = selectedGP.status === "upcoming";

  const allDriverStints = useMemo(
    () => generateStintsForGrid(totalLaps, selectedGP.overtakingDifficulty),
    [totalLaps, selectedGP.overtakingDifficulty]
  );

  const teams = useMemo(() => {
    const list = Array.from(new Set(PRO_DRIVERS.map((d) => d.constructorName)));
    return ["ALL", ...list];
  }, []);

  const filteredDriverStints = useMemo(() => {
    let list = allDriverStints;
    if (selectedTeamFilter !== "ALL") {
      list = list.filter((d) => d.constructorName === selectedTeamFilter);
    }
    return showAllDrivers || selectedTeamFilter !== "ALL" ? list : list.slice(0, 8);
  }, [allDriverStints, selectedTeamFilter, showAllDrivers]);

  const getCompoundBg = (compound: string) => {
    switch (compound) {
      case "SOFT":
        return "bg-red-600 text-white border-red-500";
      case "MEDIUM":
        return "bg-amber-400 text-black border-amber-300 font-bold";
      case "HARD":
        return "bg-zinc-100 text-black border-white font-bold";
      default:
        return "bg-zinc-700 text-white";
    }
  };

  return (
    <div className="space-y-6">
      {isUpcoming && (
        <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-mono flex items-start gap-2.5">
          <span className="font-bold text-amber-400 shrink-0">UPCOMING ROUND {selectedGP.round}:</span>
          <p className="leading-relaxed">
            The {selectedGP.name} has not started yet. Showing pre-race projected tyre compound allocations, degradation thresholds, and optimal pit windows calculated for {selectedGP.circuitName}.
          </p>
        </div>
      )}

      {/* 1. Stint Strategy Timeline */}
      <Card className="border-zinc-800 bg-carbon-900/90 shadow-xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Disc3 className="w-5 h-5 text-amber-400" />
                {isUpcoming ? "Projected Tyre Stints & Pit Stop Breakdown" : "Race Tyre Stints & Pit Stop Breakdown"}
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                {isUpcoming
                  ? `Simulated stint distribution and compound allocation over ${totalLaps} laps for ${selectedGP.circuitName}.`
                  : `Visual stint distribution and compound allocation over ${totalLaps} laps.`}
              </CardDescription>
            </div>

            {/* Compound Legend */}
            <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 shrink-0">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" /> Soft
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Medium
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-white inline-block" /> Hard
              </span>
            </div>
          </div>

          {/* Team Filter selector */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-2 border-t border-zinc-800/60">
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
              <Filter className="w-3.5 h-3.5 text-zinc-500 shrink-0 mr-1" />
              {teams.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTeamFilter(t)}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-mono shrink-0 cursor-pointer transition-colors ${
                    selectedTeamFilter === t
                      ? "bg-zinc-700 text-white font-bold"
                      : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {selectedTeamFilter === "ALL" && (
              <button
                onClick={() => setShowAllDrivers(!showAllDrivers)}
                className="text-[11px] font-mono text-racing-cyan hover:underline shrink-0 cursor-pointer"
              >
                {showAllDrivers ? "Show Top 8" : `Show All 20 Drivers (${allDriverStints.length})`}
              </button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {filteredDriverStints.map((driver) => (
            <div key={driver.driverNumber} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-4 rounded-full"
                    style={{ backgroundColor: driver.teamColor }}
                  />
                  <span className="font-bold text-white">{driver.driverName}</span>
                  <span className="text-zinc-500">#{driver.driverNumber}</span>
                </div>
                <span className="text-zinc-500 text-[11px]">{driver.constructorName}</span>
              </div>

              {/* Stint Bars */}
              <div className="w-full h-7 bg-zinc-950 rounded-lg p-0.5 flex gap-1 relative overflow-hidden border border-zinc-800/80">
                {driver.stints.map((stint, idx) => {
                  const stintLaps = stint.endLap - stint.startLap + 1;
                  const percentage = (stintLaps / totalLaps) * 100;

                  return (
                    <div
                      key={idx}
                      style={{ width: `${percentage}%` }}
                      className={`h-full rounded flex items-center justify-between px-2 text-[10px] font-mono border ${getCompoundBg(
                        stint.compound
                      )} relative group`}
                    >
                      <span className="truncate">{stint.compound[0]}</span>
                      <span className="opacity-90">{stintLaps}L</span>

                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20 bg-zinc-900 border border-zinc-700 text-white text-[10px] rounded p-2 shadow-xl whitespace-nowrap">
                        <p className="font-bold">Stint {idx + 1}: {stint.compound}</p>
                        <p>Laps {stint.startLap} - {stint.endLap} ({stintLaps} laps)</p>
                        {stint.pitStopDuration && <p className="text-amber-400">Pit Stop: {stint.pitStopDuration}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Lap Scale Axis */}
          <div className="flex justify-between text-[10px] font-mono text-zinc-500 pt-2 px-1 border-t border-zinc-800/60">
            <span>Lap 1</span>
            <span>Lap {Math.round(totalLaps * 0.25)}</span>
            <span>Lap {Math.round(totalLaps * 0.5)}</span>
            <span>Lap {Math.round(totalLaps * 0.75)}</span>
            <span>Lap {totalLaps}</span>
          </div>
        </CardContent>
      </Card>

      {/* 2. Compound Degradation Simulation Curve */}
      <Card className="border-zinc-800 bg-carbon-900/90 shadow-xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Timer className="w-5 h-5 text-racing-cyan" />
                Tyre Degradation & Performance Cliff Model
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Pace degradation projection in seconds per lap driven (derived from multi-stint telemetry regression models).
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              {(["SOFT", "MEDIUM", "HARD"] as const).map((comp) => (
                <Button
                  key={comp}
                  variant={selectedCompound === comp ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCompound(comp)}
                  className={`h-7 text-xs font-mono ${
                    selectedCompound === comp ? getCompoundBg(comp) : ""
                  }`}
                >
                  {comp}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={degradationData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#22273d" />
                <XAxis
                  dataKey="lap"
                  stroke="#64748b"
                  fontSize={11}
                  tickFormatter={(val) => `Lap ${val}`}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  domain={["auto", "auto"]}
                  tickFormatter={(val) => `${val.toFixed(1)}s`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0b0d14",
                    borderColor: "#27272a",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontFamily: "monospace",
                  }}
                  labelFormatter={(lap) => `Tyre Age: Lap ${lap}`}
                  formatter={(val: any) => [`${val}s`, "Pace Loss"]}
                />
                <Line
                  type="monotone"
                  dataKey="degradation"
                  name="Delta to Fresh Tyre"
                  stroke={COMPOUND_PROFILES[selectedCompound].color}
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-zinc-800 text-xs font-mono">
            <div className="p-2.5 rounded bg-carbon-950/60 border border-zinc-800">
              <span className="text-zinc-500 block text-[10px] uppercase">Base Lap Offset</span>
              <span className="text-sm font-bold text-white">
                +{COMPOUND_PROFILES[selectedCompound].basePaceOffsetSeconds.toFixed(2)}s
              </span>
              <span className="text-[10px] text-zinc-500 block">vs theoretical pole compound</span>
            </div>
            <div className="p-2.5 rounded bg-carbon-950/60 border border-zinc-800">
              <span className="text-zinc-500 block text-[10px] uppercase">Degradation Rate</span>
              <span className="text-sm font-bold text-amber-400">
                +{COMPOUND_PROFILES[selectedCompound].degPerLapSeconds.toFixed(3)}s / lap
              </span>
              <span className="text-[10px] text-zinc-500 block">Linear wear window</span>
            </div>
            <div className="p-2.5 rounded bg-carbon-950/60 border border-zinc-800">
              <span className="text-zinc-500 block text-[10px] uppercase">Tyre Cliff Horizon</span>
              <span className="text-sm font-bold text-red-400">
                Lap {COMPOUND_PROFILES[selectedCompound].cliffLap}
              </span>
              <span className="text-[10px] text-zinc-500 block">Rapid drop-off point</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Pit Strategy Options Table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {strategies.map((strat) => (
          <Card key={strat.id} className="border-zinc-800 bg-carbon-900/90 shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge
                  variant={
                    strat.riskLevel === "Low"
                      ? "secondary"
                      : strat.riskLevel === "Medium"
                      ? "default"
                      : "destructive"
                  }
                  className="text-[10px]"
                >
                  {strat.riskLevel} Risk
                </Badge>
                <span className="text-xs font-mono text-zinc-400">{strat.stops}-Stop</span>
              </div>
              <CardTitle className="text-base font-bold text-white mt-1">
                {strat.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <p className="text-zinc-400 text-xs leading-relaxed">{strat.description}</p>
              <div className="pt-2 border-t border-zinc-800/80 font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Pit Window:</span>
                  <span className="text-amber-400">Laps {strat.pitWindowLaps.join(" - ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Pit Lane Loss:</span>
                  <span className="text-zinc-200">+{selectedGP.pitLaneDeltaSeconds}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Undercut Potential:</span>
                  <span className="text-zinc-200">{strat.undercutPotential}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
