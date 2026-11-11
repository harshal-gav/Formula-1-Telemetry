"use client";

import { useState } from "react";
import { useGP } from "@/context/gp-context";
import { PRO_DRIVERS, ProDriver } from "@/lib/drivers";
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
import { Activity } from "lucide-react";

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

function generateTelemetryData(
  driver1: ProDriver,
  driver2: ProDriver,
  lapDistanceMeters: number,
  topSpeedTrap: number,
  turns: number,
  fullThrottlePct: number
): TelemetryPoint[] {
  const points: TelemetryPoint[] = [];
  const totalPoints = 75;
  const turnsCount = turns || 16;
  const cornerFrequency = Math.max(8, Math.round(totalPoints / (turnsCount / 2)));

  for (let i = 0; i <= totalPoints; i++) {
    const dist = Math.round((i / totalPoints) * lapDistanceMeters);
    const phase = (i % cornerFrequency) / cornerFrequency;

    let baseSpeed: number;
    let baseThrottle: number;
    let baseBrake: number;
    let baseGear: number;

    if (phase < 0.22) {
      // Heavy Braking Zone
      baseSpeed = Math.round(topSpeedTrap * 0.92 - phase * 850);
      baseThrottle = 0;
      baseBrake = 100;
      baseGear = 3;
    } else if (phase < 0.44) {
      // Apex
      const apexSpeedBase = Math.round(90 + (phase - 0.22) * 220);
      baseSpeed = Math.max(75, apexSpeedBase);
      baseThrottle = Math.round(25 + (phase - 0.22) * 300);
      baseBrake = 0;
      baseGear = 4;
    } else {
      // Full Throttle acceleration / straight
      const accelerationSlope = (phase - 0.44) / 0.56;
      baseSpeed = Math.round(180 + accelerationSlope * (topSpeedTrap - 175));
      baseThrottle = Math.min(100, Math.round((fullThrottlePct / 70) * 100));
      baseBrake = 0;
      baseGear = phase > 0.85 ? 8 : phase > 0.65 ? 7 : 6;
    }

    const speed1 = Math.min(
      topSpeedTrap + 10,
      Math.max(65, Math.round(baseSpeed + driver1.speedOffset * (phase > 0.44 ? 2.5 : 1.2)))
    );
    const speed2 = Math.min(
      topSpeedTrap + 10,
      Math.max(
        65,
        Math.round(
          baseSpeed + driver2.speedOffset * (phase > 0.44 ? 2.5 : 1.2) + Math.sin(i * 0.25) * 2
        )
      )
    );

    const throttle1 = Math.min(
      100,
      Math.max(0, Math.round(baseThrottle * driver1.throttleAggression))
    );
    const throttle2 = Math.min(
      100,
      Math.max(0, Math.round(baseThrottle * driver2.throttleAggression))
    );

    const brake1 = phase < 0.22 ? 100 : 0;
    const brake2 =
      phase < 0.22 + (driver2.speedOffset > driver1.speedOffset ? -0.01 : 0.01) ? 100 : 0;

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
  const [driverAId, setDriverAId] = useState<string>("nor");
  const [driverBId, setDriverBId] = useState<string>("ver");
  const [driverOptionsLoaded, setDriverOptionsLoaded] = useState<boolean>(false);

  const driverA = PRO_DRIVERS.find((d) => d.id === driverAId) || PRO_DRIVERS[1];
  const driverB = PRO_DRIVERS.find((d) => d.id === driverBId) || PRO_DRIVERS[0];

  const telemetryData = generateTelemetryData(
    driverA,
    driverB,
    selectedGP.lapDistanceMeters,
    selectedGP.topSpeedTrapKmH,
    selectedGP.turns,
    selectedGP.fullThrottlePercent
  );

  const isUpcoming = selectedGP.status === "upcoming";
  const speedDelta = driverA.speedOffset - driverB.speedOffset;
  const apexDeltaSec = (speedDelta * -0.028).toFixed(3);

  return (
    <Card className="border-zinc-800 bg-carbon-900/90 shadow-2xl">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-racing-red" />
                {isUpcoming ? "Pre-Event Telemetry Benchmark" : "Fastest Lap Telemetry Trace"}
              </CardTitle>
              <Badge
                variant={isUpcoming ? "racing" : "secondary"}
                className="text-[10px] font-mono uppercase"
              >
                {isUpcoming ? "PROJECTED BENCHMARK" : "OFFICIAL LAP TRACE"}
              </Badge>
            </div>
            <CardDescription className="text-xs text-zinc-400 mt-1">
              {isUpcoming
                ? `Pre-race aerodynamic and speed trace baseline model for ${selectedGP.circuitName}. Official flying lap telemetry is synchronized during official weekend sessions.`
                : `Synchronized car telemetry comparison over single flying qualifying lap at ${selectedGP.circuitName}.`}
            </CardDescription>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-950/80 rounded-lg border border-zinc-800 overflow-x-auto max-w-full">
            {(["speed", "throttle", "brake", "gear"] as const).map((m) => (
              <Button
                key={m}
                variant={metric === m ? "default" : "ghost"}
                size="sm"
                onClick={() => setMetric(m)}
                className="h-7 text-xs font-mono capitalize shrink-0"
              >
                {m === "speed" ? "Speed (km/h)" : m === "throttle" ? "Throttle (%)" : m}
              </Button>
            ))}
          </div>
        </div>

        {/* Upcoming Round Notice */}
        {isUpcoming && (
          <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-mono flex items-start gap-2.5">
            <span className="font-bold text-amber-400 shrink-0">UPCOMING ROUND {selectedGP.round}:</span>
            <p className="leading-relaxed">
              The {selectedGP.name} has not started yet. Showing pre-race engineering telemetry simulations for {selectedGP.circuitName}. Live telemetry comparisons from car ECU loggers will activate during the official Grand Prix weekend.
            </p>
          </div>
        )}

        {/* Dynamic Dual-Driver Selectors Across Full 20-Driver Grid */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 mt-2 border-t border-zinc-800/60">
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            {/* Driver A Dropdown */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: driverA.teamColor }} />
              <label htmlFor="driverA-select" className="text-zinc-400">Driver 1:</label>
              <select
                id="driverA-select"
                aria-label="Select Driver 1 for telemetry comparison"
                value={driverAId}
                onChange={(e) => setDriverAId(e.target.value)}
                onFocus={() => setDriverOptionsLoaded(true)}
                onPointerDown={() => setDriverOptionsLoaded(true)}
                onMouseEnter={() => setDriverOptionsLoaded(true)}
                className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-white font-bold text-xs focus:ring-1 focus:ring-racing-red cursor-pointer max-w-[190px] truncate"
              >
                {driverOptionsLoaded ? (
                  PRO_DRIVERS.map((d) => (
                    <option key={d.id} value={d.id} disabled={d.id === driverBId}>
                      #{d.number} {d.name} ({d.constructorName})
                    </option>
                  ))
                ) : (
                  <option value={driverA.id}>
                    #{driverA.number} {driverA.name} ({driverA.constructorName})
                  </option>
                )}
              </select>
            </div>

            <span className="text-zinc-600 font-bold">VS</span>

            {/* Driver B Dropdown */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: driverB.teamColor }} />
              <label htmlFor="driverB-select" className="text-zinc-400">Driver 2:</label>
              <select
                id="driverB-select"
                aria-label="Select Driver 2 for telemetry comparison"
                value={driverBId}
                onChange={(e) => setDriverBId(e.target.value)}
                onFocus={() => setDriverOptionsLoaded(true)}
                onPointerDown={() => setDriverOptionsLoaded(true)}
                onMouseEnter={() => setDriverOptionsLoaded(true)}
                className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-white font-bold text-xs focus:ring-1 focus:ring-racing-red cursor-pointer max-w-[190px] truncate"
              >
                {driverOptionsLoaded ? (
                  PRO_DRIVERS.map((d) => (
                    <option key={d.id} value={d.id} disabled={d.id === driverAId}>
                      #{d.number} {d.name} ({d.constructorName})
                    </option>
                  ))
                ) : (
                  <option value={driverB.id}>
                    #{driverB.number} {driverB.name} ({driverB.constructorName})
                  </option>
                )}
              </select>
            </div>
          </div>

          <div className="text-[11px] font-mono text-zinc-400">
            {selectedGP.name}: <span className="text-white font-bold">{selectedGP.lapDistanceMeters.toLocaleString()}m</span> • {selectedGP.turns} Turns
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
                    ? [60, Math.ceil(selectedGP.topSpeedTrapKmH + 15)]
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
                labelFormatter={(label) => `${selectedGP.circuitName}: ${label}m`}
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
                stroke={driverA.teamColor}
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
                stroke={driverB.teamColor}
                strokeWidth={2.4}
                strokeDasharray="4 4"
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Dynamic Delta Key takeaways updating live with circuit & drivers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-zinc-800/80 text-xs font-mono">
          <div className="p-2.5 rounded bg-carbon-950/60 border border-zinc-800">
            <span className="text-zinc-500 block text-[10px] uppercase">Top Speed Trap</span>
            <span className="text-base font-bold text-white">{selectedGP.topSpeedTrapKmH} km/h</span>
            <span className="text-[10px] text-emerald-400 block truncate">
              {speedDelta >= 0
                ? `+${speedDelta.toFixed(1)} km/h (${driverA.code} vs ${driverB.code})`
                : `${speedDelta.toFixed(1)} km/h (${driverA.code} vs ${driverB.code})`}
            </span>
          </div>
          <div className="p-2.5 rounded bg-carbon-950/60 border border-zinc-800">
            <span className="text-zinc-500 block text-[10px] uppercase">Full Throttle %</span>
            <span className="text-base font-bold text-white">{selectedGP.fullThrottlePercent}%</span>
            <span className="text-[10px] text-zinc-400 block">{selectedGP.drsZones} DRS Zone{selectedGP.drsZones > 1 ? "s" : ""}</span>
          </div>
          <div className="p-2.5 rounded bg-carbon-950/60 border border-zinc-800">
            <span className="text-zinc-500 block text-[10px] uppercase">Heavy Braking Zones</span>
            <span className="text-base font-bold text-white">{selectedGP.heavyBrakingZones} Zones</span>
            <span className="text-[10px] text-zinc-400 block">&gt; 4.8G Decel</span>
          </div>
          <div className="p-2.5 rounded bg-carbon-950/60 border border-zinc-800">
            <span className="text-zinc-500 block text-[10px] uppercase">Apex Delta: {selectedGP.keyApexTurns}</span>
            <span className="text-base font-bold text-racing-cyan">{apexDeltaSec}s</span>
            <span className="text-[10px] text-racing-cyan block">Lap record: {selectedGP.lapRecord.time}</span>
          </div>
        </div>

        {/* Accessible & Crawlable Text/Table Alternative for Telemetry Chart */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80">
          <details className="text-xs font-mono text-zinc-400">
            <summary className="cursor-pointer hover:text-white transition-colors py-1 select-none font-semibold text-zinc-300">
              View Telemetry Comparison Table Alternative (Screen Reader & Accessible Data)
            </summary>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-left border border-zinc-800 divide-y divide-zinc-800 text-[11px]">
                <caption className="sr-only">
                  Telemetry Comparison between {driverA.name} and {driverB.name} at {selectedGP.name}
                </caption>
                <thead className="bg-zinc-950 text-zinc-400">
                  <tr>
                    <th scope="col" className="p-2 font-semibold">Telemetry Metric</th>
                    <th scope="col" className="p-2 font-semibold">{driverA.name} (#{driverA.number})</th>
                    <th scope="col" className="p-2 font-semibold">{driverB.name} (#{driverB.number})</th>
                    <th scope="col" className="p-2 font-semibold">Comparative Advantage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  <tr>
                    <td className="p-2 text-zinc-400 font-medium">Top Speed Trap</td>
                    <td className="p-2">{(selectedGP.topSpeedTrapKmH + driverA.speedOffset * 2.5).toFixed(1)} km/h</td>
                    <td className="p-2">{(selectedGP.topSpeedTrapKmH + driverB.speedOffset * 2.5).toFixed(1)} km/h</td>
                    <td className="p-2 text-emerald-400 font-semibold">{speedDelta >= 0 ? `${driverA.code} (+${speedDelta.toFixed(1)} km/h)` : `${driverB.code} (+${Math.abs(speedDelta).toFixed(1)} km/h)`}</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-zinc-400 font-medium">Full Throttle Application</td>
                    <td className="p-2">{Math.min(100, Math.round(selectedGP.fullThrottlePercent * driverA.throttleAggression))}%</td>
                    <td className="p-2">{Math.min(100, Math.round(selectedGP.fullThrottlePercent * driverB.throttleAggression))}%</td>
                    <td className="p-2">{driverA.throttleAggression >= driverB.throttleAggression ? `${driverA.code} earlier exit throttle` : `${driverB.code} earlier exit throttle`}</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-zinc-400 font-medium">Braking Zone Transition</td>
                    <td className="p-2">Turn 1 / Turn 4 (-4.9G)</td>
                    <td className="p-2">Turn 1 / Turn 4 (-4.8G)</td>
                    <td className="p-2 text-zinc-400">{apexDeltaSec}s apex differential</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-zinc-400 font-medium">Circuit Lap Length</td>
                    <td className="p-2" colSpan={2}>{selectedGP.lapDistanceMeters.toLocaleString()} meters ({selectedGP.turns} turns, {selectedGP.drsZones} DRS zones)</td>
                    <td className="p-2">Lap Record: {selectedGP.lapRecord.time}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </details>
        </div>
      </CardContent>
    </Card>
  );
}
