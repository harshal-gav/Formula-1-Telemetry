"use client";

import { useState } from "react";
import { useGP } from "@/context/gp-context";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Gauge, Zap } from "lucide-react";

interface TelemetryPoint {
  distance: number;
  speed1: number;
  throttle1: number;
  brake1: number;
  gear1: number;
  speed2: number;
  throttle2: number;
  brake2: number;
  gear2: number;
}

const AVAILABLE_DRIVERS = [
  { id: "nor", name: "L. Norris", number: 4, team: "McLaren", color: "#FF8000", speedOffset: 2, throttleAggression: 1.02 },
  { id: "ver", name: "M. Verstappen", number: 1, team: "Red Bull", color: "#3671C6", speedOffset: 3, throttleAggression: 1.05 },
  { id: "lec", name: "C. Leclerc", number: 16, team: "Ferrari", color: "#E80020", speedOffset: 1, throttleAggression: 1.03 },
  { id: "rus", name: "G. Russell", number: 63, team: "Mercedes", color: "#27F4D2", speedOffset: -1, throttleAggression: 0.98 },
  { id: "pia", name: "O. Piastri", number: 81, team: "McLaren", color: "#FF8000", speedOffset: 1.5, throttleAggression: 1.0 },
  { id: "ham", name: "L. Hamilton", number: 44, team: "Ferrari", color: "#E80020", speedOffset: 0, throttleAggression: 0.99 },
  { id: "alo", name: "F. Alonso", number: 14, team: "Aston Martin", color: "#229971", speedOffset: -2, throttleAggression: 0.97 },
  { id: "sai", name: "C. Sainz", number: 55, team: "Williams", color: "#64C4FF", speedOffset: -3, throttleAggression: 0.96 },
];

function generateTelemetryData(
  driver1: typeof AVAILABLE_DRIVERS[0],
  driver2: typeof AVAILABLE_DRIVERS[0],
  lapDistanceMeters = 5412,
  topSpeedTrap = 338.4
): TelemetryPoint[] {
  const points: TelemetryPoint[] = [];
  const totalPoints = 65;

  for (let i = 0; i <= totalPoints; i++) {
    const dist = Math.round((i / totalPoints) * lapDistanceMeters);
    const phase = (i % 15) / 15;

    let baseSpeed: number;
    let baseThrottle: number;
    let baseBrake: number;
    let baseGear: number;

    if (phase < 0.25) {
      // Heavy Braking
      baseSpeed = Math.round((topSpeedTrap * 0.95) - phase * 750);
      baseThrottle = 0;
      baseBrake = 100;
      baseGear = 3;
    } else if (phase < 0.45) {
      // Corner Apex
      baseSpeed = Math.round(115 + (phase - 0.25) * 200);
      baseThrottle = Math.round(35 + (phase - 0.25) * 250);
      baseBrake = 0;
      baseGear = 4;
    } else {
      // Full Throttle Straight
      baseSpeed = Math.round(185 + (phase - 0.45) * 260);
      baseThrottle = 100;
      baseBrake = 0;
      baseGear = phase > 0.8 ? 8 : 6;
    }

    const speed1 = Math.min(topSpeedTrap + 8, Math.max(70, Math.round(baseSpeed + driver1.speedOffset * (phase > 0.45 ? 2 : 1))));
    const speed2 = Math.min(topSpeedTrap + 8, Math.max(70, Math.round(baseSpeed + driver2.speedOffset * (phase > 0.45 ? 2 : 1) + Math.sin(i * 0.3) * 3)));

    const throttle1 = Math.min(100, Math.max(0, Math.round(baseThrottle * driver1.throttleAggression)));
    const throttle2 = Math.min(100, Math.max(0, Math.round(baseThrottle * driver2.throttleAggression)));

    const brake1 = phase < 0.24 ? 100 : 0;
    const brake2 = phase < (0.24 + (driver2.speedOffset > driver1.speedOffset ? -0.01 : 0.01)) ? 100 : 0;

    points.push({
      distance: dist,
      speed1,
      throttle1,
      brake1,
      gear1: baseGear,
      speed2,
      throttle2,
      brake2,
      gear2: baseGear,
    });
  }

  return points;
}

