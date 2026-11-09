"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  predictRaceOutcomes,
  DriverPredictionInput,
  CircuitContext,
  PredictionResult,
} from "@/lib/prediction/model";
import { Trophy, Sparkles, AlertCircle, ArrowUpRight, BarChart2 } from "lucide-react";

const SAMPLE_GRID_INPUT: DriverPredictionInput[] = [
  {
    driverId: "norris",
    driverName: "Lando Norris",
    driverNumber: "4",
    constructorId: "mclaren",
    constructorName: "McLaren",
    gridPosition: 1,
    qualifyingGapToPoleSeconds: 0.0,
    seasonPoints: 345,
    driverChampionshipRank: 1,
  },
  {
    driverId: "max_verstappen",
    driverName: "Max Verstappen",
    driverNumber: "1",
    constructorId: "red_bull",
    constructorName: "Red Bull",
    gridPosition: 2,
    qualifyingGapToPoleSeconds: 0.085,
    seasonPoints: 338,
    driverChampionshipRank: 2,
  },
  {
    driverId: "leclerc",
    driverName: "Charles Leclerc",
    driverNumber: "16",
    constructorId: "ferrari",
    constructorName: "Ferrari",
    gridPosition: 3,
    qualifyingGapToPoleSeconds: 0.142,
    seasonPoints: 302,
    driverChampionshipRank: 3,
  },
  {
    driverId: "russell",
    driverName: "George Russell",
    driverNumber: "63",
    constructorId: "mercedes",
    constructorName: "Mercedes",
    gridPosition: 4,
    qualifyingGapToPoleSeconds: 0.210,
    seasonPoints: 215,
    driverChampionshipRank: 4,
  },
  {
    driverId: "piastri",
    driverName: "Oscar Piastri",
    driverNumber: "81",
    constructorId: "mclaren",
    constructorName: "McLaren",
    gridPosition: 5,
    qualifyingGapToPoleSeconds: 0.260,
    seasonPoints: 235,
    driverChampionshipRank: 5,
  },
  {
    driverId: "hamilton",
    driverName: "Lewis Hamilton",
    driverNumber: "44",
    constructorId: "ferrari",
    constructorName: "Ferrari",
    gridPosition: 6,
    qualifyingGapToPoleSeconds: 0.320,
    seasonPoints: 195,
    driverChampionshipRank: 6,
  },
];

const DEFAULT_CIRCUIT: CircuitContext = {
  circuitId: "spa",
  circuitName: "Circuit de Spa-Francorchamps",
  overtakingDifficulty: "Low",
  safetyCarProbability: 0.65,
  totalLaps: 44,
};

export function PredictorCard() {
  const [circuit, setCircuit] = useState<CircuitContext>(DEFAULT_CIRCUIT);
  const predictions: PredictionResult[] = predictRaceOutcomes(SAMPLE_GRID_INPUT, circuit);

  return (
    <Card className="border-zinc-800 bg-carbon-900/95 shadow-2xl">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Grand Prix Outcome Predictor (AI Heuristics)
              </CardTitle>
              <Badge variant="pro">CLIENT HEURISTICS</Badge>
            </div>
            <CardDescription className="text-xs text-zinc-400 mt-1">
              Statistical probability model weighing grid slot, telemetry pace, and circuit overtaking index.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-lg border border-zinc-800 text-xs font-mono">
            <span className="text-zinc-500">Track:</span>
            <span className="text-white font-bold">{circuit.circuitName}</span>
            <Badge variant="outline" className="text-[10px]">
              {circuit.overtakingDifficulty} Overtake Delta
            </Badge>
          </div>
        </div>
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
                      className="h-full bg-gradient-to-r from-amber-400 to-racing-red rounded-full"
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
                      className="h-full bg-emerald-500 rounded-full"
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

        {/* Detailed Prediction Table for remaining drivers */}
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
                <th className="py-2.5 px-3">Primary Factor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {predictions.map((p) => (
                <tr key={p.driverId} className="hover:bg-zinc-800/30">
                  <td className="py-2.5 px-3 font-bold text-white">P{p.predictedPosition}</td>
                  <td className="py-2.5 px-3 text-white font-medium">{p.driverName}</td>
                  <td className="py-2.5 px-3 text-zinc-400">{p.constructorName}</td>
                  <td className="py-2.5 px-3 text-center text-zinc-300">P{p.gridPosition}</td>
                  <td className="py-2.5 px-3 text-right text-amber-400 font-bold">{p.winProbability}%</td>
                  <td className="py-2.5 px-3 text-right text-emerald-400">{p.podiumProbability}%</td>
                  <td className="py-2.5 px-3 text-right text-zinc-300">{p.top10Probability}%</td>
                  <td className="py-2.5 px-3 text-zinc-400 text-[11px] truncate max-w-xs">
                    {p.keyFactors[0] || "Baseline qualification pace"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

