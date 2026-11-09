"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  CloudRain,
  Thermometer,
  Wind,
  Flag,
  Radio,
} from "lucide-react";
import { formatLapTime, formatGap } from "@/lib/utils";

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
  inPit?: boolean;
}

const INITIAL_GRID: ReplayDriverRow[] = [
  {
    position: 1,
    driverNumber: "4",
    driverCode: "NOR",
    driverName: "Lando Norris",
    constructorName: "McLaren",
    teamColor: "#FF8000",
    gapToLeader: "LEADER",
    interval: "-",
    lastLapTime: "1:14.210",
    bestLapTime: "1:13.882",
    isFastestLap: true,
    tyreCompound: "MEDIUM",
    tyreAge: 14,
    pitStops: 0,
  },
  {
    position: 2,
    driverNumber: "1",
    driverCode: "VER",
    driverName: "Max Verstappen",
    constructorName: "Red Bull",
    teamColor: "#3671C6",
    gapToLeader: "+1.428",
    interval: "+1.428",
    lastLapTime: "1:14.390",
    bestLapTime: "1:14.012",
    tyreCompound: "MEDIUM",
    tyreAge: 14,
    pitStops: 0,
  },
  {
    position: 3,
    driverNumber: "16",
    driverCode: "LEC",
    driverName: "Charles Leclerc",
    constructorName: "Ferrari",
    teamColor: "#E80020",
    gapToLeader: "+4.180",
    interval: "+2.752",
    lastLapTime: "1:14.650",
    bestLapTime: "1:14.150",
    tyreCompound: "HARD",
    tyreAge: 14,
    pitStops: 0,
  },
  {
    position: 4,
    driverNumber: "63",
    driverCode: "RUS",
    driverName: "George Russell",
    constructorName: "Mercedes",
    teamColor: "#27F4D2",
    gapToLeader: "+6.820",
    interval: "+2.640",
    lastLapTime: "1:14.712",
    bestLapTime: "1:14.280",
    tyreCompound: "MEDIUM",
    tyreAge: 14,
    pitStops: 0,
  },
  {
    position: 5,
    driverNumber: "81",
    driverCode: "PIA",
    driverName: "Oscar Piastri",
    constructorName: "McLaren",
    teamColor: "#FF8000",
    gapToLeader: "+8.950",
    interval: "+2.130",
    lastLapTime: "1:14.580",
    bestLapTime: "1:14.120",
    tyreCompound: "HARD",
    tyreAge: 14,
    pitStops: 0,
  },
  {
    position: 6,
    driverNumber: "55",
    driverCode: "SAI",
    driverName: "Carlos Sainz",
    constructorName: "Williams",
    teamColor: "#64C4FF",
    gapToLeader: "+14.220",
    interval: "+5.270",
    lastLapTime: "1:15.110",
    bestLapTime: "1:14.890",
    tyreCompound: "MEDIUM",
    tyreAge: 14,
    pitStops: 0,
  },
  {
    position: 7,
    driverNumber: "44",
    driverCode: "HAM",
    driverName: "Lewis Hamilton",
    constructorName: "Ferrari",
    teamColor: "#E80020",
    gapToLeader: "+16.800",
    interval: "+2.580",
    lastLapTime: "1:14.920",
    bestLapTime: "1:14.610",
    tyreCompound: "HARD",
    tyreAge: 14,
    pitStops: 0,
  },
  {
    position: 8,
    driverNumber: "14",
    driverCode: "ALO",
    driverName: "Fernando Alonso",
    constructorName: "Aston Martin",
    teamColor: "#229971",
    gapToLeader: "+24.500",
    interval: "+7.700",
    lastLapTime: "1:15.820",
    bestLapTime: "1:15.340",
    tyreCompound: "MEDIUM",
    tyreAge: 14,
    pitStops: 0,
  },
];

export function ReplayTower({ totalLaps = 57 }: { totalLaps?: number }) {
  const [currentLap, setCurrentLap] = useState(14);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 4>(1);
  const [grid, setGrid] = useState<ReplayDriverRow[]>(INITIAL_GRID);

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

        // Simulate subtle gap fluctuations and tyre degradation as laps progress
        setGrid((prevGrid) =>
          prevGrid.map((driver, index) => {
            const age = driver.tyreAge + 1;
            const variance = (Math.random() - 0.48) * 0.3;
            let gapSec = index === 0 ? 0 : parseFloat(driver.gapToLeader.replace("+", "")) + variance;
            gapSec = Math.max(0, gapSec);

            return {
              ...driver,
              tyreAge: age,
              gapToLeader: index === 0 ? "LEADER" : `+${gapSec.toFixed(3)}`,
              lastLapTime: `1:${(14 + age * 0.04 + Math.random() * 0.2).toFixed(3)}`,
            };
          })
        );

        return nextLap;
      });
    }, 2000 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, totalLaps]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const resetReplay = () => {
    setIsPlaying(false);
    setCurrentLap(1);
    setGrid(INITIAL_GRID);
  };

  return (
    <Card className="border-zinc-800 bg-carbon-900/95 shadow-2xl">
      <CardHeader className="border-b border-zinc-800/80 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-red-500 font-mono text-xs font-bold animate-pulse">
                <Radio className="w-4 h-4" />
                <span>SESSION REPLAY</span>
              </div>
              <Badge variant="outline" className="text-[10px] text-zinc-400">
                NEAR-LIVE SYNC
              </Badge>
            </div>
            <CardTitle className="text-xl font-black tracking-tight text-white mt-1">
              Live Timing & Replay Tower
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Interactive session telemetry tower buffered client-side to respect rate limits.
            </CardDescription>
          </div>

          {/* Session Conditions Header */}
          <div className="flex items-center gap-4 text-xs font-mono bg-zinc-950/80 px-3 py-2 rounded-lg border border-zinc-800">
            <span className="flex items-center gap-1 text-zinc-300">
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              Track: 38°C
            </span>
            <span className="flex items-center gap-1 text-zinc-300">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              Air: 24°C
            </span>
            <span className="flex items-center gap-1 text-zinc-300">
              <CloudRain className="w-3.5 h-3.5 text-blue-400" />
              Rain: 0%
            </span>
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <Flag className="w-3.5 h-3.5" />
              TRACK CLEAR
            </span>
          </div>
        </div>

        {/* Playback Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 mt-2 border-t border-zinc-800/60">
          <div className="flex items-center gap-2">
            <Button
              variant={isPlaying ? "destructive" : "racing"}
              size="sm"
              onClick={togglePlay}
              className="h-8 gap-1.5 font-mono text-xs font-bold"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? "PAUSE" : "REPLAY"}
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
              {grid.map((row) => (
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
