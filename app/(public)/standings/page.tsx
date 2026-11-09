"use client";

import { useDriverStandings, useConstructorStandings } from "@/hooks/use-jolpica";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Users, Shield } from "lucide-react";
import { getTeamColor } from "@/lib/utils";

export default function StandingsPage() {
  const { data: drivers, isLoading: driversLoading } = useDriverStandings("current");
  const { data: constructors, isLoading: constrLoading } = useConstructorStandings("current");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="racing" className="text-xs">WORLD CHAMPIONSHIP</Badge>
          <span className="text-xs font-mono text-zinc-500">2026 SEASON</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase flex items-center gap-3">
          <Trophy className="w-8 h-8 text-amber-400" />
          Championship Standings
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
          Live point standings for both the Driver's World Championship and the Constructor's World Championship.
        </p>
      </div>

      <Tabs defaultValue="drivers">
        <TabsList className="bg-carbon-900 border border-zinc-800">
          <TabsTrigger value="drivers" className="text-xs font-mono gap-1.5">
            <Users className="w-3.5 h-3.5" />
            Driver Standings ({drivers?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="constructors" className="text-xs font-mono gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            Constructor Standings ({constructors?.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* 1. Driver Standings Tab */}
        <TabsContent value="drivers">
          <Card className="border-zinc-800 bg-carbon-900 shadow-xl">
            <CardContent className="p-0">
              {driversLoading ? (
                <div className="p-6 space-y-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="w-full h-10" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead className="bg-zinc-950 text-zinc-400 text-[11px] uppercase tracking-wider border-b border-zinc-800">
                      <tr>
                        <th className="py-3 px-4 text-center w-12">Pos</th>
                        <th className="py-3 px-4">Driver</th>
                        <th className="py-3 px-4">Team</th>
                        <th className="py-3 px-4 text-center">Nationality</th>
                        <th className="py-3 px-4 text-center">Wins</th>
                        <th className="py-3 px-4 text-right">Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {drivers?.map((row) => (
                        <tr key={row.Driver.driverId} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="py-3 px-4 text-center font-bold text-white">
                            <span
                              className={
                                row.position === "1"
                                  ? "text-amber-400 font-extrabold"
                                  : row.position === "2"
                                  ? "text-zinc-200"
                                  : row.position === "3"
                                  ? "text-amber-700"
                                  : "text-zinc-400"
                              }
                            >
                              P{row.position}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-white">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-1 h-3.5 rounded-full"
                                style={{ backgroundColor: getTeamColor(row.Constructors[0]?.constructorId) }}
                              />
                              <span>
                                {row.Driver.givenName} {row.Driver.familyName}
                              </span>
                              {row.Driver.permanentNumber && (
                                <span className="text-zinc-500 text-[10px]">
                                  #{row.Driver.permanentNumber}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-zinc-400">{row.Constructors[0]?.name}</td>
                          <td className="py-3 px-4 text-center text-zinc-400">{row.Driver.nationality}</td>
                          <td className="py-3 px-4 text-center text-zinc-300 font-bold">{row.wins}</td>
                          <td className="py-3 px-4 text-right font-black text-white text-sm">
                            {row.points}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. Constructor Standings Tab */}
        <TabsContent value="constructors">
          <Card className="border-zinc-800 bg-carbon-900 shadow-xl">
            <CardContent className="p-0">
              {constrLoading ? (
                <div className="p-6 space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="w-full h-10" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead className="bg-zinc-950 text-zinc-400 text-[11px] uppercase tracking-wider border-b border-zinc-800">
                      <tr>
                        <th className="py-3 px-4 text-center w-12">Pos</th>
                        <th className="py-3 px-4">Constructor</th>
                        <th className="py-3 px-4 text-center">Nationality</th>
                        <th className="py-3 px-4 text-center">Wins</th>
                        <th className="py-3 px-4 text-right">Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {constructors?.map((row) => (
                        <tr key={row.Constructor.constructorId} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="py-3 px-4 text-center font-bold text-white">
                            <span
                              className={
                                row.position === "1"
                                  ? "text-amber-400 font-extrabold"
                                  : row.position === "2"
                                  ? "text-zinc-200"
                                  : row.position === "3"
                                  ? "text-amber-700"
                                  : "text-zinc-400"
                              }
                            >
                              P{row.position}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-white">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-1.5 h-4 rounded-full"
                                style={{ backgroundColor: getTeamColor(row.Constructor.constructorId) }}
                              />
                              <span className="text-sm">{row.Constructor.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center text-zinc-400">{row.Constructor.nationality}</td>
                          <td className="py-3 px-4 text-center text-zinc-300 font-bold">{row.wins}</td>
                          <td className="py-3 px-4 text-right font-black text-white text-sm">
                            {row.points}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

