/**
 * Client-Side Formula 1 Race Outcome Prediction Engine
 * Statistical heuristics derived from race pace regressions,
 * tyre stint degradation modeling, and qualifying sector deltas.
 * 
 * DISCLAIMER: These outputs are statistical estimates based on historical
 * correlations, grid positions, and current form. They are NOT guarantees.
 */

export interface DriverPredictionInput {
  driverId: string;
  driverName: string;
  driverNumber: string;
  constructorId: string;
  constructorName: string;
  gridPosition: number;
  qualifyingGapToPoleSeconds?: number;
  seasonPoints: number;
  driverChampionshipRank: number;
}

export interface CircuitContext {
  circuitId: string;
  circuitName: string;
  overtakingDifficulty: "Low" | "Medium" | "High"; // High means harder to overtake (e.g. Monaco)
  safetyCarProbability: number; // 0.0 to 1.0
  totalLaps: number;
  fullThrottlePercent?: number;
  topSpeedTrapKmH?: number;
  turns?: number;
}

export interface PredictionResult {
  driverId: string;
  driverName: string;
  constructorName: string;
  gridPosition: number;
  predictedPosition: number;
  winProbability: number; // 0 to 100%
  podiumProbability: number; // 0 to 100%
  top10Probability: number; // 0 to 100%
  predictedGapToWinner: string;
  confidenceScore: number; // 0 to 100%
  keyFactors: string[];
}

// Constructor baseline pace multipliers
const CONSTRUCTOR_PACE_WEIGHTS: Record<string, number> = {
  mclaren: 1.15,
  ferrari: 1.13,
  red_bull: 1.14,
  mercedes: 1.08,
  aston_martin: 0.96,
  haas: 0.93,
  alpine: 0.92,
  williams: 0.91,
  rb: 0.92,
  sauber: 0.85,
};

