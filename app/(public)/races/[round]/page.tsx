"use client";

import { use } from "react";
import Link from "next/link";
import { useRaceResults, useQualifying, usePitStops } from "@/hooks/use-jolpica";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Calendar, ArrowLeft, Zap } from "lucide-react";
import { formatRaceDate, getTeamColor } from "@/lib/utils";

export default function RaceRoundPage({
  params,
}: {
  params: Promise<{ round: string }>;
}) {
  const resolvedParams = use(params);
  const round = resolvedParams.round;

  const { data: race, isLoading: raceLoading } = useRaceResults("current", round);
  const { data: qual, isLoading: qualLoading } = useQualifying("current", round);
  const { data: pitstops } = usePitStops("current", round);

  if (raceLoading || qualLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-6 w-full max-w-full overflow-hidden">
        <Skeleton className="w-48 h-8" />
        <Skeleton className="w-full h-48 sm:h-64 rounded-xl" />
        <Skeleton className="w-full h-96 rounded-xl" />
      </div>
    );
  }

  if (!race) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center space-y-4 w-full">
        <h2 className="text-xl font-bold text-white">Grand Prix Not Found</h2>
        <p className="text-xs text-zinc-400">Data for round {round} is not available yet.</p>
        <Link href="/races">
          <Button variant="outline" size="sm">Back to Calendar</Button>
        </Link>
      </div>
    );
  }

  const results = race.Results || [];
  const qualResults = qual?.QualifyingResults || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full max-w-full overflow-hidden">
      {/* Back Link */}
      <Link
        href="/races"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Race Calendar</span>
      </Link>

      {/* Weekend Header Card */}
      <Card className="border-zinc-800 bg-carbon-900 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-racing-red/10 rounded-full blur-3xl pointer-events-none" />
        <CardContent className="p-5 sm:p-7 space-y-4 relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="racing" className="text-xs font-mono">
                ROUND {race.round} • {race.season || "CHAMPIONSHIP"}
              </Badge>
              {results.length > 0 ? (
                <Badge variant="secondary" className="text-[10px] font-mono uppercase">
                  Official Classification
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] font-mono text-amber-400 border-amber-400/40 uppercase">
                  Upcoming Session
                </Badge>
              )}
            </div>

            <Link href="/pro/telemetry" className="w-full sm:w-auto">
              <Button variant="pro" size="sm" className="w-full sm:w-auto text-xs gap-1.5 h-8">
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                View Pro Telemetry Trace
              </Button>
            </Link>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
              {race.raceName}
            </h1>
            <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs font-mono text-zinc-400 mt-2">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <MapPin className="w-3.5 h-3.5 text-racing-red shrink-0" />
                <span>{race.Circuit.circuitName}, {race.Circuit.Location.country}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span>{formatRaceDate(race.date, race.time)}</span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs: Race Classification, Qualifying, Pit Stops */}
      <Tabs defaultValue="race" className="w-full">
        <TabsList className="bg-carbon-900 border border-zinc-800 w-full justify-start overflow-x-auto no-scrollbar">
          <TabsTrigger value="race" className="text-xs font-mono">
            Race Classification ({results.length})
          </TabsTrigger>
          <TabsTrigger value="qualifying" className="text-xs font-mono">
            Qualifying Results ({qualResults.length})
          </TabsTrigger>
          <TabsTrigger value="pitstops" className="text-xs font-mono">
            Pit Stops ({pitstops?.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* 1. Race Classification Tab */}
        <TabsContent value="race" className="w-full">
          <Card className="border-zinc-800 bg-carbon-900 shadow-xl overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-zinc-950 text-zinc-400 text-[11px] uppercase tracking-wider border-b border-zinc-800">
                    <tr>
                      <th className="py-2.5 px-3 sm:px-4 text-center w-10 sm:w-12">Pos</th>
                      <th className="py-2.5 px-3 sm:px-4">Driver</th>
                      <th className="py-2.5 px-3 sm:px-4 hidden md:table-cell">Team</th>
                      <th className="py-2.5 px-3 text-center hidden sm:table-cell">Grid</th>
                      <th className="py-2.5 px-3 text-center hidden sm:table-cell">Laps</th>
                      <th className="py-2.5 px-3 sm:px-4 text-right">Time / Gap</th>
                      <th className="py-2.5 px-3 text-right hidden lg:table-cell">Fastest Lap</th>
                      <th className="py-2.5 px-3 sm:px-4 text-right">Pts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {results.length > 0 ? (
                      results.map((res) => (
                        <tr key={res.number} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="py-2.5 px-3 sm:px-4 text-center font-bold text-white">
                            <span
                              className={`inline-block w-6 text-center ${
                                res.position === "1"
                                  ? "text-amber-400 font-extrabold"
                                  : res.position === "2"
                                  ? "text-zinc-200"
                                  : res.position === "3"
                                  ? "text-amber-700"
                                  : "text-zinc-400"
                              }`}
                            >
                              {res.positionText || res.position}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 sm:px-4 font-bold text-white">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-1 h-3.5 rounded-full shrink-0"
                                style={{ backgroundColor: getTeamColor(res.Constructor.constructorId) }}
                              />
                              <div className="min-w-0">
                                <span className="block truncate">
                                  {res.Driver.givenName} {res.Driver.familyName}
                                </span>
                                <span className="text-zinc-500 text-[10px] block md:hidden truncate font-normal">
                                  {res.Constructor.name}
                                </span>
                              </div>
                              <span className="text-zinc-500 text-[10px] hidden sm:inline">#{res.number}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 sm:px-4 text-zinc-400 hidden md:table-cell">
                            {res.Constructor.name}
                          </td>
                          <td className="py-2.5 px-3 text-center text-zinc-400 hidden sm:table-cell">{res.grid}</td>
                          <td className="py-2.5 px-3 text-center text-zinc-300 hidden sm:table-cell">{res.laps}</td>
                          <td className="py-2.5 px-3 sm:px-4 text-right text-zinc-200 font-bold whitespace-nowrap">
                            {res.Time?.time || res.status}
                          </td>
                          <td className="py-2.5 px-3 text-right hidden lg:table-cell">
                            {res.FastestLap ? (
                              <span
                                className={
                                  res.FastestLap.rank === "1"
                                    ? "text-purple-400 font-bold underline"
                                    : "text-zinc-400"
                                }
                              >
                                {res.FastestLap.Time.time}
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="py-2.5 px-3 sm:px-4 text-right font-bold text-amber-400">
                            {res.points > "0" ? `+${res.points}` : "0"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-zinc-500 font-mono text-xs">
                          Classification results not published yet for this round.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. Qualifying Results Tab */}
        <TabsContent value="qualifying" className="w-full">
          <Card className="border-zinc-800 bg-carbon-900 shadow-xl overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-zinc-950 text-zinc-400 text-[11px] uppercase tracking-wider border-b border-zinc-800">
                    <tr>
                      <th className="py-2.5 px-3 sm:px-4 text-center w-10 sm:w-12">Pos</th>
                      <th className="py-2.5 px-3 sm:px-4">Driver</th>
                      <th className="py-2.5 px-3 sm:px-4 hidden md:table-cell">Team</th>
                      <th className="py-2.5 px-3 text-right hidden sm:table-cell">Q1</th>
                      <th className="py-2.5 px-3 text-right hidden sm:table-cell">Q2</th>
                      <th className="py-2.5 px-3 sm:px-4 text-right">Q3 / Best</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {qualResults.length > 0 ? (
                      qualResults.map((q) => (
                        <tr key={q.number} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="py-2.5 px-3 sm:px-4 text-center font-bold text-white">
                            P{q.position}
                          </td>
                          <td className="py-2.5 px-3 sm:px-4 font-bold text-white">
                            <div className="min-w-0">
                              <span className="block truncate">
                                {q.Driver.givenName} {q.Driver.familyName}
                              </span>
                              <span className="text-zinc-500 text-[10px] block md:hidden truncate font-normal">
                                {q.Constructor.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 sm:px-4 text-zinc-400 hidden md:table-cell">{q.Constructor.name}</td>
                          <td className="py-2.5 px-3 text-right text-zinc-300 hidden sm:table-cell">{q.Q1 || "-"}</td>
                          <td className="py-2.5 px-3 text-right text-zinc-300 hidden sm:table-cell">{q.Q2 || "-"}</td>
                          <td className="py-2.5 px-3 sm:px-4 text-right text-amber-400 font-bold whitespace-nowrap">
                            {q.Q3 || q.Q2 || q.Q1 || "-"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-zinc-500 font-mono text-xs">
                          Qualifying results not published yet for this round.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. Pit Stops Tab */}
        <TabsContent value="pitstops" className="w-full">
          <Card className="border-zinc-800 bg-carbon-900 shadow-xl overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-zinc-950 text-zinc-400 text-[11px] uppercase tracking-wider border-b border-zinc-800">
                    <tr>
                      <th className="py-2.5 px-3 sm:px-4">Driver</th>
                      <th className="py-2.5 px-3 text-center">Stop</th>
                      <th className="py-2.5 px-3 text-center">Lap</th>
                      <th className="py-2.5 px-3 text-right hidden sm:table-cell">Time of Day</th>
                      <th className="py-2.5 px-3 sm:px-4 text-right">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {pitstops && pitstops.length > 0 ? (
                      pitstops.map((stop, i) => (
                        <tr key={i} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="py-2.5 px-3 sm:px-4 text-white font-bold">{stop.driverId}</td>
                          <td className="py-2.5 px-3 text-center text-zinc-300">#{stop.stop}</td>
                          <td className="py-2.5 px-3 text-center text-zinc-300">{stop.lap}</td>
                          <td className="py-2.5 px-3 text-right text-zinc-400 hidden sm:table-cell">{stop.time}</td>
                          <td className="py-2.5 px-3 sm:px-4 text-right text-amber-400 font-bold whitespace-nowrap">
                            {stop.duration}s
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-zinc-500 font-mono text-xs">
                          Pit stop timestamps not logged for this session.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