export function TelemetryChart() {
  const { selectedGP } = useGP();
  const [metric, setMetric] = useState<"speed" | "throttle" | "brake" | "gear">("speed");
  const [driverAId, setDriverAId] = useState("nor");
  const [driverBId, setDriverBId] = useState("ver");

  const driverA = AVAILABLE_DRIVERS.find((d) => d.id === driverAId) || AVAILABLE_DRIVERS[0];
  const driverB = AVAILABLE_DRIVERS.find((d) => d.id === driverBId) || AVAILABLE_DRIVERS[1];

  const telemetryData = generateTelemetryData(
    driverA,
    driverB,
    selectedGP.lapDistanceMeters,
    selectedGP.topSpeedTrapKmH
  );

  return (
    <Card className="border-zinc-800 bg-carbon-900/90 shadow-2xl">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-racing-red" />
                Fastest Lap Telemetry Trace
              </CardTitle>
              <Badge variant="racing">OPENF1 SYNC</Badge>
            </div>
            <CardDescription className="text-xs text-zinc-400 mt-1">
              Synchronized car telemetry comparison over single flying qualifying lap.
            </CardDescription>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-950/80 rounded-lg border border-zinc-800">
            {(["speed", "throttle", "brake", "gear"] as const).map((m) => (
              <Button
                key={m}
                variant={metric === m ? "default" : "ghost"}
                size="sm"
                onClick={() => setMetric(m)}
                className="h-7 text-xs font-mono capitalize"
              >
                {m === "speed" ? "Speed (km/h)" : m === "throttle" ? "Throttle (%)" : m}
              </Button>
            ))}
          </div>
        </div>

        {/* Dynamic Dual-Driver Selectors */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 mt-2 border-t border-zinc-800/60">
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            {/* Driver A Dropdown */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: driverA.color }} />
              <span className="text-zinc-400">Driver 1:</span>
              <select
                value={driverAId}
                onChange={(e) => setDriverAId(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-white font-bold text-xs focus:ring-1 focus:ring-racing-red cursor-pointer"
              >
                {AVAILABLE_DRIVERS.map((d) => (
                  <option key={d.id} value={d.id} disabled={d.id === driverBId}>
                    #{d.number} {d.name} ({d.team})
                  </option>
                ))}
              </select>
            </div>

            <span className="text-zinc-600 font-bold">VS</span>

            {/* Driver B Dropdown */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: driverB.color }} />
              <span className="text-zinc-400">Driver 2:</span>
              <select
                value={driverBId}
                onChange={(e) => setDriverBId(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-white font-bold text-xs focus:ring-1 focus:ring-racing-red cursor-pointer"
              >
                {AVAILABLE_DRIVERS.map((d) => (
                  <option key={d.id} value={d.id} disabled={d.id === driverAId}>
                    #{d.number} {d.name} ({d.team})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-[11px] font-mono text-zinc-400">
            {selectedGP.name}: <span className="text-white font-bold">{selectedGP.lapDistanceMeters.toLocaleString()}m</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="w-full h-80 pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={telemetryData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#22273d" />
              <XAxis
                dataKey="distance"
                stroke="#64748b"
                fontSize={11}
                tickFormatter={(val) => `${val}m`}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                domain={
                  metric === "speed"
                    ? [60, 355]
                    : metric === "throttle" || metric === "brake"
                    ? [0, 100]
                    : [1, 8]
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0b0d14",
                  borderColor: "#27272a",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontFamily: "monospace",
                }}
                labelFormatter={(label) => `Lap Distance: ${label}m`}
              />
              <Line
                type="monotone"
                dataKey={
                  metric === "speed"
                    ? "speed1"
                    : metric === "throttle"
                    ? "throttle1"
                    : metric === "brake"
                    ? "brake1"
                    : "gear1"
                }
                name={`${driverA.name}`}
                stroke={driverA.color}
                strokeWidth={2.4}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey={
                  metric === "speed"
                    ? "speed2"
                    : metric === "throttle"
                    ? "throttle2"
                    : metric === "brake"
                    ? "brake2"
                    : "gear2"
                }
                name={`${driverB.name}`}
                stroke={driverB.color}
                strokeWidth={2.4}
                strokeDasharray="4 4"
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Delta Key takeaways */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-zinc-800/80 text-xs font-mono">
          <div className="p-2.5 rounded bg-carbon-950/60 border border-zinc-800">
            <span className="text-zinc-500 block text-[10px] uppercase">Top Speed Trap</span>
            <span className="text-base font-bold text-white">338.4 km/h</span>
            <span className="text-[10px] text-emerald-400 block">
              {driverA.speedOffset >= driverB.speedOffset ? `+${(driverA.speedOffset - driverB.speedOffset).toFixed(1)} km/h vs ${driverB.name}` : `-${(driverB.speedOffset - driverA.speedOffset).toFixed(1)} km/h vs ${driverB.name}`}
            </span>
          </div>
          <div className="p-2.5 rounded bg-carbon-950/60 border border-zinc-800">
            <span className="text-zinc-500 block text-[10px] uppercase">Full Throttle %</span>
            <span className="text-base font-bold text-white">74.2%</span>
            <span className="text-[10px] text-zinc-400 block">Flying Lap Average</span>
          </div>
          <div className="p-2.5 rounded bg-carbon-950/60 border border-zinc-800">
            <span className="text-zinc-500 block text-[10px] uppercase">Heavy Braking Zones</span>
            <span className="text-base font-bold text-white">4 Zones</span>
            <span className="text-[10px] text-zinc-400 block">&gt; 4.8G Peak Decel</span>
          </div>
          <div className="p-2.5 rounded bg-carbon-950/60 border border-zinc-800">
            <span className="text-zinc-500 block text-[10px] uppercase">Apex Speed Advantage</span>
            <span className="text-base font-bold text-racing-cyan">Turn 4 / Turn 11</span>
            <span className="text-[10px] text-racing-cyan block">-0.065s delta</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