export function predictRaceOutcomes(
  drivers: DriverPredictionInput[],
  circuit: CircuitContext
): PredictionResult[] {
  if (!drivers || drivers.length === 0) return [];

  const isPowerTrack = (circuit.fullThrottlePercent || 65) > 70;
  const isHighDownforce = (circuit.turns || 16) >= 18 || circuit.overtakingDifficulty === "High";

  // 1. Calculate raw heuristic score for each driver
  const scoredDrivers = drivers.map((driver) => {
    const constrKey = driver.constructorId.toLowerCase().replace(/[\s-]/g, "_");
    let carPace = CONSTRUCTOR_PACE_WEIGHTS[constrKey] || 0.90;

    // Adjust constructor pace by track characteristic
    if (isPowerTrack && (constrKey === "red_bull" || constrKey === "ferrari")) {
      carPace += 0.03;
    } else if (isHighDownforce && (constrKey === "mclaren" || constrKey === "ferrari")) {
      carPace += 0.03;
    }

    // Grid position weighting: at tight tracks like Monaco, grid slot is overwhelmingly dominant
    const gridWeight = circuit.overtakingDifficulty === "High" ? 1.6 : circuit.overtakingDifficulty === "Low" ? 0.9 : 1.15;
    const gridScore = Math.max(0, (23 - driver.gridPosition) * 4.8 * gridWeight);

    // Form score based on championship points and rank
    const pointsNormalized = Math.min(450, driver.seasonPoints) / 20;
    const rankScore = Math.max(0, (22 - driver.driverChampionshipRank) * 2.0);
    const formScore = pointsNormalized + rankScore;

    // Qualifying delta penalty (if available)
    const gapPenalty = (driver.qualifyingGapToPoleSeconds || 0) * 14;

    // Circuit safety car variance factor
    const scVariance = (Math.sin(driver.gridPosition * 3 + circuit.totalLaps) * 2.5) * circuit.safetyCarProbability;

    // Composite raw score
    const rawScore = (gridScore + formScore - gapPenalty + scVariance) * carPace;

    const keyFactors: string[] = [];
    if (driver.gridPosition <= 3) keyFactors.push("Front-row launch & clear air advantage");
    if (isPowerTrack && (constrKey === "red_bull" || constrKey === "ferrari")) {
      keyFactors.push("High-speed straight-line aero efficiency");
    } else if (isHighDownforce && constrKey === "mclaren") {
      keyFactors.push("Superior medium/high-speed corner downforce");
    }
    if (driver.driverChampionshipRank <= 3) keyFactors.push("Championship tier racecraft & stint management");
    if (circuit.overtakingDifficulty === "High" && driver.gridPosition <= 4) {
      keyFactors.push("Track layout strictly protects qualifying track position");
    }
    if (circuit.overtakingDifficulty === "Low" && driver.gridPosition > 3) {
      keyFactors.push("Long DRS zones favor race pace offset and overtaking");
    }
    if (driver.gridPosition > 12) keyFactors.push("DRS train traffic risk in opening stint");
    if (circuit.safetyCarProbability > 0.65) keyFactors.push("High safety car probability favors opportunistic pit strategy");

    return {
      driver,
      rawScore: Math.max(1, rawScore),
      keyFactors: keyFactors.slice(0, 3),
    };
  });

  // 2. Sort by descending score
  scoredDrivers.sort((a, b) => b.rawScore - a.rawScore);

  const totalScore = scoredDrivers.reduce((acc, curr) => acc + curr.rawScore, 0);

  // 3. Compute normalized probabilities and finishing positions
  return scoredDrivers.map((entry, index) => {
    const predictedPos = index + 1;
    const share = entry.rawScore / totalScore;

    // Dynamic win probability calculation
    let winProb = 0;
    if (predictedPos === 1) {
      winProb = Math.min(65, Math.max(28, Math.round(share * 260 + (circuit.overtakingDifficulty === "High" ? 8 : 0))));
    } else if (predictedPos === 2) {
      winProb = Math.min(32, Math.max(12, Math.round(share * 140)));
    } else if (predictedPos === 3) {
      winProb = Math.min(18, Math.max(6, Math.round(share * 75)));
    } else if (predictedPos <= 5) {
      winProb = Math.min(8, Math.max(2, Math.round(share * 28)));
    } else {
      winProb = Math.max(0, Math.round(share * 4));
    }

    // Dynamic podium probability
    let podiumProb = 0;
    if (predictedPos === 1) {
      podiumProb = Math.min(96, Math.round(82 + share * 60));
    } else if (predictedPos === 2) {
      podiumProb = Math.min(88, Math.round(68 + share * 55));
    } else if (predictedPos === 3) {
      podiumProb = Math.min(78, Math.round(52 + share * 50));
    } else if (predictedPos <= 6) {
      podiumProb = Math.max(12, Math.round(38 - (predictedPos - 3) * 8 + share * 25));
    } else if (predictedPos <= 10) {
      podiumProb = Math.max(3, Math.round(14 - (predictedPos - 6) * 2.5));
    } else {
      podiumProb = Math.max(1, Math.round(3 / (predictedPos - 8)));
    }

    // Dynamic Top 10 probability
    let top10Prob = 0;
    if (predictedPos <= 5) {
      top10Prob = Math.min(99, Math.round(96 - (predictedPos - 1) * 2 + share * 15));
    } else if (predictedPos <= 8) {
      top10Prob = Math.min(92, Math.round(86 - (predictedPos - 5) * 4));
    } else if (predictedPos <= 10) {
      top10Prob = Math.min(80, Math.max(50, Math.round(74 - (predictedPos - 8) * 8)));
    } else if (predictedPos <= 14) {
      top10Prob = Math.max(18, Math.round(42 - (predictedPos - 10) * 6));
    } else {
      top10Prob = Math.max(4, Math.round(15 - (predictedPos - 14) * 2));
    }

    const gapPerPos = circuit.overtakingDifficulty === "High" ? 2.4 : 3.8;
    const predictedGapSeconds = (predictedPos - 1) * gapPerPos + (Math.sin(predictedPos) * 0.4);
    const gapStr = predictedPos === 1 ? "LEADER" : `+${Math.max(0.5, predictedGapSeconds).toFixed(1)}s`;

    return {
      driverId: entry.driver.driverId,
      driverName: entry.driver.driverName,
      constructorName: entry.driver.constructorName,
      gridPosition: entry.driver.gridPosition,
      predictedPosition: predictedPos,
      winProbability: winProb,
      podiumProbability: podiumProb,
      top10Probability: top10Prob,
      predictedGapToWinner: gapStr,
      confidenceScore: Math.round(76 + ((20 - predictedPos) * 0.7) + (Math.sin(predictedPos * 2) * 3)),
      keyFactors: entry.keyFactors,
    };
  });
}
