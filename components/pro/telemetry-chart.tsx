"use client";

import { useState } from "react";
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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gauge, Zap, Activity } from "lucide-react";

interface TelemetryPoint {
  distance: number; // meters from start line (0 to ~5300m)
  speed1: number;
  throttle1: number;
  brake1: number;
  gear1: number;
  speed2: number;
  throttle2: number;
  brake2: number;
  gear2: number;
}

// Generate realistic telemetry curves for a representative Grand Prix lap (e.g. Monza / Spa / Bahrain)
function generateSampleTelemetryData(): TelemetryPoint[] {
  const points: TelemetryPoint[] = [];
  const totalPoints = 60;

  for (let i = 0; i <= totalPoints; i++) {
    const dist = Math.round((i / totalPoints) * 5412);
    const phase = (i % 15) / 15;

    // Simulate braking zone, apex, and full acceleration
    let speed1: number;
    let throttle1: number;
    let brake1: number;
    let gear1: number;

    if (phase < 0.25) {
      // Heavy Braking
      speed1 = Math.round(320 - phase * 750);
      throttle1 = 0;
      brake1 = 100;
      gear1 = 3;
    } else if (phase < 0.45) {
      // Corner Apex
      speed1 = Math.round(110 + (phase - 0.25) * 200);
      throttle1 = Math.round(35 + (phase - 0.25) * 250);
      brake1 = 0;
      gear1 = 4;
    } else {
      // Straight Full Throttle
      speed1 = Math.round(180 + (phase - 0.45) * 260);
      throttle1 = 100;
      brake1 = 0;
      gear1 = phase > 0.8 ? 8 : 6;
    }

    // Driver 2 with slight braking offset / cornering delta
    const speed2 = Math.round(speed1 * (1 + (Math.sin(i * 0.4) * 0.04 - 0.015)));
    const throttle2 = Math.min(100, Math.max(0, Math.round(throttle1 * 0.95 + (Math.cos(i) > 0 ? 5 : 0))));
    const brake2 = phase < 0.22 ? 100 : 0;
    const gear2 = gear1;

    points.push({
      distance: dist,
      speed1: Math.min(345, Math.max(70, speed1)),
      throttle1,
      brake1,
      gear1,
      speed2: Math.min(345, Math.max(70, speed2)),
      throttle2,
      brake2,
      gear2,
    });
  }

  return points;
}

export function TelemetryChart() {
  const [metric, setMetric] = useState<"speed" | "throttle" | "brake" | "gear">("speed");
  const [driverA, setDriverA] = useState({ name: "L. Norris", number: 4, team: "McLaren", color: "#FF8000" });
  const [driverB, setDriverB] = useState({ name: "M. Verstappen", number: 1, team: "Red Bull", color: "#3671C6" });

  const telemetryData = generateSampleTelemetryData();

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
            <Button
              variant={metric === "speed" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMetric("speed")}
              className="h-7 text-xs font-mono"
            >
              Speed (km/h)
            </Button>
            <Button
              variant={metric === "throttle" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMetric("throttle")}
              className="h-7 text-xs font-mono"
            >
              Throttle (%)
            </Button>
            <Button
              variant={metric === "brake" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMetric("brake")}
              className="h-7 text-xs font-mono"
            >
              Brake
            </Button>
            <Button
              variant={metric === "gear" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMetric("gear")}
              className="h-7 text-xs font-mono"
            >
              Gear
            </Button>
          </div>
        </div>

        {/* Driver Comparison Legend */}
        <div className="flex items-center gap-6 pt-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: driverA.color }} />
            <span className="font-bold text-white">#{driverA.number} {driverA.name}</span>
            <span className="text-zinc-500">({driverA.team})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: driverB.color }} />
            <span className="font-bold text-white">#{driverB.number} {driverB.name}</span>
            <span className="text-zinc-500">({driverB.team})</span>
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
                    ? [60, 350]
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
                strokeWidth={2.2}
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
                strokeWidth={2.2}
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
            <span className="text-[10px] text-emerald-400 block">+2.1 km/h vs VER</span>
          </div>
          <div className="p-2.5 rounded bg-carbon-950/60 border border-zinc-800">
            <span className="text-zinc-500 block text-[10px] uppercase">Full Throttle %</span>
            <span className="text-base font-bold text-white">74.2%</span>
            <span className="text-[10px] text-zinc-400 block">Lap Average</span>
          </div>
          <div className="p-2.5 rounded bg-carbon-950/60 border border-zinc-800">
            <span className="text-zinc-500 block text-[10px] uppercase">Heavy Braking Zones</span>
            <span className="text-base font-bold text-white">4 Zones</span>
            <span className="text-[10px] text-zinc-400 block">&gt; 4.5G Peak Decel</span>
          </div>
          <div className="p-2.5 rounded bg-carbon-950/60 border border-zinc-800">
            <span className="text-zinc-500 block text-[10px] uppercase">Microsector Advantage</span>
            <span className="text-base font-bold text-racing-cyan">S2 Apex Exit</span>
            <span className="text-[10px] text-racing-cyan block">-0.082s delta</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

