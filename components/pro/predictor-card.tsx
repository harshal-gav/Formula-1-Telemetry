"use client";

import { useState, useMemo } from "react";
import { useGP } from "@/context/gp-context";
import { PRO_DRIVERS } from "@/lib/drivers";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  predictRaceOutcomes,
  DriverPredictionInput,
  CircuitContext,
  PredictionResult,
} from "@/lib/prediction/model";
import { GrandPrixCircuit } from "@/lib/grand-prix";
import { Sparkles, AlertCircle, Search } from "lucide-react";

function buildGridInputForCircuit(circuit: GrandPrixCircuit): DriverPredictionInput[] {
  const isPower = circuit.fullThrottlePercent > 70;
  const isStreetOrTight = circuit.overtakingDifficulty === "High";

  const driversWithQuali = PRO_DRIVERS.map((driver) => {
    let delta = (driver.championshipRank - 1) * 0.042 + (driver.speedOffset * -0.06);

    // Track suitability bias
    if (isPower && (driver.constructorId === "red_bull" || driver.constructorId === "ferrari")) {
      delta -= 0.06;
    } else if (isStreetOrTight && driver.constructorId === "mclaren") {
      delta -= 0.07;
    }

    // Circuit round variance
    const roundVariance = ((driver.number * 3 + circuit.round * 7) % 11 - 5) * 0.015;
    delta += roundVariance;

    return {
      driver,
      delta: Math.max(0, delta),
    };
  });

  driversWithQuali.sort((a, b) => a.delta - b.delta);
  const poleDelta = driversWithQuali[0].delta;

  return driversWithQuali.map((item, idx) => ({
    driverId: item.driver.id,
    driverName: item.driver.name,
    driverNumber: String(item.driver.number),
    constructorId: item.driver.constructorId,
    constructorName: item.driver.constructorName,
    gridPosition: idx + 1,
    qualifyingGapToPoleSeconds: Number((item.delta - poleDelta).toFixed(3)),
    seasonPoints: item.driver.seasonPoints,
    driverChampionshipRank: item.driver.championshipRank,
  }));
}

