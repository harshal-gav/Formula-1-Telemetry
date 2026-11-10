"use client";

import { useState, useEffect, useMemo } from "react";
import { useGP } from "@/context/gp-context";
import { PRO_DRIVERS } from "@/lib/drivers";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  RotateCcw,
  CloudRain,
  Thermometer,
  Wind,
  Flag,
  Radio,
  Search,
} from "lucide-react";

interface ReplayDriverRow {
  position: number;
  driverNumber: string;
  driverCode: string;
  driverName: string;
  constructorName: string;
  teamColor: string;
  gapToLeader: string;
  interval: string;
  lastLapTime: string;
  bestLapTime: string;
  isFastestLap?: boolean;
  tyreCompound: "SOFT" | "MEDIUM" | "HARD";
  tyreAge: number;
  pitStops: number;
}

function formatLapTimeSec(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const remSec = (seconds % 60).toFixed(3);
  return `${mins}:${remSec.padStart(6, "0")}`;
}

function buildGridForCircuit(baseLapTime: number): ReplayDriverRow[] {
  let cumulativeGap = 0;

  return PRO_DRIVERS.map((driver, index) => {
    const pos = index + 1;
    const intervalNum = pos === 1 ? 0 : Number((0.8 + Math.random() * 1.6 + (pos > 8 ? 0.7 : 0)).toFixed(3));
    cumulativeGap += intervalNum;

    const driverPaceOffset = (driver.speedOffset * -0.15);
    const lastLapSec = baseLapTime + driverPaceOffset + 0.3 + Math.random() * 0.4;
    const bestLapSec = baseLapTime + driverPaceOffset - 0.2 - Math.random() * 0.2;

    const compound: "SOFT" | "MEDIUM" | "HARD" =
      pos % 3 === 0 ? "SOFT" : pos % 2 === 0 ? "HARD" : "MEDIUM";

    return {
      position: pos,
      driverNumber: String(driver.number),
      driverCode: driver.code,
      driverName: driver.name,
      constructorName: driver.constructorName,
      teamColor: driver.teamColor,
      gapToLeader: pos === 1 ? "LEADER" : `+${cumulativeGap.toFixed(3)}`,
      interval: pos === 1 ? "-" : `+${intervalNum.toFixed(3)}`,
      lastLapTime: formatLapTimeSec(lastLapSec),
      bestLapTime: formatLapTimeSec(bestLapSec),
      isFastestLap: pos === 1,
      tyreCompound: compound,
      tyreAge: Math.max(3, 16 - Math.round(pos * 0.5)),
      pitStops: pos > 14 ? 1 : 0,
    };
  });
}

