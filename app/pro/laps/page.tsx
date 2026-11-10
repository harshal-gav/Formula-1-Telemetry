"use client";

import { useState, useMemo } from "react";
import { useGP } from "@/context/gp-context";
import { PRO_DRIVERS, ProDriver } from "@/lib/drivers";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProBadge } from "@/components/layout/pro-badge";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { BarChart2, Plus, Check } from "lucide-react";

function generateRaceLapsForDrivers(
  totalLaps: number,
  baseLapTime: number,
  pitLossDelta: number,
  drivers: ProDriver[]
) {
  const data = [];

  for (let lap = 1; lap <= totalLaps; lap++) {
    const row: Record<string, number> = { lap };

    drivers.forEach((driver, idx) => {
      // Deterministic pit strategy lap for this driver
      const pitStintPct = 0.35 + (idx % 3) * 0.05 + (driver.number % 5) * 0.01;
      const pitLap = Math.max(10, Math.floor(totalLaps * pitStintPct));
      const hasSecondStop = totalLaps > 55 && (idx % 2 === 1);
      const pitLap2 = Math.floor(totalLaps * 0.72);

      const driverSpeedFactor = driver.speedOffset * -0.08;
      const degradationFactor = (lap % Math.round(totalLaps / 2)) * 0.045;
      const lapNoise = ((driver.number * 7 + lap * 13) % 17 - 8) * 0.02;

      let lapTime = baseLapTime + driverSpeedFactor + degradationFactor + lapNoise;

      if (lap === pitLap || (hasSecondStop && lap === pitLap2)) {
        lapTime += pitLossDelta; // Pit in-lap & transit
      }

      row[driver.id] = Number(lapTime.toFixed(3));
    });

    data.push(row);
  }

  return data;
}

