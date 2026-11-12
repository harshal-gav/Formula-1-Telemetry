"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useGP } from "@/context/gp-context";
import { PRO_DRIVERS, ProDriver } from "@/lib/drivers";
import { GRAND_PRIX_LIST, GrandPrixCircuit } from "@/lib/grand-prix";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProBadge } from "@/components/layout/pro-badge";
import {
  Activity,
  Play,
  Pause,
  RotateCcw,
  Gauge,
  Radio,
  Flame,
  Zap,
  Sliders,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Volume2,
  Clock,
  Thermometer,
  Wind,
  CloudRain,
  Compass,
  AlertTriangle,
  Layers,
  ArrowUpDown,
  Circle,
  Eye,
  Calendar,
  MapPin,
  CheckCircle2,
  Wrench,
  ShieldAlert,
  Car,
  Signal,
  Tv,
  Info,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

export type TrackStatus = "GREEN" | "YELLOW_S1" | "YELLOW_S2" | "YELLOW_S3" | "VSC" | "SC" | "RED";

export interface DriverLiveTelemetry {
  driver: ProDriver;
  position: number;
  gridStart: number;
  positionDelta: number;
  gapToLeader: number; // in seconds, 0 for leader
  interval: number; // in seconds to car ahead
  speed: number; // km/h
  topSpeedSession: number;
  rpm: number; // 0 to 13,000
  gear: number; // 1 to 8, 0 for N
  throttle: number; // 0 to 100%
  brake: number; // 0 to 100%
  drs: "DISABLED" | "DETECTED" | "ACTIVE";
  steeringAngle: number; // -180 to +180 deg
  lateralG: number; // -5.0 to +5.0
  longitudinalG: number; // -5.2 to +1.8
  currentLap: number;
  lastLapTime: string;
  bestLapTime: string;
  isFastestLap: boolean;
  sector1: { time: string; status: "purple" | "green" | "yellow" };
  sector2: { time: string; status: "purple" | "green" | "yellow" };
  sector3: { time: string; status: "purple" | "green" | "yellow" };
  currentSector: 1 | 2 | 3;
  trackProgress: number; // 0 to 100% of current lap
  tyreCompound: "SOFT" | "MEDIUM" | "HARD" | "INTERMEDIATE" | "WET";
  tyreAge: number; // in laps
  tyreWearPct: number; // 0 to 100% remaining
  tyreTemps: {
    fl: number;
    fr: number;
    rl: number;
    rr: number;
  };
  brakeTemps: {
    fl: number;
    fr: number;
    rl: number;
    rr: number;
  };
  ersBatteryPct: number; // 0 to 100%
  ersDeployKw: number; // 0 to 120 kW
  ersHarvestKw: number; // 0 to 100 kW
  puMode: string;
  pitStops: number;
  pitStatus: "ON_TRACK" | "PIT_IN" | "IN_PIT" | "PIT_OUT" | "BOX_THIS_LAP";
}

export interface TeamRadioMsg {
  id: string;
  time: string;
  driverCode: string;
  speaker: "ENGINEER" | "DRIVER";
  text: string;
  category: "STRATEGY" | "CAR_HEALTH" | "RACE_CONTROL" | "TACTICAL";
}

function formatLapSec(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = (seconds % 60).toFixed(3);
  return `${m}:${s.padStart(6, "0")}`;
}

export function LiveRaceTelemetry() {
  const { selectedGP, setSelectedGPId } = useGP();
  const [feedMode, setFeedMode] = useState<"LIVE_RADAR" | "SIMULATION_BENCH">("LIVE_RADAR");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<1 | 2 | 5>(1);
  const [trackStatus, setTrackStatus] = useState<TrackStatus>("GREEN");
  const [selectedDriverCode, setSelectedDriverCode] = useState<string>("ANT");
  const [compareDriverCode, setCompareDriverCode] = useState<string>("VER");
  const [activeTab, setActiveTab] = useState<"pitwall" | "tower" | "thermals" | "compare">("pitwall");
  const [raceElapsedSeconds, setRaceElapsedSeconds] = useState<number>(3845); // simulated race elapsed ~1h 4m
  const [currentRaceLap, setCurrentRaceLap] = useState<number>(37);

  // Next Upcoming Grand Prix & Live Countdown
  const nextUpcomingGP = useMemo(() => {
    return (
      GRAND_PRIX_LIST.find((gp) => gp.status === "upcoming" && gp.round > 0) ||
      GRAND_PRIX_LIST.find((gp) => gp.round === 21) ||
      GRAND_PRIX_LIST[0]
    );
  }, []);

  const [countdown, setCountdown] = useState<{ days: number; hours: number; mins: number; secs: number }>({
    days: 9,
    hours: 14,
    mins: 22,
    secs: 45,
  });

  useEffect(() => {
    const targetDate = new Date(`${nextUpcomingGP.date}T14:00:00Z`).getTime();
    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, targetDate - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / 1000 / 60) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      setCountdown({ days, hours, mins, secs });
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [nextUpcomingGP]);

  // Weather state
  const weather = useMemo(() => ({
    trackTemp: 39.8,
    airTemp: 28.2,
    humidity: 52,
    windSpeed: 14.2,
    windDirection: "WNW",
    rainRiskPct: 8,
  }), []);

  // Group all 22 drivers into their 11 constructor teams for pit lane garage allocation
  const teamAllocations = useMemo(() => {
    const teamsMap = new Map<string, {
      teamName: string;
      color: string;
      powerUnit: string;
      garageNumber: number;
      base: string;
      drivers: ProDriver[];
    }>();

    const teamMetadata: Record<string, { powerUnit: string; garageNumber: number; base: string }> = {
      mercedes: { powerUnit: "Mercedes-AMG F1 M17 E Performance", garageNumber: 1, base: "Brackley, UK" },
      red_bull: { powerUnit: "Red Bull Ford Powertrains DM01", garageNumber: 2, base: "Milton Keynes, UK" },
      ferrari: { powerUnit: "Ferrari 067/3 Hybrid", garageNumber: 3, base: "Maranello, Italy" },
      mclaren: { powerUnit: "Mercedes-AMG F1 M17 E Performance", garageNumber: 4, base: "Woking, UK" },
      rb: { powerUnit: "Red Bull Ford Powertrains DM01", garageNumber: 5, base: "Faenza, Italy" },
      alpine: { powerUnit: "Mercedes-AMG F1 M17 E Performance", garageNumber: 6, base: "Enstone, UK" },
      haas: { powerUnit: "Ferrari 067/3 Hybrid", garageNumber: 7, base: "Kannapolis, USA" },
      audi: { powerUnit: "Audi F1 Power Unit 2026", garageNumber: 8, base: "Neuburg / Hinwil" },
      aston_martin: { powerUnit: "Honda RA626H Hybrid", garageNumber: 9, base: "Silverstone, UK" },
      williams: { powerUnit: "Mercedes-AMG F1 M17 E Performance", garageNumber: 10, base: "Grove, UK" },
      cadillac: { powerUnit: "Ferrari Customer PU / GM Cadillac", garageNumber: 11, base: "Fishers, USA" },
    };

    PRO_DRIVERS.forEach((driver) => {
      const meta = teamMetadata[driver.constructorId] || { powerUnit: "F1 Turbo Hybrid", garageNumber: 12, base: "Factory" };
      if (!teamsMap.has(driver.constructorId)) {
        teamsMap.set(driver.constructorId, {
          teamName: driver.constructorName,
          color: driver.teamColor,
          powerUnit: meta.powerUnit,
          garageNumber: meta.garageNumber,
          base: meta.base,
          drivers: [driver],
        });
      } else {
        teamsMap.get(driver.constructorId)!.drivers.push(driver);
      }
    });

    return Array.from(teamsMap.values()).sort((a, b) => a.garageNumber - b.garageNumber);
  }, []);

  // Initialize all 22 drivers telemetry state (11 teams)
  const [driversTelemetry, setDriversTelemetry] = useState<DriverLiveTelemetry[]>(() => {
    const baseLap = selectedGP.baseLapTimeSeconds || 90.5;
    let runningGap = 0;

    return PRO_DRIVERS.map((driver, idx) => {
      const pos = idx + 1;
      const interval = pos === 1 ? 0 : Number((0.65 + (pos * 0.15) + Math.random() * 0.4).toFixed(3));
      runningGap += interval;

      const pBestSec = baseLap + (driver.speedOffset * -0.12) + (pos * 0.08);
      const lastLapSec = pBestSec + 0.35 + Math.random() * 0.4;
      const compound: "SOFT" | "MEDIUM" | "HARD" =
        pos <= 6 ? "MEDIUM" : pos <= 14 ? "HARD" : "SOFT";

      return {
        driver,
        position: pos,
        gridStart: (idx % 4 === 0 && pos > 1) ? pos - 1 : pos + (idx % 3 === 0 ? 1 : 0),
        positionDelta: (idx % 4 === 0 && pos > 1) ? 1 : idx % 3 === 0 ? -1 : 0,
        gapToLeader: pos === 1 ? 0 : Number(runningGap.toFixed(3)),
        interval: pos === 1 ? 0 : interval,
        speed: 284,
        topSpeedSession: Math.round(selectedGP.topSpeedTrapKmH - Math.random() * 5),
        rpm: 11800,
        gear: 7,
        throttle: 98,
        brake: 0,
        drs: pos > 1 && interval < 1.0 ? "DETECTED" : "DISABLED",
        steeringAngle: 2,
        lateralG: 1.2,
        longitudinalG: 0.8,
        currentLap: 37,
        lastLapTime: formatLapSec(lastLapSec),
        bestLapTime: formatLapSec(pBestSec),
        isFastestLap: pos === 1,
        sector1: { time: "28.412", status: pos === 1 ? "purple" : "green" },
        sector2: { time: "38.105", status: pos === 2 ? "purple" : "green" },
        sector3: { time: "24.280", status: "yellow" },
        currentSector: 2,
        trackProgress: 45 + (idx * 2) % 35,
        tyreCompound: compound,
        tyreAge: Math.max(4, 18 - Math.round(pos * 0.4)),
        tyreWearPct: Math.round(82 - (pos * 1.8)),
        tyreTemps: {
          fl: Math.round(98 + (idx % 3) * 3),
          fr: Math.round(102 + (idx % 2) * 4),
          rl: Math.round(99 + (idx % 4) * 2),
          rr: Math.round(101 + (idx % 2) * 3),
        },
        brakeTemps: {
          fl: 540,
          fr: 560,
          rl: 490,
          rr: 510,
        },
        ersBatteryPct: Math.round(68 + Math.random() * 20),
        ersDeployKw: 115,
        ersHarvestKw: 0,
        puMode: pos <= 3 ? "STRAT 2 (ATTACK)" : "STRAT 5 (BALANCED)",
        pitStops: pos > 12 ? 2 : 1,
        pitStatus: "ON_TRACK",
      };
    });
  });

  // Recent Live Telemetry Waveform History for selected driver
  const [telemetryStreamHistory, setTelemetryStreamHistory] = useState<Array<{
    timeSec: number;
    speed: number;
    throttle: number;
    brake: number;
    gear: number;
    rpm: number;
    compareSpeed: number;
    deltaSec: number;
  }>>([]);

  // Radio Transmissions Log
  const [radioFeed, setRadioFeed] = useState<TeamRadioMsg[]>([
    {
      id: "rad_1",
      time: "01:03:45",
      driverCode: "ANT",
      speaker: "ENGINEER",
      text: "Kimi, gap to Verstappen behind is 1.84s. Keep current tyre delta, pace is strong.",
      category: "TACTICAL",
    },
    {
      id: "rad_2",
      time: "01:04:12",
      driverCode: "VER",
      speaker: "DRIVER",
      text: "Front tyres starting to slide in Turn 4, need front flap adjust at the stop.",
      category: "CAR_HEALTH",
    },
    {
      id: "rad_3",
      time: "01:04:30",
      driverCode: "HAM",
      speaker: "ENGINEER",
      text: "Lewis, box box, confirm, boxing for hard compound tyres. Watch pit entry white line.",
      category: "STRATEGY",
    },
    {
      id: "rad_4",
      time: "01:04:55",
      driverCode: "NOR",
      speaker: "ENGINEER",
      text: "Lando, DRS is now enabled. Car ahead is within 0.8s, overtake button is available.",
      category: "TACTICAL",
    },
  ]);

  // Selected Driver Object
  const selectedDriver = useMemo(() => {
    return (
      driversTelemetry.find((d) => d.driver.code === selectedDriverCode) ||
      driversTelemetry[0]
    );
  }, [driversTelemetry, selectedDriverCode]);

  // Comparison Driver Object
  const compareDriver = useMemo(() => {
    return (
      driversTelemetry.find((d) => d.driver.code === compareDriverCode) ||
      driversTelemetry[1] ||
      driversTelemetry[0]
    );
  }, [driversTelemetry, compareDriverCode]);

  // Real-time Physics & Telemetry Stream Engine
  useEffect(() => {
    if (!isPlaying || feedMode !== "SIMULATION_BENCH") return;

    const intervalMs = Math.round(1000 / simSpeed);
    const timer = setInterval(() => {
      setRaceElapsedSeconds((prev) => prev + 1);

      setDriversTelemetry((prevDrivers) => {
        return prevDrivers.map((item, index) => {
          // Advance track progress
          const deltaProgress = 1.8 + Math.random() * 0.4;
          let newProgress = item.trackProgress + deltaProgress;
          let newLap = item.currentLap;

          if (newProgress >= 100) {
            newProgress = newProgress % 100;
            newLap += 1;
            if (index === 0) {
              setCurrentRaceLap(newLap);
            }
          }

          // Corner / Straight simulation based on track progress
          // 0-20% Straight, 20-35% Heavy Braking / Turn 1-3, 35-65% Mid sector, 65-80% Sweeper, 80-100% Main Straight
          let targetSpeed: number;
          let targetThrottle: number;
          let targetBrake: number;
          let targetGear: number;
          let targetRpm: number;
          let targetSteering: number;
          let targetLatG: number;
          let targetLongG: number;
          let drsState: "DISABLED" | "DETECTED" | "ACTIVE" = "DISABLED";

          const topSpeed = selectedGP.topSpeedTrapKmH || 330;

          if (newProgress >= 85 || newProgress <= 15) {
            // High-speed main straight
            targetSpeed = Math.min(topSpeed, Math.round(290 + (newProgress > 85 ? (newProgress - 85) * 2.5 : 30 + newProgress * 2.2)));
            targetThrottle = 100;
            targetBrake = 0;
            targetGear = targetSpeed > 300 ? 8 : 7;
            targetRpm = Math.min(12800, Math.round(10500 + (targetSpeed - 280) * 40));
            targetSteering = Math.round((Math.random() - 0.5) * 4);
            targetLatG = Number(((Math.random() - 0.5) * 0.4).toFixed(2));
            targetLongG = Number((0.8 + Math.random() * 0.5).toFixed(2));
            if (item.position > 1 && item.interval < 1.0) {
              drsState = "ACTIVE";
            }
          } else if (newProgress > 15 && newProgress <= 28) {
            // Heavy braking zone Turn 1
            const brakePhase = (newProgress - 15) / 13;
            targetSpeed = Math.max(78, Math.round(315 - brakePhase * 230));
            targetThrottle = brakePhase > 0.7 ? Math.round((brakePhase - 0.7) * 150) : 0;
            targetBrake = brakePhase < 0.6 ? 100 : Math.round((1 - brakePhase) * 100);
            targetGear = targetSpeed < 100 ? 2 : targetSpeed < 160 ? 3 : 5;
            targetRpm = Math.round(9200 + (targetSpeed % 40) * 70);
            targetSteering = Math.round(65 * Math.sin(brakePhase * Math.PI));
            targetLatG = Number((2.8 * Math.sin(brakePhase * Math.PI)).toFixed(2));
            targetLongG = Number((-4.8 * (1 - brakePhase * 0.5)).toFixed(2));
          } else if (newProgress > 28 && newProgress <= 55) {
            // Technical sector 2: medium corners & chicanes
            const midPhase = (newProgress - 28) / 27;
            targetSpeed = Math.round(140 + Math.sin(midPhase * 6) * 75);
            targetThrottle = targetSpeed > 170 ? 85 : 45;
            targetBrake = targetSpeed < 120 ? 60 : 0;
            targetGear = targetSpeed < 130 ? 3 : targetSpeed < 185 ? 4 : 5;
            targetRpm = Math.round(10200 + (targetSpeed % 35) * 60);
            targetSteering = Math.round(Math.cos(midPhase * 8) * 85);
            targetLatG = Number((Math.sin(midPhase * 8) * 3.8).toFixed(2));
            targetLongG = Number((Math.cos(midPhase * 8) * 1.5).toFixed(2));
          } else {
            // High-speed sweepers & DRS zone 2
            const sweepPhase = (newProgress - 55) / 30;
            targetSpeed = Math.round(230 + sweepPhase * 60);
            targetThrottle = 95;
            targetBrake = 0;
            targetGear = targetSpeed > 260 ? 7 : 6;
            targetRpm = Math.round(11200 + (targetSpeed - 230) * 30);
            targetSteering = Math.round(Math.sin(sweepPhase * 3) * 28);
            targetLatG = Number((Math.sin(sweepPhase * 3) * 4.4).toFixed(2));
            targetLongG = Number((0.5 + Math.random() * 0.4).toFixed(2));
          }

          // Brake thermals rise during heavy braking, cool on straights
          const brakeHeatDelta = targetBrake > 50 ? 45 : -8;
          const currentFLBrake = Math.min(1020, Math.max(380, item.brakeTemps.fl + brakeHeatDelta));
          const currentFRBrake = Math.min(1040, Math.max(390, item.brakeTemps.fr + brakeHeatDelta + (targetSteering > 0 ? 15 : -10)));

          // Tyre thermals respond to lateral load
          const tyreHeatDelta = Math.abs(targetLatG) > 3.0 ? 1.5 : -0.4;
          const currentFLTyre = Math.min(125, Math.max(88, Number((item.tyreTemps.fl + tyreHeatDelta).toFixed(1))));
          const currentFRTyre = Math.min(128, Math.max(89, Number((item.tyreTemps.fr + tyreHeatDelta + 0.2).toFixed(1))));

          // ERS deploy / harvest
          const ersDeploy = targetThrottle > 80 ? 120 : targetThrottle > 40 ? 60 : 0;
          const ersHarvest = targetBrake > 40 ? 95 : 0;
          const ersBatteryDelta = ersHarvest > 0 ? 0.3 : ersDeploy > 80 ? -0.4 : 0;
          const newBattery = Math.min(100, Math.max(12, Number((item.ersBatteryPct + ersBatteryDelta).toFixed(1))));

          return {
            ...item,
            currentLap: newLap,
            trackProgress: newProgress,
            currentSector: newProgress < 33 ? 1 : newProgress < 66 ? 2 : 3,
            speed: targetSpeed,
            throttle: targetThrottle,
            brake: targetBrake,
            gear: targetGear,
            rpm: targetRpm,
            steeringAngle: targetSteering,
            lateralG: targetLatG,
            longitudinalG: targetLongG,
            drs: drsState,
            tyreTemps: {
              ...item.tyreTemps,
              fl: currentFLTyre,
              fr: currentFRTyre,
            },
            brakeTemps: {
              ...item.brakeTemps,
              fl: currentFLBrake,
              fr: currentFRBrake,
              rl: Math.round(currentFLBrake * 0.85),
              rr: Math.round(currentFRBrake * 0.85),
            },
            ersBatteryPct: newBattery,
            ersDeployKw: ersDeploy,
            ersHarvestKw: ersHarvest,
          };
        });
      });

      // Append data point to scrolling waveform history
      setTelemetryStreamHistory((prevHistory) => {
        const sel = driversTelemetry.find((d) => d.driver.code === selectedDriverCode) || driversTelemetry[0];
        const cmp = driversTelemetry.find((d) => d.driver.code === compareDriverCode) || driversTelemetry[1] || sel;
        const speedDelta = sel.speed - cmp.speed;
        const newPoint = {
          timeSec: raceElapsedSeconds % 100,
          speed: sel.speed,
          throttle: sel.throttle,
          brake: sel.brake,
          gear: sel.gear,
          rpm: sel.rpm,
          compareSpeed: cmp.speed,
          deltaSec: Number((speedDelta * -0.003).toFixed(3)),
        };
        const updated = [...prevHistory, newPoint];
        return updated.slice(-35); // Keep trailing 35 data points
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, feedMode, simSpeed, selectedGP, selectedDriverCode, compareDriverCode, raceElapsedSeconds, driversTelemetry]);

  // Occasional automated radio calls (only in simulation mode)
  useEffect(() => {
    if (!isPlaying || feedMode !== "SIMULATION_BENCH") return;
    const radioTimer = setInterval(() => {
      const candidates: Array<{ code: string; text: string; cat: "STRATEGY" | "CAR_HEALTH" | "TACTICAL" }> = [
        { code: "ANT", text: "Tyres in the optimum window. Maintain 1:31.4 target pace.", cat: "TACTICAL" },
        { code: "VER", text: "Understood, car feels balanced on exit. Pushing to close gap.", cat: "TACTICAL" },
        { code: "HAM", text: "Confirming pit window open next lap. Softs are pre-heated.", cat: "STRATEGY" },
        { code: "LEC", text: "Brake bias 54% into Turn 1, watch the tailwind on apex.", cat: "CAR_HEALTH" },
        { code: "NOR", text: "Recharge mode for 2 laps, prepare for undercut attempt.", cat: "STRATEGY" },
        { code: "PIA", text: "Track temperature up 1.5°C, managing rear degradation.", cat: "CAR_HEALTH" },
      ];
      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      const nowClock = new Date(Date.now()).toTimeString().split(" ")[0];
      setRadioFeed((prev) => [
        {
          id: `rad_${Date.now()}`,
          time: nowClock,
          driverCode: pick.code,
          speaker: Math.random() > 0.4 ? "ENGINEER" : "DRIVER",
          text: pick.text,
          category: pick.cat,
        },
        ...prev.slice(0, 6),
      ]);
    }, 14000);

    return () => clearInterval(radioTimer);
  }, [isPlaying, feedMode]);

  // Shift LED indicators for F1 wheel array (15 LEDs)
  const shiftLeds = useMemo(() => {
    const rpm = selectedDriver.rpm;
    // 10,000 to 12,800 RPM scale
    const pct = Math.max(0, Math.min(1, (rpm - 9800) / 3000));
    const activeCount = Math.round(pct * 15);
    return Array.from({ length: 15 }).map((_, i) => {
      const isActive = i < activeCount;
      let colorClass = "bg-zinc-800";
      if (isActive) {
        if (i < 5) colorClass = "bg-emerald-500 shadow-emerald-500/50";
        else if (i < 10) colorClass = "bg-amber-400 shadow-amber-400/50";
        else if (i < 14) colorClass = "bg-red-500 shadow-red-500/50";
        else colorClass = "bg-purple-400 shadow-purple-400/50 animate-pulse";
      }
      return { index: i, isActive, colorClass };
    });
  }, [selectedDriver.rpm]);

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* 0. TELEMETRY UPLINK MODE SELECTOR */}
      <div className="rounded-2xl border border-zinc-800 bg-carbon-900/95 p-4 sm:p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-xl border ${
                feedMode === "LIVE_RADAR"
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  : "bg-red-500/10 border-red-500/30 text-racing-red"
              }`}
            >
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                  Telemetry Uplink Mode:
                </span>
                <Badge
                  variant={feedMode === "LIVE_RADAR" ? "outline" : "destructive"}
                  className="font-mono text-[11px] uppercase"
                >
                  {feedMode === "LIVE_RADAR" ? "Live Track Radar (Real-World)" : "Race Engineer Simulation Bench"}
                </Badge>
                <ProBadge />
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {feedMode === "LIVE_RADAR"
                  ? "Real-time FIA circuit radar status. Transponders on standby between official Grand Prix sessions."
                  : "Active 10Hz engineer sensor telemetry playback streaming across all 22 cars and 11 teams."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-carbon-950 p-1.5 rounded-xl border border-zinc-800 self-start md:self-auto">
            <button
              onClick={() => setFeedMode("LIVE_RADAR")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                feedMode === "LIVE_RADAR"
                  ? "bg-zinc-800 text-white shadow-md border border-zinc-700"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Circle
                className={`w-2 h-2 rounded-full ${
                  feedMode === "LIVE_RADAR" ? "fill-amber-400 text-amber-400" : "fill-zinc-600 text-zinc-600"
                }`}
              />
              <span>Real-Time Track Radar</span>
            </button>

            <button
              onClick={() => setFeedMode("SIMULATION_BENCH")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                feedMode === "SIMULATION_BENCH"
                  ? "bg-racing-red text-white shadow-lg shadow-racing-red/40"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Simulation Bench (10Hz)</span>
            </button>
          </div>
        </div>
      </div>

      {feedMode === "LIVE_RADAR" ? (
        <div className="space-y-6">
          {/* A. REAL-TIME TRACK STATUS & COUNTDOWN HERO */}
          <div className="rounded-2xl border border-zinc-800 bg-carbon-900/90 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/40 text-xs font-mono font-bold text-red-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    TRACK STATUS: RED • SESSION INACTIVE
                  </span>
                  <Badge variant="outline" className="text-xs font-mono text-zinc-400 border-zinc-800">
                    FIA PARC FERMÉ PROTOCOL
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                    No Live Grand Prix Session In Progress
                  </h2>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Formula 1 cars only stream live telemetry to FIA timing loops during official Grand Prix session windows
                    (Free Practice 1/2/3, Qualifying, Sprint, and Sunday Race). Currently, all 22 cars are powered down in parc
                    fermé between championship rounds.
                  </p>
                </div>

                {/* Calendar positioning explanation */}
                <div className="p-4 rounded-xl bg-carbon-950 border border-zinc-800/80 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between text-zinc-400 pb-1 border-b border-zinc-800">
                    <span className="flex items-center gap-1.5 text-zinc-300 font-bold">
                      <Calendar className="w-3.5 h-3.5 text-racing-red" /> 2026 FIA Calendar Positioning
                    </span>
                    <span className="text-[11px] text-zinc-500">Official FIA Schedule</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-[10px] text-zinc-500 block uppercase">Most Recent Round:</span>
                      <span className="text-zinc-200 font-bold">Round 20 • São Paulo GP (Interlagos)</span>
                      <span className="text-[10px] text-emerald-400 block">Status: Concluded (Nov 08, 2026)</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 block uppercase">Next Scheduled Session:</span>
                      <span className="text-white font-bold">Round 21 • {nextUpcomingGP.name}</span>
                      <span className="text-[10px] text-amber-400 block">Status: Starting in {countdown.days}d {countdown.hours}h</span>
                    </div>
                  </div>
                </div>

                {/* Quick CTA to launch simulation */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Button
                    onClick={() => setFeedMode("SIMULATION_BENCH")}
                    className="bg-racing-red hover:bg-red-700 text-white font-mono font-bold text-xs gap-2 px-5 py-2.5 h-auto shadow-lg shadow-racing-red/25"
                  >
                    <Zap className="w-4 h-4" />
                    <span>LAUNCH RACE ENGINEER SIMULATION BENCH</span>
                  </Button>
                  <span className="text-xs text-zinc-500 font-mono">
                    Instant 10Hz telemetry test bench for all 22 cars
                  </span>
                </div>
              </div>

              {/* Countdown Clock Box */}
              <div className="lg:col-span-5 bg-carbon-950/90 rounded-2xl border border-zinc-800 p-6 space-y-5 text-center relative overflow-hidden">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 flex items-center justify-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Countdown to Next Grand Prix Session
                  </span>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">
                    {nextUpcomingGP.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-racing-red" />
                    <span>{nextUpcomingGP.circuitName} ({nextUpcomingGP.country})</span>
                  </div>
                </div>

                {/* 4-digit countdown timer */}
                <div className="grid grid-cols-4 gap-2 font-mono">
                  <div className="p-3 rounded-xl bg-carbon-900 border border-zinc-800">
                    <span className="text-2xl sm:text-3xl font-black text-white block">
                      {countdown.days.toString().padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Days</span>
                  </div>
                  <div className="p-3 rounded-xl bg-carbon-900 border border-zinc-800">
                    <span className="text-2xl sm:text-3xl font-black text-white block">
                      {countdown.hours.toString().padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Hours</span>
                  </div>
                  <div className="p-3 rounded-xl bg-carbon-900 border border-zinc-800">
                    <span className="text-2xl sm:text-3xl font-black text-white block">
                      {countdown.mins.toString().padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Mins</span>
                  </div>
                  <div className="p-3 rounded-xl bg-carbon-900 border border-zinc-800">
                    <span className="text-2xl sm:text-3xl font-black text-racing-red block animate-pulse">
                      {countdown.secs.toString().padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Secs</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>Scheduled Date:</span>
                  <span className="font-bold text-zinc-200">{nextUpcomingGP.date}</span>
                </div>
              </div>
            </div>
          </div>

          {/* B. SENSOR RADAR & PIT WALL DIAGNOSTICS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-carbon-900 border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] uppercase">
                <Signal className="w-3.5 h-3.5 text-amber-400" />
                <span>FOM Telemetry Stream</span>
              </div>
              <span className="text-sm font-bold text-amber-400 block">STANDBY (0 / 22 DETECTED)</span>
              <span className="text-[10px] text-zinc-500 block">Parc Fermé RF Interlock Active</span>
            </div>

            <div className="p-4 rounded-xl bg-carbon-900 border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] uppercase">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sector Timing Loops</span>
              </div>
              <span className="text-sm font-bold text-emerald-400 block">CALIBRATED & ARMED</span>
              <span className="text-[10px] text-zinc-500 block">S1, S2, S3 loops verified</span>
            </div>

            <div className="p-4 rounded-xl bg-carbon-900 border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] uppercase">
                <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                <span>Circuit Conditions</span>
              </div>
              <span className="text-sm font-bold text-zinc-200 block">18°C TRACK • 13°C AIR</span>
              <span className="text-[10px] text-zinc-500 block">Night conditions / 0% Rain</span>
            </div>

            <div className="p-4 rounded-xl bg-carbon-900 border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] uppercase">
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                <span>FIA Race Control</span>
              </div>
              <span className="text-sm font-bold text-zinc-200 block">MARSHALS STANDDOWN</span>
              <span className="text-[10px] text-zinc-500 block">Track curfew in effect</span>
            </div>
          </div>

          {/* C. 2026 OFFICIAL PIT LANE GARAGE RADAR (ALL 11 TEAMS & 22 CARS) */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <Car className="w-5 h-5 text-racing-red" />
                  <span>2026 Pit Lane Garage Allocation • 11 Teams & 22 Active Cars</span>
                </h3>
                <p className="text-xs text-zinc-400 font-mono">
                  All 22 cars are currently allocated to their pit garages. Click any car to launch telemetry simulation on that driver.
                </p>
              </div>
              <Badge variant="outline" className="font-mono text-xs self-start sm:self-auto">
                22 / 22 CARS REGISTERED
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamAllocations.map((team) => (
                <div
                  key={team.teamName}
                  className="rounded-xl border border-zinc-800 bg-carbon-900 p-4 space-y-3 relative overflow-hidden hover:border-zinc-700 transition-all"
                >
                  <div
                    className="absolute top-0 left-0 w-1.5 h-full"
                    style={{ backgroundColor: team.color }}
                  />

                  <div className="flex items-center justify-between pl-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono uppercase text-zinc-500">
                        Garage #{team.garageNumber} • {team.base}
                      </span>
                      <h4 className="text-sm font-black text-white">{team.teamName}</h4>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono text-zinc-400 border-zinc-800">
                      GARAGE
                    </Badge>
                  </div>

                  <div className="pl-2 space-y-1 text-[11px] font-mono text-zinc-400">
                    <div className="text-[10px] text-zinc-500 truncate">
                      PU: <span className="text-zinc-300 font-bold">{team.powerUnit}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pl-2 pt-1 border-t border-zinc-800/80">
                    {team.drivers.map((drv) => (
                      <button
                        key={drv.id}
                        onClick={() => {
                          setSelectedDriverCode(drv.code);
                          setFeedMode("SIMULATION_BENCH");
                        }}
                        className="p-2 rounded-lg bg-carbon-950 border border-zinc-800 hover:border-racing-red/50 text-left transition-all group"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mb-0.5">
                          <span className="font-bold text-white group-hover:text-racing-red transition-colors">
                            #{drv.number}
                          </span>
                          <span className="text-[9px] uppercase">{drv.country.slice(0, 3)}</span>
                        </div>
                        <div className="text-xs font-bold text-zinc-200 truncate group-hover:text-white">
                          {drv.name}
                        </div>
                        <div className="text-[9px] text-zinc-500 font-mono mt-0.5">
                          {drv.seasonPoints} PTS • WINS: {drv.wins}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* SIMULATION BENCH NOTIFICATION BANNER */}
          <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-racing-red">
              <Zap className="w-4 h-4 animate-pulse" />
              <span className="font-bold">
                SIMULATION BENCH ACTIVE: 10Hz live sensor telemetry streaming for 22 cars across 11 teams.
              </span>
            </div>
            <button
              onClick={() => setFeedMode("LIVE_RADAR")}
              className="text-zinc-400 hover:text-white underline text-left sm:text-right transition-colors"
            >
              ← Return to Real-Time Track Radar
            </button>
          </div>

          {/* 1. TOP LIVE SESSION COCKPIT HEADER */}
          <div className="rounded-2xl border border-zinc-800 bg-carbon-900/95 p-4 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 w-96 h-96 bg-racing-red/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-[11px] font-mono font-bold text-racing-red animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-racing-red" />
                    LIVE RACE TELEMETRY • 10Hz SENSOR STREAM
                  </span>
                  <ProBadge />
                  <Badge variant="outline" className="text-xs font-mono">
                    ROUND {selectedGP.round}: {selectedGP.name.toUpperCase()}
                  </Badge>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase flex items-center gap-2">
                  <Radio className="w-7 h-7 text-racing-red" />
                  <span>Pit Wall Race Engineer Telemetry</span>
                </h1>
                <p className="text-xs text-zinc-400">
                  Live telemetry streaming directly from 300+ onboard car sensors across all 22 drivers and 11 teams.
                </p>
              </div>

          {/* Circuit Dropdown & Session Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedGP.id}
              onChange={(e) => setSelectedGPId(e.target.value)}
              className="bg-carbon-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-racing-red cursor-pointer"
            >
              {GRAND_PRIX_LIST.filter((g) => g.round > 0).map((gp) => (
                <option key={gp.id} value={gp.id}>
                  R{gp.round} • {gp.name} ({gp.circuitName})
                </option>
              ))}
            </select>

            {/* Play/Pause & Speed Buttons */}
            <div className="flex items-center gap-1 bg-carbon-950 p-1 rounded-lg border border-zinc-800">
              <Button
                variant={isPlaying ? "destructive" : "secondary"}
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="h-7 px-2.5 text-xs font-mono font-bold gap-1"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? "PAUSE FEED" : "RESUME"}</span>
              </Button>

              {[1, 2, 5].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setSimSpeed(spd as 1 | 2 | 5)}
                  className={`h-7 px-2 rounded text-[11px] font-mono font-bold transition-colors ${
                    simSpeed === spd
                      ? "bg-zinc-800 text-white border border-zinc-700"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Race Telemetry Status Bar: Flags, Weather, Lap Counter */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-4 text-xs font-mono">
          {/* Race Flag Status */}
          <div className="p-2.5 rounded-lg bg-carbon-950 border border-zinc-800/80 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase block">Track Flag Status</span>
            <div className="flex items-center gap-1.5 font-bold">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  trackStatus === "GREEN"
                    ? "bg-emerald-400 animate-pulse"
                    : trackStatus.startsWith("YELLOW")
                    ? "bg-amber-400 animate-ping"
                    : trackStatus === "RED"
                    ? "bg-red-500"
                    : "bg-amber-500"
                }`}
              />
              <span
                className={
                  trackStatus === "GREEN"
                    ? "text-emerald-400"
                    : trackStatus.startsWith("YELLOW")
                    ? "text-amber-400"
                    : "text-red-400"
                }
              >
                {trackStatus === "GREEN" ? "TRACK CLEAR (GREEN)" : trackStatus}
              </span>
            </div>
          </div>

          {/* Current Lap Counter */}
          <div className="p-2.5 rounded-lg bg-carbon-950 border border-zinc-800/80 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase block">Grand Prix Lap</span>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-extrabold text-white">LAP {currentRaceLap}</span>
              <span className="text-zinc-500 text-[11px]">/ {selectedGP.totalLaps}</span>
            </div>
          </div>

          {/* Track Surface Temperature */}
          <div className="p-2.5 rounded-lg bg-carbon-950 border border-zinc-800/80 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase block flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-amber-400" /> Track Temp
            </span>
            <span className="text-base font-bold text-amber-400">{weather.trackTemp}°C</span>
          </div>

          {/* Ambient Air Temp & Humidity */}
          <div className="p-2.5 rounded-lg bg-carbon-950 border border-zinc-800/80 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase block flex items-center gap-1">
              <Wind className="w-3 h-3 text-cyan-400" /> Air / Wind
            </span>
            <span className="text-zinc-200 font-bold">
              {weather.airTemp}°C • {weather.windSpeed} km/h {weather.windDirection}
            </span>
          </div>

          {/* Rain Probability */}
          <div className="p-2.5 rounded-lg bg-carbon-950 border border-zinc-800/80 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase block flex items-center gap-1">
              <CloudRain className="w-3 h-3 text-blue-400" /> Rain Risk
            </span>
            <span className="text-emerald-400 font-bold">{weather.rainRiskPct}% (DRY)</span>
          </div>

          {/* Race Clock Elapsed */}
          <div className="p-2.5 rounded-lg bg-carbon-950 border border-zinc-800/80 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase block flex items-center gap-1">
              <Clock className="w-3 h-3 text-zinc-400" /> Session Elapsed
            </span>
            <span className="text-white font-bold">
              {Math.floor(raceElapsedSeconds / 3600).toString().padStart(2, "0")}:
              {Math.floor((raceElapsedSeconds % 3600) / 60).toString().padStart(2, "0")}:
              {(raceElapsedSeconds % 60).toString().padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* 2. RACE ENGINEER VIEW SELECTOR TABS */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("pitwall")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === "pitwall"
                ? "bg-racing-red text-white shadow-lg shadow-racing-red/30"
                : "bg-carbon-900 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>Telemetry Pit Wall</span>
          </button>

          <button
            onClick={() => setActiveTab("tower")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === "tower"
                ? "bg-racing-red text-white shadow-lg shadow-racing-red/30"
                : "bg-carbon-900 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>22-Driver Timing Tower (11 Teams)</span>
          </button>

          <button
            onClick={() => setActiveTab("thermals")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === "thermals"
                ? "bg-racing-red text-white shadow-lg shadow-racing-red/30"
                : "bg-carbon-900 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>4-Corner Thermals & ERS</span>
          </button>

          <button
            onClick={() => setActiveTab("compare")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === "compare"
                ? "bg-racing-red text-white shadow-lg shadow-racing-red/30"
                : "bg-carbon-900 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Head-to-Head Driver Overlay</span>
          </button>
        </div>

        {/* Selected Driver Switcher Pill */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-zinc-500 uppercase text-[10px]">Monitored Car:</span>
          <select
            value={selectedDriverCode}
            onChange={(e) => setSelectedDriverCode(e.target.value)}
            className="bg-carbon-900 border border-zinc-700 rounded px-2.5 py-1 text-xs font-bold text-white cursor-pointer focus:outline-none focus:border-racing-red"
          >
            {driversTelemetry.map((d) => (
              <option key={d.driver.code} value={d.driver.code}>
                P{d.position} • #{d.driver.number} {d.driver.name} ({d.driver.constructorName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. MAIN PIT WALL TELEMETRY VIEW */}
      {activeTab === "pitwall" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT 2 COLS: INSTRUMENTATION & WAVEFORM TELEMETRY */}
          <div className="lg:col-span-2 space-y-6">
            {/* A. DIGITAL STEERING COCKPIT & GAUGES */}
            <Card className="border-zinc-800 bg-carbon-900/90 shadow-2xl relative overflow-hidden">
              <CardHeader className="pb-3 border-b border-zinc-800/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-8 rounded-full"
                      style={{ backgroundColor: selectedDriver.driver.teamColor }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-white">
                          #{selectedDriver.driver.number} {selectedDriver.driver.name.toUpperCase()}
                        </span>
                        <Badge variant="outline" className="font-mono text-[10px]">
                          P{selectedDriver.position}
                        </Badge>
                      </div>
                      <span className="text-xs text-zinc-400 font-mono">
                        {selectedDriver.driver.constructorName} • {selectedDriver.puMode}
                      </span>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-[10px] text-zinc-500 uppercase block">Top Speed Recorded</span>
                    <span className="text-sm font-bold text-amber-400">
                      {selectedDriver.topSpeedSession} km/h
                    </span>
                  </div>
                </div>

                {/* F1 15-LED Shift Light Array */}
                <div className="pt-4 space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                    <span>ENGINE TACHOMETER (RPM)</span>
                    <span className="text-zinc-300 font-bold">{selectedDriver.rpm.toLocaleString()} RPM</span>
                  </div>
                  <div className="grid grid-cols-15 gap-1.5 p-2 rounded-xl bg-carbon-950 border border-zinc-800/80">
                    {shiftLeds.map((led) => (
                      <div
                        key={led.index}
                        className={`h-3 rounded-sm transition-all duration-75 shadow-sm ${led.colorClass}`}
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Main Gauge Dial Array: Speed, Gear, Throttle, Brake */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
                  {/* Speed km/h */}
                  <div className="p-4 rounded-xl bg-carbon-950 border border-zinc-800/80 relative overflow-hidden flex flex-col justify-between">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Ground Speed</span>
                    <div className="py-2">
                      <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                        {selectedDriver.speed}
                      </span>
                      <span className="text-xs text-zinc-500 block">KM / H</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-racing-red h-full transition-all duration-150"
                        style={{ width: `${Math.min(100, (selectedDriver.speed / 350) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Gear Display */}
                  <div className="p-4 rounded-xl bg-carbon-950 border border-zinc-800/80 flex flex-col justify-between">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Current Gear</span>
                    <div className="py-2">
                      <span className="text-5xl sm:text-6xl font-black text-amber-400">
                        {selectedDriver.gear === 0 ? "N" : selectedDriver.gear}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-500 uppercase">Seamless Shift</span>
                  </div>

                  {/* Throttle % Meter */}
                  <div className="p-4 rounded-xl bg-carbon-950 border border-zinc-800/80 flex flex-col justify-between">
                    <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">Throttle</span>
                    <div className="py-2">
                      <span className="text-4xl sm:text-5xl font-black text-emerald-400">
                        {selectedDriver.throttle}%
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full transition-all duration-100"
                        style={{ width: `${selectedDriver.throttle}%` }}
                      />
                    </div>
                  </div>

                  {/* Brake Pressure % Meter */}
                  <div className="p-4 rounded-xl bg-carbon-950 border border-zinc-800/80 flex flex-col justify-between">
                    <span className="text-[10px] text-racing-red uppercase tracking-widest font-bold">Brake Pressure</span>
                    <div className="py-2">
                      <span className="text-4xl sm:text-5xl font-black text-racing-red">
                        {selectedDriver.brake}%
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-racing-red h-full transition-all duration-100"
                        style={{ width: `${selectedDriver.brake}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Secondary Dynamics: DRS, Steering Angle, G-G Diagram, ERS State */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                  {/* DRS Wing Flap Status */}
                  <div className="p-4 rounded-xl bg-carbon-950 border border-zinc-800/80 flex flex-col justify-between space-y-3">
                    <div className="flex justify-between items-center text-[10px] text-zinc-500">
                      <span>REAR WING DRS</span>
                      <Radio className="w-3.5 h-3.5" />
                    </div>
                    <div
                      className={`py-2 px-3 rounded-lg text-center font-bold tracking-wider text-xs border ${
                        selectedDriver.drs === "ACTIVE"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-lg shadow-emerald-500/20"
                          : selectedDriver.drs === "DETECTED"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse"
                          : "bg-zinc-900 text-zinc-500 border-zinc-800"
                      }`}
                    >
                      {selectedDriver.drs === "ACTIVE"
                        ? "DRS OPEN (ACTIVE)"
                        : selectedDriver.drs === "DETECTED"
                        ? "DRS ELIGIBLE (<1.0s)"
                        : "DRS CLOSED"}
                    </div>
                    <div className="text-[10px] text-zinc-500 flex justify-between">
                      <span>Gap to car ahead:</span>
                      <span className="text-zinc-300 font-bold">
                        {selectedDriver.position === 1 ? "-" : `+${selectedDriver.interval}s`}
                      </span>
                    </div>
                  </div>

                  {/* Steering Angle & Wheel */}
                  <div className="p-4 rounded-xl bg-carbon-950 border border-zinc-800/80 flex flex-col justify-between space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-zinc-500">
                      <span>STEERING ANGLE</span>
                      <Compass className="w-3.5 h-3.5 text-zinc-400" />
                    </div>
                    <div className="flex items-center justify-center gap-3 py-1">
                      <div
                        className="w-10 h-10 rounded-full border-2 border-zinc-700 border-t-racing-red flex items-center justify-center transition-transform duration-100"
                        style={{ transform: `rotate(${selectedDriver.steeringAngle}deg)` }}
                      >
                        <div className="w-1 h-3 bg-racing-red rounded-full" />
                      </div>
                      <div>
                        <span className="text-xl font-black text-white block">
                          {selectedDriver.steeringAngle > 0 ? `+${selectedDriver.steeringAngle}°` : `${selectedDriver.steeringAngle}°`}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {selectedDriver.steeringAngle > 10 ? "RIGHT TURN" : selectedDriver.steeringAngle < -10 ? "LEFT TURN" : "CENTER"}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-500 text-center">1:1 Rack Ratio</span>
                  </div>

                  {/* G-Force Circle (G-G Diagram) */}
                  <div className="p-4 rounded-xl bg-carbon-950 border border-zinc-800/80 flex flex-col justify-between space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-zinc-500">
                      <span>G-FORCE ACCELEROMETER</span>
                      <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      {/* Interactive G-G 2D circle */}
                      <div className="w-14 h-14 rounded-full border border-zinc-700 relative flex items-center justify-center bg-zinc-900/60">
                        {/* Crosshairs */}
                        <div className="absolute w-full h-[1px] bg-zinc-800" />
                        <div className="absolute h-full w-[1px] bg-zinc-800" />
                        {/* Dynamic G Point */}
                        <div
                          className="w-2.5 h-2.5 rounded-full bg-racing-red shadow-md shadow-racing-red transition-all duration-100"
                          style={{
                            transform: `translate(${Math.max(-22, Math.min(22, selectedDriver.lateralG * 5))}px, ${Math.max(-22, Math.min(22, selectedDriver.longitudinalG * -5))}px)`,
                          }}
                        />
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-[11px]">
                          <span className="text-zinc-500">Lat: </span>
                          <span className="font-bold text-white">{selectedDriver.lateralG}G</span>
                        </div>
                        <div className="text-[11px]">
                          <span className="text-zinc-500">Long: </span>
                          <span className="font-bold text-white">{selectedDriver.longitudinalG}G</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-500 text-center">Peak Decel: -5.1G</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* B. LIVE CONTINUOUS SCROLLING TELEMETRY WAVEFORM */}
            <Card className="border-zinc-800 bg-carbon-900/90 shadow-2xl">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-racing-cyan" />
                    Live ECU Sensor Waveforms ({selectedDriver.driver.code})
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-400">
                    Real-time streaming traces: Speed (km/h), Throttle (%), and Brake (%)
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono">
                  <span className="flex items-center gap-1 text-cyan-400">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" /> Speed
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Throttle
                  </span>
                  <span className="flex items-center gap-1 text-racing-red">
                    <span className="w-2 h-2 rounded-full bg-racing-red inline-block" /> Brake
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={telemetryStreamHistory}>
                      <defs>
                        <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis dataKey="timeSec" stroke="#71717a" tick={{ fontSize: 10, fill: "#71717a" }} />
                      <YAxis stroke="#71717a" domain={[0, 360]} tick={{ fontSize: 10, fill: "#71717a" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#09090b",
                          borderColor: "#27272a",
                          borderRadius: "8px",
                          fontSize: "11px",
                          fontFamily: "monospace",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="speed"
                        stroke="#22d3ee"
                        strokeWidth={2.5}
                        fill="url(#speedGrad)"
                        name="Speed (km/h)"
                        isAnimationActive={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="throttle"
                        stroke="#34d399"
                        strokeWidth={1.8}
                        dot={false}
                        name="Throttle (%)"
                        isAnimationActive={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="brake"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={false}
                        name="Brake (%)"
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COL: RACE ENGINEER RADIO, TYRE WEAR & PIT STATUS */}
          <div className="space-y-6">
            {/* Tyre Health & Compound Status */}
            <Card className="border-zinc-800 bg-carbon-900/90 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-white flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-400" />
                    Tyre Set & Pit Window
                  </span>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    STINT #{selectedDriver.pitStops + 1}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs font-mono">
                <div className="flex items-center justify-between p-3 rounded-lg bg-carbon-950 border border-zinc-800">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] ${
                        selectedDriver.tyreCompound === "SOFT"
                          ? "bg-red-600 text-white"
                          : selectedDriver.tyreCompound === "MEDIUM"
                          ? "bg-amber-400 text-black"
                          : "bg-zinc-100 text-black"
                      }`}
                    >
                      {selectedDriver.tyreCompound[0]}
                    </span>
                    <div>
                      <span className="text-white font-bold block">{selectedDriver.tyreCompound} COMPOUND</span>
                      <span className="text-zinc-500 text-[10px]">
                        {selectedDriver.tyreAge} Laps on current set
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-amber-400 font-bold block">{selectedDriver.tyreWearPct}%</span>
                    <span className="text-[10px] text-zinc-500">Remaining</span>
                  </div>
                </div>

                {/* 4 Tyre Surface Thermals Snapshot */}
                <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
                  <div className="p-2 rounded bg-carbon-950 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">FRONT LEFT</span>
                    <span className="font-bold text-white">{selectedDriver.tyreTemps.fl}°C</span>
                  </div>
                  <div className="p-2 rounded bg-carbon-950 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">FRONT RIGHT</span>
                    <span className="font-bold text-white">{selectedDriver.tyreTemps.fr}°C</span>
                  </div>
                  <div className="p-2 rounded bg-carbon-950 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">REAR LEFT</span>
                    <span className="font-bold text-white">{selectedDriver.tyreTemps.rl}°C</span>
                  </div>
                  <div className="p-2 rounded bg-carbon-950 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">REAR RIGHT</span>
                    <span className="font-bold text-white">{selectedDriver.tyreTemps.rr}°C</span>
                  </div>
                </div>

                {/* Pit Window Advice */}
                <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase block">Pit Strategy Window</span>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-emerald-400 font-bold">OPTIMUM WINDOW OPEN</span>
                    <span className="text-zinc-400">Laps 38 - 42</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 pt-1">
                    Estimated pit stop time loss: 21.4s. Projected rejoin behind RUS (P4).
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Live Pit Wall Team Radio Transcripts */}
            <Card className="border-zinc-800 bg-carbon-900/90 shadow-xl">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-racing-red" />
                  Live Team Radio &amp; Engineering Calls
                </CardTitle>
                <span className="flex h-2 w-2 rounded-full bg-racing-red animate-ping" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {radioFeed.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-3 rounded-lg bg-carbon-950 border border-zinc-800/80 space-y-1.5 text-xs font-mono"
                    >
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-racing-red font-bold flex items-center gap-1">
                          <Radio className="w-3 h-3" />
                          #{msg.driverCode} • {msg.speaker}
                        </span>
                        <span className="text-zinc-500">{msg.time}</span>
                      </div>
                      <p className="text-zinc-300 leading-relaxed text-[11px]">
                        &quot;{msg.text}&quot;
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* 4. FULL 22-DRIVER TIMING TOWER & GAPS (11 TEAMS) */}
      {activeTab === "tower" && (
        <Card className="border-zinc-800 bg-carbon-900/90 shadow-2xl">
          <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-racing-red" />
                22-Driver Live Timing Tower &amp; Micro-Sectors (11 Teams)
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Live intervals, gaps to leader, tyre wear, and pit counts for all 22 cars across the 11 World Championship constructors.
              </CardDescription>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" /> Overall Fastest
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Personal Best
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-carbon-950 text-zinc-400 uppercase tracking-wider text-[11px] border-y border-zinc-800">
                  <tr>
                    <th scope="col" className="py-3 px-4">Pos</th>
                    <th scope="col" className="py-3 px-4">Driver</th>
                    <th scope="col" className="py-3 px-4">Interval</th>
                    <th scope="col" className="py-3 px-4">Gap to Leader</th>
                    <th scope="col" className="py-3 px-4">Speed</th>
                    <th scope="col" className="py-3 px-4">Gear</th>
                    <th scope="col" className="py-3 px-4">Sector 1</th>
                    <th scope="col" className="py-3 px-4">Sector 2</th>
                    <th scope="col" className="py-3 px-4">Sector 3</th>
                    <th scope="col" className="py-3 px-4">Last Lap</th>
                    <th scope="col" className="py-3 px-4">Tyres</th>
                    <th scope="col" className="py-3 px-4">Pits</th>
                    <th scope="col" className="py-3 px-4 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  {driversTelemetry.map((d) => {
                    const isSelected = d.driver.code === selectedDriverCode;
                    return (
                      <tr
                        key={d.driver.id}
                        className={`hover:bg-zinc-800/40 transition-colors ${
                          isSelected ? "bg-racing-red/10 border-l-2 border-l-racing-red" : ""
                        }`}
                      >
                        <td className="py-2.5 px-4 font-bold text-white">
                          <span className="flex items-center gap-1.5">
                            <span>P{d.position}</span>
                            {d.positionDelta > 0 && <TrendingUp className="w-3 h-3 text-emerald-400" />}
                            {d.positionDelta < 0 && <TrendingDown className="w-3 h-3 text-red-400" />}
                          </span>
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-1.5 h-4 rounded-full"
                              style={{ backgroundColor: d.driver.teamColor }}
                            />
                            <div>
                              <span className="font-bold text-white block">
                                #{d.driver.number} {d.driver.code}
                              </span>
                              <span className="text-[10px] text-zinc-500 block">
                                {d.driver.name}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-zinc-300">
                          {d.position === 1 ? "-" : `+${d.interval}s`}
                        </td>
                        <td className="py-2.5 px-4 font-bold text-white">
                          {d.position === 1 ? "LEADER" : `+${d.gapToLeader}s`}
                        </td>
                        <td className="py-2.5 px-4 text-cyan-400 font-bold">
                          {d.speed} km/h
                        </td>
                        <td className="py-2.5 px-4 text-amber-400 font-bold">
                          G{d.gear}
                        </td>
                        <td className="py-2.5 px-4">
                          <span
                            className={
                              d.sector1.status === "purple"
                                ? "text-purple-400 font-bold"
                                : d.sector1.status === "green"
                                ? "text-emerald-400"
                                : "text-amber-400"
                            }
                          >
                            {d.sector1.time}
                          </span>
                        </td>
                        <td className="py-2.5 px-4">
                          <span
                            className={
                              d.sector2.status === "purple"
                                ? "text-purple-400 font-bold"
                                : d.sector2.status === "green"
                                ? "text-emerald-400"
                                : "text-amber-400"
                            }
                          >
                            {d.sector2.time}
                          </span>
                        </td>
                        <td className="py-2.5 px-4">
                          <span
                            className={
                              d.sector3.status === "purple"
                                ? "text-purple-400 font-bold"
                                : d.sector3.status === "green"
                                ? "text-emerald-400"
                                : "text-amber-400"
                            }
                          >
                            {d.sector3.time}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-zinc-200">
                          {d.lastLapTime}
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] ${
                                d.tyreCompound === "SOFT"
                                  ? "bg-red-600 text-white"
                                  : d.tyreCompound === "MEDIUM"
                                  ? "bg-amber-400 text-black"
                                  : "bg-zinc-200 text-black"
                              }`}
                            >
                              {d.tyreCompound[0]}
                            </span>
                            <span className="text-[10px] text-zinc-400">
                              L{d.tyreAge} ({d.tyreWearPct}%)
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-zinc-400">
                          {d.pitStops}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <Button
                            variant={isSelected ? "racing" : "outline"}
                            size="sm"
                            onClick={() => {
                              setSelectedDriverCode(d.driver.code);
                              setActiveTab("pitwall");
                            }}
                            className="h-7 px-2 text-[10px] gap-1 font-mono cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Inspect</span>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 5. 4-CORNER THERMALS & ERS / PU SUITE */}
      {activeTab === "thermals" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 4-Corner Brake Rotors & Tyres */}
          <Card className="border-zinc-800 bg-carbon-900/90 shadow-xl">
            <CardHeader>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-500" />
                4-Corner Brake Disc &amp; Tyre Surface Temperatures
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400 font-mono">
                Car #{selectedDriver.driver.number} {selectedDriver.driver.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Chassis Diagram Representation */}
              <div className="relative w-full max-w-sm mx-auto h-72 rounded-2xl bg-carbon-950 border border-zinc-800 p-6 flex flex-col justify-between">
                {/* Front Axle */}
                <div className="flex justify-between items-center font-mono">
                  {/* Front-Left */}
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-center space-y-1 w-28">
                    <span className="text-[10px] text-zinc-400 block font-bold">FRONT LEFT</span>
                    <span className="text-sm font-black text-amber-400 block">{selectedDriver.tyreTemps.fl}°C</span>
                    <span className="text-[10px] text-red-400 block font-bold">Disc: {selectedDriver.brakeTemps.fl}°C</span>
                  </div>

                  <span className="text-[11px] font-bold text-zinc-500">FRONT NOSE</span>

                  {/* Front-Right */}
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-center space-y-1 w-28">
                    <span className="text-[10px] text-zinc-400 block font-bold">FRONT RIGHT</span>
                    <span className="text-sm font-black text-amber-400 block">{selectedDriver.tyreTemps.fr}°C</span>
                    <span className="text-[10px] text-red-400 block font-bold">Disc: {selectedDriver.brakeTemps.fr}°C</span>
                  </div>
                </div>

                {/* Car Core Icon */}
                <div className="text-center font-mono">
                  <span className="px-3 py-1 rounded bg-zinc-800 text-[10px] text-zinc-300 font-bold">
                    CARBON CHASSIS
                  </span>
                </div>

                {/* Rear Axle */}
                <div className="flex justify-between items-center font-mono">
                  {/* Rear-Left */}
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-center space-y-1 w-28">
                    <span className="text-[10px] text-zinc-400 block font-bold">REAR LEFT</span>
                    <span className="text-sm font-black text-amber-400 block">{selectedDriver.tyreTemps.rl}°C</span>
                    <span className="text-[10px] text-red-400 block font-bold">Disc: {selectedDriver.brakeTemps.rl}°C</span>
                  </div>

                  <span className="text-[11px] font-bold text-zinc-500">DIFFUSER</span>

                  {/* Rear-Right */}
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-center space-y-1 w-28">
                    <span className="text-[10px] text-zinc-400 block font-bold">REAR RIGHT</span>
                    <span className="text-sm font-black text-amber-400 block">{selectedDriver.tyreTemps.rr}°C</span>
                    <span className="text-[10px] text-red-400 block font-bold">Disc: {selectedDriver.brakeTemps.rr}°C</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono space-y-1 text-zinc-400">
                <span className="text-zinc-200 font-bold block">Carbon Rotor Operating Range: 350°C - 1,050°C</span>
                <p className="text-[11px]">
                  Brake duct cooling louvres dynamically optimized for {selectedGP.circuitName}.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ERS Hybrid System & Engine Telemetry */}
          <Card className="border-zinc-800 bg-carbon-900/90 shadow-xl">
            <CardHeader>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                ERS Hybrid Powertrain &amp; Battery State
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400 font-mono">
                1.6L V6 Turbo Hybrid • MGU-K &amp; MGU-H Energy Flow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 font-mono text-xs">
              {/* Battery SOC */}
              <div className="p-4 rounded-xl bg-carbon-950 border border-zinc-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">HYBRID BATTERY SOC</span>
                  <span className="text-lg font-black text-amber-400">{selectedDriver.ersBatteryPct}%</span>
                </div>
                <div className="w-full bg-zinc-800 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-300"
                    style={{ width: `${selectedDriver.ersBatteryPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>0% Depleted</span>
                  <span>4MJ FIA Lap Max Limit</span>
                  <span>100% Full</span>
                </div>
              </div>

              {/* MGU-K Deployment & Harvesting Rates */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-lg bg-carbon-950 border border-zinc-800 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase block">MGU-K Deployment</span>
                  <span className="text-xl font-black text-cyan-400 block">{selectedDriver.ersDeployKw} kW</span>
                  <span className="text-[10px] text-zinc-500">160 BHP Boost</span>
                </div>

                <div className="p-3 rounded-lg bg-carbon-950 border border-zinc-800 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase block">MGU-K Harvest</span>
                  <span className="text-xl font-black text-emerald-400 block">{selectedDriver.ersHarvestKw} kW</span>
                  <span className="text-[10px] text-zinc-500">Regen Under Braking</span>
                </div>
              </div>

              {/* Power Unit Engine Fluids */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-2.5 rounded bg-carbon-950 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block">Water Temp</span>
                  <span className="font-bold text-white">102.4°C</span>
                </div>
                <div className="p-2.5 rounded bg-carbon-950 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block">Oil Temp</span>
                  <span className="font-bold text-white">114.1°C</span>
                </div>
                <div className="p-2.5 rounded bg-carbon-950 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block">Turbo Boost</span>
                  <span className="font-bold text-white">3.48 bar</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 6. HEAD-TO-HEAD DRIVER OVERLAY */}
      {activeTab === "compare" && (
        <Card className="border-zinc-800 bg-carbon-900/90 shadow-2xl">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
            <div>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-racing-red" />
                Live Driver Telemetry Comparison Overlay
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Synchronized live speed and throttle traces between two cars.
              </CardDescription>
            </div>

            {/* Comparison Selectors */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span className="text-zinc-400">Driver 1:</span>
                <select
                  value={selectedDriverCode}
                  onChange={(e) => setSelectedDriverCode(e.target.value)}
                  className="bg-carbon-950 border border-zinc-800 rounded px-2 py-1 text-white text-xs cursor-pointer"
                >
                  {driversTelemetry.map((d) => (
                    <option key={d.driver.code} value={d.driver.code}>
                      P{d.position} • {d.driver.code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="text-zinc-400">Driver 2:</span>
                <select
                  value={compareDriverCode}
                  onChange={(e) => setCompareDriverCode(e.target.value)}
                  className="bg-carbon-950 border border-zinc-800 rounded px-2 py-1 text-white text-xs cursor-pointer"
                >
                  {driversTelemetry.map((d) => (
                    <option key={d.driver.code} value={d.driver.code}>
                      P{d.position} • {d.driver.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4 text-center font-mono text-xs">
              <div className="p-4 rounded-xl bg-carbon-950 border border-cyan-500/30">
                <span className="text-cyan-400 font-bold block text-sm">
                  #{selectedDriver.driver.number} {selectedDriver.driver.name}
                </span>
                <span className="text-2xl font-black text-white">{selectedDriver.speed} km/h</span>
                <span className="text-[10px] text-zinc-500 block">Throttle: {selectedDriver.throttle}% • Gear: {selectedDriver.gear}</span>
              </div>

              <div className="p-4 rounded-xl bg-carbon-950 border border-amber-500/30">
                <span className="text-amber-400 font-bold block text-sm">
                  #{compareDriver.driver.number} {compareDriver.driver.name}
                </span>
                <span className="text-2xl font-black text-white">{compareDriver.speed} km/h</span>
                <span className="text-[10px] text-zinc-500 block">Throttle: {compareDriver.throttle}% • Gear: {compareDriver.gear}</span>
              </div>
            </div>

            {/* Overlaid Live Chart */}
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={telemetryStreamHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="timeSec" stroke="#71717a" tick={{ fontSize: 10, fill: "#71717a" }} />
                  <YAxis stroke="#71717a" domain={[60, 360]} tick={{ fontSize: 10, fill: "#71717a" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#09090b",
                      borderColor: "#27272a",
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontFamily: "monospace",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="speed"
                    stroke="#22d3ee"
                    strokeWidth={2.5}
                    name={`${selectedDriver.driver.code} Speed`}
                    dot={false}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="compareSpeed"
                    stroke="#fbbf24"
                    strokeWidth={2.5}
                    name={`${compareDriver.driver.code} Speed`}
                    dot={false}
                    strokeDasharray="4 2"
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
        </div>
      )}
    </div>
  );
}
