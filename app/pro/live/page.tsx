import type { Metadata } from "next";
import { LiveRaceTelemetry } from "@/components/pro/live-race-telemetry";

export const metadata: Metadata = {
  title: "Live Race Telemetry & Pit Wall Engineer Feed | Formula 1 Telemetry",
  description:
    "Real-time live Grand Prix race telemetry streaming across all 22 drivers and 11 teams. Speed, throttle, brake pressure, RPM tachometer, DRS, ERS battery, G-forces, and tyre thermals.",
};

export default function LiveRaceTelemetryPage() {
  return <LiveRaceTelemetry />;
}

