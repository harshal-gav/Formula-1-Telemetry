"use client";

import { useMemo } from "react";
import { useGP } from "@/context/gp-context";
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
import { BarChart2, TrendingDown, Timer } from "lucide-react";

// Generate realistic race lap progression data based on circuit specifications
function generateRaceLaps(totalLaps: number, baseLapTime: number) {
  const data = [];
  const pitLapNorris = Math.floor(totalLaps * 0.42);
  const pitLapVerstappen = Math.floor(totalLaps * 0.32);
  const pitLapLeclerc1 = Math.floor(totalLaps * 0.38);
  const pitLapLeclerc2 = Math.floor(totalLaps * 0.74);

  for (let lap = 1; lap <= totalLaps; lap++) {
    // Norris (P1 pace)
    let norris = baseLapTime - 0.3 + (lap % 25) * 0.05 + (Math.random() - 0.5) * 0.2;
    if (lap === pitLapNorris) norris += 21.5; // Pit stop in-lap

    // Verstappen (P2 pace)
    let verstappen = baseLapTime - 0.1 + (lap % 20) * 0.06 + (Math.random() - 0.5) * 0.25;
    if (lap === pitLapVerstappen) verstappen += 21.8;

    // Leclerc (P3 pace)
    let leclerc = baseLapTime + 0.1 + (lap % 21) * 0.05 + (Math.random() - 0.5) * 0.2;
    if (lap === pitLapLeclerc1 || lap === pitLapLeclerc2) leclerc += 22.0;

    data.push({
      lap,
      norris: Number(norris.toFixed(3)),
      verstappen: Number(verstappen.toFixed(3)),
      leclerc: Number(leclerc.toFixed(3)),
    });
  }
  return data;
}

export default function LapsProPage() {
  const { selectedGP } = useGP();

  const lapsData = useMemo(
    () => generateRaceLaps(selectedGP.totalLaps, selectedGP.baseLapTimeSeconds),
    [selectedGP.totalLaps, selectedGP.baseLapTimeSeconds]
  );

  const yMin = Math.floor(selectedGP.baseLapTimeSeconds - 2);
  const yMax = Math.ceil(selectedGP.baseLapTimeSeconds + 26);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Badge variant="racing" className="text-xs">RACE PACE METRICS</Badge>
          <ProBadge />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase flex items-center gap-2.5">
          <BarChart2 className="w-6 h-6 text-racing-cyan" />
          Lap-by-Lap Race Progression & Degradation
        </h1>
        <p className="text-xs text-zinc-400">
          Lap time consistency, pit out-lap deltas, and tyre drop-off across all {selectedGP.totalLaps} laps of the {selectedGP.name}.
        </p>
      </div>

      <Card className="border-zinc-800 bg-carbon-900 shadow-2xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-xl font-bold text-white">
                Race Lap Time Trajectory — {selectedGP.circuitName}
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Spikes indicate pit lane transit and out-lap tyre warmup penalties ({selectedGP.country}).
              </CardDescription>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-[#FF8000]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF8000]" /> NOR
              </span>
              <span className="flex items-center gap-1.5 text-[#3671C6]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3671C6]" /> VER
              </span>
              <span className="flex items-center gap-1.5 text-[#E80020]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E80020]" /> LEC
              </span>
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
                  formatter={(val: any) => [`${val}s`, "Lap Time"]}
                />
                <Line
                  type="monotone"
                  dataKey="norris"
                  name="L. Norris"
                  stroke="#FF8000"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="verstappen"
                  name="M. Verstappen"
                  stroke="#3671C6"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="leclerc"
                  name="C. Leclerc"
                  stroke="#E80020"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t border-zinc-800 text-xs font-mono">
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
              <span className="text-zinc-500 block text-[10px] uppercase">Base Pace Index</span>
              <span className="text-base font-bold text-white">{selectedGP.baseLapTimeSeconds.toFixed(1)}s</span>
              <span className="text-[10px] text-emerald-400 block">{selectedGP.circuitName}</span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
              <span className="text-zinc-500 block text-[10px] uppercase">Total Race Distance</span>
              <span className="text-base font-bold text-white">{((selectedGP.lapDistanceMeters * selectedGP.totalLaps) / 1000).toFixed(1)} km</span>
              <span className="text-[10px] text-zinc-400 block">{selectedGP.totalLaps} laps @ {selectedGP.lapDistanceMeters}m</span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
              <span className="text-zinc-500 block text-[10px] uppercase">Fuel Correction Pace</span>
              <span className="text-base font-bold text-white">-0.065s / lap</span>
              <span className="text-[10px] text-zinc-400 block">110kg Fuel Burn Rate</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
