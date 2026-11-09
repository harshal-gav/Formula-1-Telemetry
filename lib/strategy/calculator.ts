/**
 * Tyre Strategy & Degradation Simulator
 * Derived from Fast-F1 tyre stint data and F1-StratLab pit window analytics.
 */

export interface TyreCompoundProfile {
  name: "SOFT" | "MEDIUM" | "HARD" | "INTERMEDIATE" | "WET";
  color: string;
  basePaceOffsetSeconds: number; // 0.0s for Soft (fastest), +0.5s for Medium, +1.1s for Hard
  degPerLapSeconds: number; // Lap time increase per lap driven
  cliffLap: number; // Lap where degradation accelerates rapidly
  optimalStintMax: number;
}

export const COMPOUND_PROFILES: Record<string, TyreCompoundProfile> = {
  SOFT: {
    name: "SOFT",
    color: "#e10600",
    basePaceOffsetSeconds: 0.0,
    degPerLapSeconds: 0.11,
    cliffLap: 18,
    optimalStintMax: 20,
  },
  MEDIUM: {
    name: "MEDIUM",
    color: "#ffd12f",
    basePaceOffsetSeconds: 0.45,
    degPerLapSeconds: 0.065,
    cliffLap: 28,
    optimalStintMax: 30,
  },
  HARD: {
    name: "HARD",
    color: "#ffffff",
    basePaceOffsetSeconds: 0.95,
    degPerLapSeconds: 0.038,
    cliffLap: 42,
    optimalStintMax: 45,
  },
  INTERMEDIATE: {
    name: "INTERMEDIATE",
    color: "#39b54a",
    basePaceOffsetSeconds: 3.5,
    degPerLapSeconds: 0.08,
    cliffLap: 25,
    optimalStintMax: 30,
  },
  WET: {
    name: "WET",
    color: "#0072ce",
    basePaceOffsetSeconds: 7.0,
    degPerLapSeconds: 0.09,
    cliffLap: 30,
    optimalStintMax: 35,
  },
};

export interface StintPlan {
  stintNumber: number;
  compound: "SOFT" | "MEDIUM" | "HARD";
  startLap: number;
  endLap: number;
  lapsOnCompound: number;
}

export interface StrategyPlan {
  id: string;
  name: string;
  totalTimeEstimateSeconds: number;
  stops: number;
  stints: StintPlan[];
  pitWindowLaps: number[];
  undercutPotential: "High" | "Medium" | "Low";
  riskLevel: "Low" | "Medium" | "Aggressive";
  description: string;
}

/**
 * Simulates tyre degradation over N laps
 */
export function simulateLapDegradation(
  compoundName: string,
  totalLaps: number,
  baseLapTimeSeconds = 85.0
): Array<{ lap: number; lapTime: number; degradation: number; compound: string }> {
  const profile = COMPOUND_PROFILES[compoundName.toUpperCase()] || COMPOUND_PROFILES.MEDIUM;
  const result = [];

  for (let lap = 1; lap <= totalLaps; lap++) {
    // Non-linear tyre degradation: accelerates past the cliff lap
    let deg = lap * profile.degPerLapSeconds;
    if (lap > profile.cliffLap) {
      const extraLaps = lap - profile.cliffLap;
      deg += Math.pow(extraLaps, 1.4) * 0.15;
    }

    const lapTime = baseLapTimeSeconds + profile.basePaceOffsetSeconds + deg;
    result.push({
      lap,
      lapTime: Number(lapTime.toFixed(3)),
      degradation: Number(deg.toFixed(3)),
      compound: profile.name,
    });
  }

  return result;
}

/**
 * Calculates optimal strategy options for a given race distance
 */
export function calculateRaceStrategies(
  totalRaceLaps = 57,
  baseLapTime = 88.0,
  pitLossSeconds = 22.5
): StrategyPlan[] {
  // Option 1: 1-Stop (Medium -> Hard)
  const medLaps = Math.round(totalRaceLaps * 0.38);
  const hardLaps = totalRaceLaps - medLaps;

  // Option 2: 1-Stop (Soft -> Hard)
  const softLaps = Math.min(18, Math.round(totalRaceLaps * 0.28));
  const hardLaps2 = totalRaceLaps - softLaps;

  // Option 3: 2-Stop (Soft -> Medium -> Medium)
  const stint1 = Math.round(totalRaceLaps * 0.25);
  const stint2 = Math.round(totalRaceLaps * 0.38);
  const stint3 = totalRaceLaps - stint1 - stint2;

  return [
    {
      id: "strat-1",
      name: "Medium ➔ Hard (1-Stop)",
      stops: 1,
      totalTimeEstimateSeconds: totalRaceLaps * baseLapTime + pitLossSeconds + 48,
      stints: [
        { stintNumber: 1, compound: "MEDIUM", startLap: 1, endLap: medLaps, lapsOnCompound: medLaps },
        { stintNumber: 2, compound: "HARD", startLap: medLaps + 1, endLap: totalRaceLaps, lapsOnCompound: hardLaps },
      ],
      pitWindowLaps: [medLaps - 2, medLaps + 2],
      undercutPotential: "Medium",
      riskLevel: "Low",
      description: "Default baseline strategy with flexible pit window and minimal degradation risk.",
    },
    {
      id: "strat-2",
      name: "Soft ➔ Hard (1-Stop)",
      stops: 1,
      totalTimeEstimateSeconds: totalRaceLaps * baseLapTime + pitLossSeconds + 51,
      stints: [
        { stintNumber: 1, compound: "SOFT", startLap: 1, endLap: softLaps, lapsOnCompound: softLaps },
        { stintNumber: 2, compound: "HARD", startLap: softLaps + 1, endLap: totalRaceLaps, lapsOnCompound: hardLaps2 },
      ],
      pitWindowLaps: [softLaps - 1, softLaps + 2],
      undercutPotential: "High",
      riskLevel: "Medium",
      description: "Aggressive start to gain launch positions off the line, requiring tyre management in stint 2.",
    },
    {
      id: "strat-3",
      name: "Soft ➔ Medium ➔ Soft (2-Stop)",
      stops: 2,
      totalTimeEstimateSeconds: totalRaceLaps * baseLapTime + pitLossSeconds * 2 + 25,
      stints: [
        { stintNumber: 1, compound: "SOFT", startLap: 1, endLap: stint1, lapsOnCompound: stint1 },
        { stintNumber: 2, compound: "MEDIUM", startLap: stint1 + 1, endLap: stint1 + stint2, lapsOnCompound: stint2 },
        { stintNumber: 3, compound: "SOFT", startLap: stint1 + stint2 + 1, endLap: totalRaceLaps, lapsOnCompound: stint3 },
      ],
      pitWindowLaps: [stint1, stint1 + stint2],
      undercutPotential: "High",
      riskLevel: "Aggressive",
      description: "Maximum flat-out pace on abrasive tracks with high safety car probability.",
    },
  ];
}
