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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 sm:space-y-8 w-full max-w-full overflow-hidden">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="racing" className="text-xs">WORLD CHAMPIONSHIP</Badge>
          <span className="text-xs font-mono text-zinc-500 uppercase">OFFICIAL STANDINGS</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase flex items-center gap-2.5 sm:gap-3">
          <Trophy className="w-7 h-7 sm:w-8 h-8 text-amber-400 shrink-0" />
          <span>Championship Standings</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
          Point standings and title battles for both the Driver&apos;s World Championship and Constructor&apos;s World Championship.
        </p>
      </div>

      <Tabs defaultValue="drivers" className="w-full">
        <TabsList className="bg-carbon-900 border border-zinc-800 w-full justify-start overflow-x-auto no-scrollbar">
          <TabsTrigger value="drivers" className="text-xs font-mono gap-1.5">
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span>Driver Standings ({drivers?.length || 0})</span>
          </TabsTrigger>
          <TabsTrigger value="constructors" className="text-xs font-mono gap-1.5">
            <Shield className="w-3.5 h-3.5 shrink-0" />
            <span>Constructor Standings ({constructors?.length || 0})</span>
          </TabsTrigger>
        </TabsList>

        {/* 1. Driver Standings Tab */}
        <TabsContent value="drivers" className="w-full">
          <Card className="border-zinc-800 bg-carbon-900 shadow-xl overflow-hidden">
            <CardContent className="p-0">
              {driversLoading ? (
                <div className="p-4 sm:p-6 space-y-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="w-full h-10 rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left font-mono text-xs">
                    <thead className="bg-zinc-950 text-zinc-400 text-[11px] uppercase tracking-wider border-b border-zinc-800">
                      <tr>
                        <th className="py-2.5 px-3 sm:px-4 text-center w-10 sm:w-12">Pos</th>
                        <th className="py-2.5 px-3 sm:px-4">Driver</th>
                        <th className="py-2.5 px-3 sm:px-4 hidden md:table-cell">Team</th>
                        <th className="py-2.5 px-3 text-center hidden sm:table-cell">Country</th>
                        <th className="py-2.5 px-3 text-center hidden sm:table-cell">Wins</th>
                        <th className="py-2.5 px-3 sm:px-4 text-right">Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {drivers?.map((row) => (
                        <tr key={row.Driver.driverId} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="py-2.5 px-3 sm:px-4 text-center font-bold text-white">
                            <span
                              className={`inline-block w-6 text-center ${
                                row.position === "1"
                                  ? "text-amber-400 font-extrabold"
                                  : row.position === "2"
                                  ? "text-zinc-200"
                                  : row.position === "3"
                                  ? "text-amber-700"
                                  : "text-zinc-400"
                              }`}
                            >
                              P{row.position}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 sm:px-4 font-bold text-white">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-1 h-3.5 rounded-full shrink-0"
                                style={{ backgroundColor: getTeamColor(row.Constructors[0]?.constructorId) }}
                              />
                              <div className="min-w-0">
                                <span className="block truncate">
                                  {row.Driver.givenName} {row.Driver.familyName}
                                </span>
                                <span className="text-zinc-500 text-[10px] block md:hidden truncate font-normal">
                                  {row.Constructors[0]?.name}
                                </span>
                              </div>
                              {row.Driver.permanentNumber && (
                                <span className="text-zinc-500 text-[10px] hidden sm:inline">
                                  #{row.Driver.permanentNumber}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 sm:px-4 text-zinc-400 hidden md:table-cell">
                            {row.Constructors[0]?.name}
                          </td>
                          <td className="py-2.5 px-3 text-center text-zinc-400 hidden sm:table-cell">
                            {row.Driver.nationality}
                          </td>
                          <td className="py-2.5 px-3 text-center text-zinc-300 font-bold hidden sm:table-cell">
                            {row.wins}
                          </td>
                          <td className="py-2.5 px-3 sm:px-4 text-right font-black text-white text-sm whitespace-nowrap">
                            {row.points} <span className="text-xs text-zinc-500 font-normal">pts</span>
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
        <TabsContent value="constructors" className="w-full">
          <Card className="border-zinc-800 bg-carbon-900 shadow-xl overflow-hidden">
            <CardContent className="p-0">
              {constrLoading ? (
                <div className="p-4 sm:p-6 space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="w-full h-10 rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left font-mono text-xs">
                    <thead className="bg-zinc-950 text-zinc-400 text-[11px] uppercase tracking-wider border-b border-zinc-800">
                      <tr>
                        <th className="py-2.5 px-3 sm:px-4 text-center w-10 sm:w-12">Pos</th>
                        <th className="py-2.5 px-3 sm:px-4">Constructor</th>
                        <th className="py-2.5 px-3 text-center hidden sm:table-cell">Country</th>
                        <th className="py-2.5 px-3 text-center hidden sm:table-cell">Wins</th>
                        <th className="py-2.5 px-3 sm:px-4 text-right">Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {constructors?.map((row) => (
                        <tr key={row.Constructor.constructorId} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="py-2.5 px-3 sm:px-4 text-center font-bold text-white">
                            <span
                              className={`inline-block w-6 text-center ${
                                row.position === "1"
                                  ? "text-amber-400 font-extrabold"
                                  : row.position === "2"
                                  ? "text-zinc-200"
                                  : row.position === "3"
                                  ? "text-amber-700"
                                  : "text-zinc-400"
                              }`}
                            >
                              P{row.position}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 sm:px-4 font-bold text-white">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-1.5 h-4 rounded-full shrink-0"
                                style={{ backgroundColor: getTeamColor(row.Constructor.constructorId) }}
                              />
                              <span className="text-sm truncate">{row.Constructor.name}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-center text-zinc-400 hidden sm:table-cell">
                            {row.Constructor.nationality}
                          </td>
                          <td className="py-2.5 px-3 text-center text-zinc-300 font-bold hidden sm:table-cell">
                            {row.wins}
                          </td>
                          <td className="py-2.5 px-3 sm:px-4 text-right font-black text-white text-sm whitespace-nowrap">
                            {row.points} <span className="text-xs text-zinc-500 font-normal">pts</span>
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
