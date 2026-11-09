"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { useRaces, useDriverStandings, useConstructorStandings, useRaceResults } from "@/hooks/use-jolpica";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProBadge } from "@/components/layout/pro-badge";
import { RaceCard } from "@/components/racing/race-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Trophy,
  Users,
  Activity,
  ArrowRight,
  Zap,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";
import { formatRaceDate, getTeamColor } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuth();
  const { isPro } = useSubscription();

  const { data: races, isLoading: racesLoading } = useRaces("current");
  const { data: driverStandings, isLoading: driversLoading } = useDriverStandings("current");
  const { data: constructorStandings, isLoading: constrLoading } = useConstructorStandings("current");
  const { data: lastRace, isLoading: lastRaceLoading } = useRaceResults("current", "last");

  // Determine next upcoming race
  const upcomingRace = races?.find((r) => {
    const raceDate = new Date(`${r.date}T${r.time || "00:00:00Z"}`);
    return raceDate >= new Date();
  }) || races?.[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Paddock Overview
            </h1>
            {isPro ? <ProBadge /> : <Badge variant="secondary" className="font-mono text-xs">FREE PASS</Badge>}
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Welcome back, <span className="text-zinc-200 font-semibold">{user?.displayName || user?.email || "Racer"}</span>.
            Live season pulse and standings.
          </p>
        </div>

        {!isPro && (
          <Link href="/pricing">
            <Button variant="racing" size="sm" className="font-semibold text-xs gap-1.5 shadow-md shadow-racing-red/20">
              <Sparkles className="w-3.5 h-3.5" />
              Upgrade to Pro ($9.99/mo)
            </Button>
          </Link>
        )}
      </div>

      {/* Main Grid: Upcoming Grand Prix & Latest Podium */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Grand Prix Card */}
        <div className="lg:col-span-2">
          {racesLoading ? (
            <Skeleton className="w-full h-64" />
          ) : upcomingRace ? (
            <Card className="border-racing-red/40 bg-gradient-to-br from-carbon-900 via-carbon-900 to-carbon-950 shadow-xl relative overflow-hidden h-full flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-64 h-64 bg-racing-red/10 rounded-full blur-3xl pointer-events-none" />

              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="racing" className="text-[10px] font-mono">
                    NEXT GRAND PRIX • ROUND {upcomingRace.round}
                  </Badge>
                  <span className="text-xs font-mono text-zinc-400">
                    {formatRaceDate(upcomingRace.date, upcomingRace.time)}
                  </span>
                </div>
                <CardTitle className="text-2xl sm:text-3xl font-black text-white mt-2">
                  {upcomingRace.raceName}
                </CardTitle>
                <CardDescription className="text-xs text-zinc-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-racing-red" />
                  {upcomingRace.Circuit.circuitName}, {upcomingRace.Circuit.Location.country}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px] uppercase">Circuit Lat/Long</span>
                    <span className="text-zinc-200 font-bold">
                      {upcomingRace.Circuit.Location.lat}° / {upcomingRace.Circuit.Location.long}°
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px] uppercase">Session Start</span>
                    <span className="text-zinc-200 font-bold">
                      {upcomingRace.time || "14:00:00Z"}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 col-span-2 sm:col-span-1">
                    <span className="text-zinc-500 block text-[10px] uppercase">Track Status</span>
                    <span className="text-emerald-400 font-bold">Scheduled</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link href={`/races/${upcomingRace.round}`}>
                    <Button variant="secondary" size="sm" className="text-xs gap-1.5">
                      <span>Race Details & Timetable</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                  <Link href="/pro/predictor">
                    <Button variant="outline" size="sm" className="text-xs gap-1.5 text-amber-400 border-amber-500/40">
                      <Sparkles className="w-3.5 h-3.5" />
                      View AI Win Probabilities
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>

        {/* Latest Race Podium Finish */}
        <div>
          {lastRaceLoading ? (
            <Skeleton className="w-full h-64" />
          ) : lastRace && lastRace.Results ? (
            <Card className="border-zinc-800 bg-carbon-900/90 shadow-xl h-full flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="text-[10px] font-mono">LATEST RESULT</Badge>
                  <span className="text-[11px] font-mono text-zinc-500">R{lastRace.round}</span>
                </div>
                <CardTitle className="text-base font-bold text-white mt-1">
                  {lastRace.raceName}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {lastRace.Results.slice(0, 3).map((result, idx) => (
                  <div
                    key={result.number}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                          idx === 0
                            ? "bg-amber-400 text-black font-extrabold"
                            : idx === 1
                            ? "bg-zinc-200 text-black"
                            : "bg-amber-700 text-white"
                        }`}
                      >
                        P{result.position}
                      </span>
                      <div>
                        <span className="font-bold text-white block">
                          {result.Driver.givenName} {result.Driver.familyName}
                        </span>
                        <span className="text-zinc-500 text-[10px]">
                          {result.Constructor.name}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-zinc-200 font-bold block">
                        +{result.points} pts
                      </span>
                      <span className="text-zinc-500 text-[10px]">
                        {result.Time?.time || result.status}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>

      {/* Standings Row: Top 5 Drivers & Constructors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Drivers Leaderboard */}
        <Card className="border-zinc-800 bg-carbon-900/90 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Users className="w-4 h-4 text-racing-red" />
                Driver Championship Leaders
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Top 5 title contenders in the current season.
              </CardDescription>
            </div>
            <Link href="/standings">
              <Button variant="ghost" size="sm" className="text-xs text-zinc-400 hover:text-white">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {driversLoading ? (
              <div className="p-4 space-y-2">
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/60 font-mono text-xs">
                {driverStandings?.slice(0, 5).map((row) => (
                  <div
                    key={row.Driver.driverId}
                    className="flex items-center justify-between py-2.5 px-6 hover:bg-zinc-800/30"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-4 text-center font-bold text-zinc-400">
                        {row.position}
                      </span>
                      <span
                        className="w-1 h-4 rounded-full"
                        style={{ backgroundColor: getTeamColor(row.Constructors[0]?.constructorId) }}
                      />
                      <div>
                        <span className="font-bold text-white">
                          {row.Driver.givenName} {row.Driver.familyName}
                        </span>
                        <span className="text-zinc-500 text-[10px] block sm:inline sm:ml-2">
                          {row.Constructors[0]?.name}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-white">{row.points} pts</span>
                      <span className="text-[10px] text-zinc-500 block">
                        {row.wins} {row.wins === "1" ? "win" : "wins"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Constructors Leaderboard */}
        <Card className="border-zinc-800 bg-carbon-900/90 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                Constructor Championship
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Top teams battling for the world crown.
              </CardDescription>
            </div>
            <Link href="/standings">
              <Button variant="ghost" size="sm" className="text-xs text-zinc-400 hover:text-white">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {constrLoading ? (
              <div className="p-4 space-y-2">
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/60 font-mono text-xs">
                {constructorStandings?.slice(0, 5).map((row) => (
                  <div
                    key={row.Constructor.constructorId}
                    className="flex items-center justify-between py-2.5 px-6 hover:bg-zinc-800/30"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-4 text-center font-bold text-zinc-400">
                        {row.position}
                      </span>
                      <span
                        className="w-1.5 h-4 rounded-full"
                        style={{ backgroundColor: getTeamColor(row.Constructor.constructorId) }}
                      />
                      <span className="font-bold text-white">
                        {row.Constructor.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-white">{row.points} pts</span>
                      <span className="text-[10px] text-zinc-500 block">
                        {row.wins} wins
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pro Suite Quick Jump Callout */}
      <div className="rounded-xl border border-zinc-800 bg-gradient-to-r from-carbon-900 via-carbon-900 to-carbon-950 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h3 className="text-base font-bold text-white">Advanced Telemetry & Strategy Suite</h3>
            <ProBadge />
          </div>
          <p className="text-xs text-zinc-400">
            Deep dive into car telemetry traces, stint tyre degradation modeling, and session replays.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/pro/telemetry">
            <Button variant="secondary" size="sm" className="text-xs">
              Telemetry Trace
            </Button>
          </Link>
          <Link href="/pro/strategy">
            <Button variant="secondary" size="sm" className="text-xs">
              Tyre Stints
            </Button>
          </Link>
          <Link href="/pro/replay">
            <Button variant="secondary" size="sm" className="text-xs">
              Replay Tower
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