export default function LapsProPage() {
  const { selectedGP } = useGP();
  const [selectedDriverIds, setSelectedDriverIds] = useState<string[]>(["nor", "ver", "lec"]);

  const activeDrivers = useMemo(() => {
    return PRO_DRIVERS.filter((d) => selectedDriverIds.includes(d.id));
  }, [selectedDriverIds]);

  const toggleDriver = (id: string) => {
    if (selectedDriverIds.includes(id)) {
      if (selectedDriverIds.length > 1) {
        setSelectedDriverIds(selectedDriverIds.filter((d) => d !== id));
      }
    } else {
      if (selectedDriverIds.length < 5) {
        setSelectedDriverIds([...selectedDriverIds, id]);
      } else {
        // Replace last
        setSelectedDriverIds([...selectedDriverIds.slice(1), id]);
      }
    }
  };

  const lapsData = useMemo(
    () =>
      generateRaceLapsForDrivers(
        selectedGP.totalLaps,
        selectedGP.baseLapTimeSeconds,
        selectedGP.pitLaneDeltaSeconds,
        activeDrivers
      ),
    [selectedGP.totalLaps, selectedGP.baseLapTimeSeconds, selectedGP.pitLaneDeltaSeconds, activeDrivers]
  );

  const yMin = Math.floor(selectedGP.baseLapTimeSeconds - 2);
  const yMax = Math.ceil(selectedGP.baseLapTimeSeconds + selectedGP.pitLaneDeltaSeconds + 4);
  const isUpcoming = selectedGP.status === "upcoming";

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Badge variant="racing" className="text-xs">
            {isUpcoming ? "PROJECTED PACE MODEL" : "RACE PACE METRICS"}
          </Badge>
          <ProBadge />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase flex items-center gap-2.5">
          <BarChart2 className="w-6 h-6 text-racing-cyan" />
          {isUpcoming ? "Projected Lap Progression & Pace Model" : "Lap-by-Lap Race Progression & Degradation"}
        </h1>
        <p className="text-xs text-zinc-400">
          {isUpcoming
            ? `Estimated stint lap consistency and tyre drop-off models across all ${selectedGP.totalLaps} laps of the upcoming ${selectedGP.name}.`
            : `Lap time consistency, pit out-lap deltas, and tyre drop-off across all ${selectedGP.totalLaps} laps of the ${selectedGP.name}.`}
        </p>
      </div>

      {isUpcoming && (
        <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-mono flex items-start gap-2.5">
          <span className="font-bold text-amber-400 shrink-0">UPCOMING ROUND {selectedGP.round}:</span>
          <p className="leading-relaxed">
            The {selectedGP.name} has not started yet. Official telemetry feeds and live timing go live once cars hit the track. Below is the projected pre-race pace progression modeled for {selectedGP.circuitName}.
          </p>
        </div>
      )}

      {/* Driver Selection Pills (Select whichever driver you want) */}
      <div className="p-3 bg-carbon-900 border border-zinc-800 rounded-xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-400 font-bold">
            Select Drivers to Compare ({selectedDriverIds.length}/5 max):
          </span>
          <span className="text-[11px] font-mono text-zinc-500">
            Click any driver to toggle comparison line
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
          {PRO_DRIVERS.map((driver) => {
            const isSelected = selectedDriverIds.includes(driver.id);
            return (
              <button
                key={driver.id}
                onClick={() => toggleDriver(driver.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all border ${
                  isSelected
                    ? "bg-zinc-800 text-white font-bold border-zinc-600 shadow-sm"
                    : "bg-zinc-950 text-zinc-400 border-zinc-800/80 hover:bg-zinc-900"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: driver.teamColor }}
                />
                <span>#{driver.number} {driver.code}</span>
                {isSelected ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Plus className="w-3 h-3 text-zinc-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <Card className="border-zinc-800 bg-carbon-900 shadow-2xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-xl font-bold text-white">
                {isUpcoming ? "Pre-Race Projected Lap Progression" : "Race Lap Time Trajectory"} — {selectedGP.circuitName}
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Spikes indicate pit lane transit and out-lap tyre warmup penalties ({selectedGP.country}).
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              {activeDrivers.map((d) => (
                <span key={d.id} className="flex items-center gap-1.5" style={{ color: d.teamColor }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.teamColor }} />
                  {d.code}
                </span>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="w-full h-80 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lapsData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#22273d" />
                <XAxis dataKey="lap" stroke="#64748b" fontSize={11} tickFormatter={(val) => `L${val}`} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  domain={[yMin, yMax]}
                  tickFormatter={(val) => `${val}s`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0b0d14",
                    borderColor: "#27272a",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontFamily: "monospace",
                  }}
                  labelFormatter={(lap) => `${selectedGP.name}: Lap ${lap}`}
                  formatter={(val: any, name: any) => {
                    const driver = PRO_DRIVERS.find((d) => d.id === name);
                    return [`${val}s`, driver ? driver.name : name];
                  }}
                />
                {activeDrivers.map((driver) => (
                  <Line
                    key={driver.id}
                    type="monotone"
                    dataKey={driver.id}
                    name={driver.id}
                    stroke={driver.teamColor}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t border-zinc-800 text-xs font-mono">
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
              <span className="text-zinc-500 block text-[10px] uppercase">Base Pace Index</span>
              <span className="text-base font-bold text-white">{selectedGP.baseLapTimeSeconds.toFixed(1)}s</span>
              <span className="text-[10px] text-emerald-400 block">{selectedGP.circuitName}</span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
              <span className="text-zinc-500 block text-[10px] uppercase">Total Race Distance</span>
              <span className="text-base font-bold text-white">
                {((selectedGP.lapDistanceMeters * selectedGP.totalLaps) / 1000).toFixed(1)} km
              </span>
              <span className="text-[10px] text-zinc-400 block">
                {selectedGP.totalLaps} laps @ {selectedGP.lapDistanceMeters}m
              </span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
              <span className="text-zinc-500 block text-[10px] uppercase">Pit Lane Delta</span>
              <span className="text-base font-bold text-amber-400">+{selectedGP.pitLaneDeltaSeconds}s</span>
              <span className="text-[10px] text-zinc-400 block">Transit + In/Out penalty</span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
              <span className="text-zinc-500 block text-[10px] uppercase">Lap Record</span>
              <span className="text-base font-bold text-purple-400">{selectedGP.lapRecord.time}</span>
              <span className="text-[10px] text-zinc-400 block truncate">{selectedGP.lapRecord.driver} ({selectedGP.lapRecord.year})</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