export function PredictorCard() {
  const { selectedGP } = useGP();
  const [driverSearch, setDriverSearch] = useState<string>("");

  const circuit: CircuitContext = useMemo(
    () => ({
      circuitId: selectedGP.id,
      circuitName: selectedGP.circuitName,
      overtakingDifficulty: selectedGP.overtakingDifficulty,
      safetyCarProbability: selectedGP.safetyCarProbability,
      totalLaps: selectedGP.totalLaps,
      fullThrottlePercent: selectedGP.fullThrottlePercent,
      topSpeedTrapKmH: selectedGP.topSpeedTrapKmH,
      turns: selectedGP.turns,
    }),
    [selectedGP]
  );

  const gridInput = useMemo(
    () => buildGridInputForCircuit(selectedGP),
    [selectedGP]
  );

  const predictions: PredictionResult[] = useMemo(
    () => predictRaceOutcomes(gridInput, circuit),
    [gridInput, circuit]
  );

  const isUpcoming = selectedGP.status === "upcoming";

  const filteredPredictions = useMemo(() => {
    if (!driverSearch) return predictions;
    const term = driverSearch.toLowerCase();
    return predictions.filter(
      (p) =>
        p.driverName.toLowerCase().includes(term) ||
        p.constructorName.toLowerCase().includes(term)
    );
  }, [predictions, driverSearch]);

  return (
    <Card className="border-zinc-800 bg-carbon-900/95 shadow-2xl">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                {isUpcoming ? "Pre-Race Outcome Predictor (AI Heuristics)" : "Grand Prix Outcome Predictor (AI Heuristics)"}
              </CardTitle>
              <Badge
                variant={isUpcoming ? "racing" : "pro"}
                className="text-[10px] font-mono uppercase"
              >
                {isUpcoming ? `PRE-RACE FORECAST • R${selectedGP.round}` : "CLIENT HEURISTICS"}
              </Badge>
              <Badge variant="outline" className="text-[10px] font-mono text-zinc-400">
                ALL 20 DRIVERS
              </Badge>
            </div>
            <CardDescription className="text-xs text-zinc-400 mt-1">
              Statistical probability model weighing championship form, qualifying pace deltas, and {selectedGP.circuitName}&apos;s overtaking index.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-zinc-950 p-1.5 px-3 rounded-lg border border-zinc-800 text-xs font-mono shrink-0">
            <span className="text-zinc-500">Track:</span>
            <span className="text-white font-bold">{circuit.circuitName}</span>
            <Badge variant="outline" className="text-[10px]">
              {circuit.overtakingDifficulty} Overtake Delta
            </Badge>
          </div>
        </div>

        {isUpcoming && (
          <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-mono flex items-start gap-2.5">
            <span className="font-bold text-amber-400 shrink-0">UPCOMING ROUND {selectedGP.round}:</span>
            <p className="leading-relaxed">
              The {selectedGP.name} has not started yet. Below is the pre-event statistical simulation modeling projected win percentages and Top-3 podium probabilities based on championship momentum and track overtaking characteristics.
            </p>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Top 3 Podium Favorite Highlight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {predictions.slice(0, 3).map((pred, i) => (
            <div
              key={pred.driverId}
              className={`p-4 rounded-xl border relative overflow-hidden flex flex-col justify-between ${
                i === 0
                  ? "bg-gradient-to-br from-amber-500/10 via-carbon-950 to-carbon-900 border-amber-500/40 shadow-lg shadow-amber-500/5"
                  : "bg-carbon-950/80 border-zinc-800"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-xs font-mono ${
                      i === 0
                        ? "bg-amber-400 text-black shadow-md shadow-amber-400/40"
                        : i === 1
                        ? "bg-zinc-200 text-black"
                        : "bg-amber-700 text-white"
                    }`}
                  >
                    P{pred.predictedPosition}
                  </span>
                  <div>
                    <h4 className="font-extrabold text-sm text-white">{pred.driverName}</h4>
                    <span className="text-[11px] text-zinc-400 font-mono">{pred.constructorName}</span>
                  </div>
                </div>

                <Badge variant={i === 0 ? "racing" : "secondary"} className="text-[10px] font-mono">
                  GRID P{pred.gridPosition}
                </Badge>
              </div>

              {/* Probability Bars */}
              <div className="mt-4 space-y-2 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                    <span>Win Chance:</span>
                    <span className="font-bold text-white">{pred.winProbability}%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-racing-red rounded-full transition-all duration-500"
                      style={{ width: `${pred.winProbability}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                    <span>Podium (Top 3):</span>
                    <span className="font-bold text-emerald-400">{pred.podiumProbability}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${pred.podiumProbability}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Factors */}
              <div className="mt-3 pt-3 border-t border-zinc-800/80 text-[10px] text-zinc-400 space-y-1">
                {pred.keyFactors.slice(0, 2).map((factor, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 truncate">
                    <span className="w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                    <span className="truncate">{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Prediction Table for ALL 20 drivers with driver search */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-mono font-bold text-white">
              Full Predicted Classification ({filteredPredictions.length} Drivers)
            </span>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Find driver / team..."
                value={driverSearch}
                onChange={(e) => setDriverSearch(e.target.value)}
                className="pl-8 pr-3 py-1 bg-zinc-950 border border-zinc-800 rounded text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-racing-red w-48"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-zinc-800">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-zinc-950 text-zinc-400 text-[11px] uppercase tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="py-2.5 px-3">Predicted</th>
                  <th className="py-2.5 px-3">Driver</th>
                  <th className="py-2.5 px-3">Team</th>
                  <th className="py-2.5 px-3 text-center">Grid Slot</th>
                  <th className="py-2.5 px-3 text-right">Win %</th>
                  <th className="py-2.5 px-3 text-right">Podium %</th>
                  <th className="py-2.5 px-3 text-right">Top 10 %</th>
                  <th className="py-2.5 px-3 text-right">Est. Gap</th>
                  <th className="py-2.5 px-3">Primary Factor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filteredPredictions.map((p) => (
                  <tr key={p.driverId} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-white">P{p.predictedPosition}</td>
                    <td className="py-2.5 px-3 text-white font-medium">{p.driverName}</td>
                    <td className="py-2.5 px-3 text-zinc-400">{p.constructorName}</td>
                    <td className="py-2.5 px-3 text-center text-zinc-300">P{p.gridPosition}</td>
                    <td className="py-2.5 px-3 text-right text-amber-400 font-bold">{p.winProbability}%</td>
                    <td className="py-2.5 px-3 text-right text-emerald-400">{p.podiumProbability}%</td>
                    <td className="py-2.5 px-3 text-right text-zinc-300">{p.top10Probability}%</td>
                    <td className="py-2.5 px-3 text-right text-zinc-400">{p.predictedGapToWinner}</td>
                    <td className="py-2.5 px-3 text-zinc-400 text-[11px] truncate max-w-xs">
                      {p.keyFactors[0] || "Baseline qualification pace"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Model Transparency & Disclaimer Notice */}
        <div className="p-3.5 rounded-lg bg-zinc-950/80 border border-zinc-800/80 flex items-start gap-3 text-xs text-zinc-400">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-zinc-300 block">
              Statistical Estimation Disclaimer
            </span>
            <p className="text-[11px] leading-relaxed">
              These outputs are generated entirely in your browser using statistical heuristics
              (weighting grid qualification, qualifying sector deltas, and circuit overtaking characteristics).
              Formula 1 race conditions involve random events (safety cars, mechanical reliability, weather).
              Outputs are estimates only and carry no warranty or financial guarantee.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
