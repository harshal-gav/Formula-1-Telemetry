"use client";

import Link from "next/link";
import { useDrivers, useDriverStandings } from "@/hooks/use-jolpica";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, ChevronRight, User } from "lucide-react";
import { getTeamColor } from "@/lib/utils";

export default function DriversPage() {
  const { data: drivers, isLoading } = useDrivers("current");
  const { data: standings } = useDriverStandings("current");

  // Create a points & rank lookup
  const statsLookup: Record<string, { rank: string; points: string; constructorName?: string; constructorId?: string }> = {};
  standings?.forEach((s) => {
    statsLookup[s.Driver.driverId] = {
      rank: s.position,
      points: s.points,
      constructorName: s.Constructors[0]?.name,
      constructorId: s.Constructors[0]?.constructorId,
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="racing" className="text-xs">DRIVER ROSTER</Badge>
          <span className="text-xs font-mono text-zinc-500">2026 GRID</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase flex items-center gap-3">
          <Users className="w-8 h-8 text-racing-red" />
          Formula 1 Drivers
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
          Profiles, career numbers, and current championship standings for all active drivers.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {drivers?.map((driver) => {
            const stats = statsLookup[driver.driverId];
            const teamColor = getTeamColor(stats?.constructorId);

            return (
              <Link key={driver.driverId} href={`/drivers/${driver.driverId}`}>
                <Card className="hover:border-zinc-700 bg-carbon-900/90 hover:translate-y-[-2px] transition-all group overflow-hidden relative">
                  <div
                    className="absolute top-0 left-0 w-1.5 h-full"
                    style={{ backgroundColor: teamColor }}
                  />
                  <CardContent className="p-4 pl-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-xl font-black text-zinc-500 group-hover:text-white transition-colors">
                        #{driver.permanentNumber || driver.code || "–"}
                      </span>
                      {stats?.rank && (
                        <Badge variant="outline" className="text-[10px] font-mono">
                          P{stats.rank}
                        </Badge>
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-white group-hover:text-racing-red transition-colors">
                        {driver.givenName} {driver.familyName}
                      </h3>
                      <p className="text-xs text-zinc-400 font-mono mt-0.5">
                        {stats?.constructorName || driver.nationality}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-500">{driver.nationality}</span>
                      <span className="font-bold text-amber-400">
                        {stats?.points ? `${stats.points} pts` : "-"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