export function ReplayTower({ totalLaps: propTotalLaps }: { totalLaps?: number }) {
  const { selectedGP } = useGP();
  const totalLaps = propTotalLaps || selectedGP.totalLaps;
  const [currentLap, setCurrentLap] = useState(14);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 4>(1);
  const [driverFilter, setDriverFilter] = useState<string>("");

  // Re-generate grid whenever active Grand Prix changes
  const [grid, setGrid] = useState<ReplayDriverRow[]>(() =>
    buildGridForCircuit(selectedGP.baseLapTimeSeconds)
  );

  useEffect(() => {
    setGrid(buildGridForCircuit(selectedGP.baseLapTimeSeconds));
    setCurrentLap(Math.min(14, Math.round(selectedGP.totalLaps * 0.25)));
    setIsPlaying(false);
  }, [selectedGP.id, selectedGP.baseLapTimeSeconds, selectedGP.totalLaps]);

  // Clamp current lap if user switches circuit
  useEffect(() => {
    if (currentLap > totalLaps) {
      setCurrentLap(totalLaps);
    }
  }, [totalLaps, currentLap]);

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentLap((prevLap) => {
        if (prevLap >= totalLaps) {
          setIsPlaying(false);
          return totalLaps;
        }

        const nextLap = prevLap + 1;

        setGrid((prevGrid) =>
          prevGrid.map((driver, index) => {
            const age = driver.tyreAge + 1;
            const variance = (Math.random() - 0.48) * 0.25;
            let gapSec = index === 0 ? 0 : parseFloat(driver.gapToLeader.replace("+", "")) + variance;
            gapSec = Math.max(0, gapSec);

            const lapSec = selectedGP.baseLapTimeSeconds + (age * 0.05) + (Math.random() * 0.3);

            return {
              ...driver,
              tyreAge: age,
              gapToLeader: index === 0 ? "LEADER" : `+${gapSec.toFixed(3)}`,
              lastLapTime: formatLapTimeSec(lapSec),
            };
          })
        );

        return nextLap;
      });
    }, 2000 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, totalLaps, selectedGP.baseLapTimeSeconds]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const resetReplay = () => {
    setIsPlaying(false);
    setCurrentLap(1);
    setGrid(buildGridForCircuit(selectedGP.baseLapTimeSeconds));
  };

  const isUpcoming = selectedGP.status === "upcoming";

  const displayedGrid = useMemo(() => {
    if (!driverFilter) return grid;
    const term = driverFilter.toLowerCase();
    return grid.filter(
      (r) =>
        r.driverName.toLowerCase().includes(term) ||
        r.driverCode.toLowerCase().includes(term) ||
        r.constructorName.toLowerCase().includes(term) ||
        r.driverNumber === term
    );
  }, [grid, driverFilter]);

  return (
    <Card className="border-zinc-800 bg-carbon-900/95 shadow-2xl">
      <CardHeader className="border-b border-zinc-800/80 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 text-red-500 font-mono text-xs font-bold animate-pulse">
                <Radio className="w-4 h-4" />
                <span>{isUpcoming ? "PRE-RACE SIMULATION" : "SESSION REPLAY"}</span>
              </div>
              <Badge
                variant={isUpcoming ? "racing" : "secondary"}
                className="text-[10px] font-mono uppercase"
              >
                {isUpcoming ? "UPCOMING ROUND MODEL" : "SESSION ARCHIVE"}
              </Badge>
              <Badge variant="outline" className="text-[10px] font-mono text-zinc-400">
                20 CARS ACTIVE
              </Badge>
            </div>
            <CardTitle className="text-xl font-black tracking-tight text-white mt-1">
              {isUpcoming ? "Pre-Race Simulation Tower" : "Live Timing & Replay Tower"} — {selectedGP.name}
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              {isUpcoming
                ? `Projected race pacing simulation for ${selectedGP.circuitName} (${selectedGP.country}). Base pace: ${formatLapTimeSec(selectedGP.baseLapTimeSeconds)}.`
                : `Interactive session telemetry tower for ${selectedGP.circuitName} (${selectedGP.country}).`}
            </CardDescription>
          </div>

          {/* Dynamic Circuit-Specific Weather Conditions Header */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-mono bg-zinc-950/80 px-3 py-2 rounded-lg border border-zinc-800 shrink-0">
            <span className="flex items-center gap-1 text-zinc-300 shrink-0">
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              Track: {selectedGP.weather.trackTemp}°C
            </span>
            <span className="flex items-center gap-1 text-zinc-300 shrink-0">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              Air: {selectedGP.weather.airTemp}°C
            </span>
            <span className="flex items-center gap-1 text-zinc-300 shrink-0">
              <CloudRain className="w-3.5 h-3.5 text-blue-400" />
              Rain: {selectedGP.weather.rainProbability}%
            </span>
            <span className="flex items-center gap-1 text-emerald-400 font-bold shrink-0">
              <Flag className="w-3.5 h-3.5" />
              {selectedGP.weather.condition}
            </span>
          </div>
        </div>

        {/* Notice for Upcoming Grand Prix */}
        {isUpcoming && (
          <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-mono flex items-start gap-2.5">
            <span className="font-bold text-amber-400 shrink-0">UPCOMING ROUND {selectedGP.round}:</span>
            <p className="leading-relaxed">
              The {selectedGP.name} has not started yet. Official telemetry feeds and live timing go live once cars hit the track for official practice, qualifying, and race sessions. Below is the pre-race pacing simulation based on {selectedGP.circuitName}&apos;s track characteristics and aerodynamic requirements.
            </p>
          </div>
        )}

        {/* Playback Control Bar & Driver Filter */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 mt-2 border-t border-zinc-800/60">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={isPlaying ? "destructive" : "racing"}
              size="sm"
              onClick={togglePlay}
              className="h-8 gap-1.5 font-mono text-xs font-bold"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? "PAUSE" : isUpcoming ? "RUN SIMULATION" : "REPLAY"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={resetReplay}
              className="h-8 w-8 p-0 text-zinc-400"
              title="Reset to Lap 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>

            <div className="flex items-center bg-zinc-950 rounded border border-zinc-800 p-0.5">
              {([1, 2, 4] as const).map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-0.5 text-[10px] font-mono rounded cursor-pointer ${
                    playbackSpeed === speed
                      ? "bg-zinc-800 text-white font-bold"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Quick driver search filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Find driver / team..."
                value={driverFilter}
                onChange={(e) => setDriverFilter(e.target.value)}
                className="pl-8 pr-3 py-1 bg-zinc-950 border border-zinc-800 rounded text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-racing-red w-36 sm:w-48"
              />
            </div>
          </div>

          {/* Lap Slider & Counter */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="font-mono text-xs font-bold text-white shrink-0">
              LAP {currentLap} / {totalLaps}
            </span>
            <input
              type="range"
              min={1}
              max={totalLaps}
              value={currentLap}
              onChange={(e) => setCurrentLap(Number(e.target.value))}
              className="w-full sm:w-48 accent-racing-red cursor-pointer"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-zinc-950/90 text-zinc-400 text-[11px] uppercase tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-2.5 px-3 w-12 text-center">Pos</th>
                <th className="py-2.5 px-3">Driver</th>
                <th className="py-2.5 px-3">Team</th>
                <th className="py-2.5 px-3 text-right">Gap</th>
                <th className="py-2.5 px-3 text-right">Interval</th>
                <th className="py-2.5 px-3 text-right">Last Lap</th>
                <th className="py-2.5 px-3 text-right">Best Lap</th>
                <th className="py-2.5 px-3 text-center">Tyre</th>
                <th className="py-2.5 px-3 text-center">Stops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {displayedGrid.map((row) => (
                <tr
                  key={row.driverNumber}
                  className="hover:bg-zinc-800/40 transition-colors group"
                >
                  {/* Position */}
                  <td className="py-2.5 px-3 text-center font-bold text-white">
                    <span
                      className={`inline-block w-6 text-center ${
                        row.position === 1
                          ? "text-amber-400 font-extrabold"
                          : row.position <= 3
                          ? "text-zinc-200"
                          : "text-zinc-400"
                      }`}
                    >
                      {row.position}
                    </span>
                  </td>

                  {/* Driver Name & Color Bar */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-1 h-4 rounded-full"
                        style={{ backgroundColor: row.teamColor }}
                      />
                      <span className="font-bold text-white tracking-wide">
                        {row.driverCode}
                      </span>
                      <span className="text-zinc-400 hidden sm:inline text-[11px]">
                        {row.driverName}
                      </span>
                    </div>
                  </td>

                  {/* Team */}
                  <td className="py-2.5 px-3 text-zinc-400 text-[11px]">{row.constructorName}</td>

                  {/* Gap to Leader */}
                  <td className="py-2.5 px-3 text-right text-zinc-200 font-bold">
                    {row.gapToLeader}
                  </td>

                  {/* Interval */}
                  <td className="py-2.5 px-3 text-right text-zinc-400">{row.interval}</td>

                  {/* Last Lap Time */}
                  <td className="py-2.5 px-3 text-right text-zinc-300">{row.lastLapTime}</td>

                  {/* Best Lap */}
                  <td className="py-2.5 px-3 text-right">
                    <span
                      className={
                        row.isFastestLap
                          ? "text-purple-400 font-bold underline decoration-purple-500/60"
                          : "text-zinc-400"
                      }
                    >
                      {row.bestLapTime}
                    </span>
                  </td>

                  {/* Tyre Compound Badge */}
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        row.tyreCompound === "SOFT"
                          ? "bg-red-600/20 text-red-400 border border-red-500/30"
                          : row.tyreCompound === "MEDIUM"
                          ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                          : "bg-zinc-200/20 text-zinc-200 border border-zinc-200/30"
                      }`}
                    >
                      {row.tyreCompound[0]} ({row.tyreAge}L)
                    </span>
                  </td>

                  {/* Pit Stops */}
                  <td className="py-2.5 px-3 text-center text-zinc-400">{row.pitStops}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
