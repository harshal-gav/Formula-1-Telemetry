"use client";

import { use } from "react";
import Link from "next/link";
import { useDrivers, useDriverStandings } from "@/hooks/use-jolpica";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProBadge } from "@/components/layout/pro-badge";
import { ArrowLeft, User, Trophy, Flag, Zap, ExternalLink } from "lucide-react";
import { getTeamColor } from "@/lib/utils";

export default function DriverDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const driverId = resolvedParams.id;

  const { data: drivers, isLoading } = useDrivers("current");
  const { data: standings } = useDriverStandings("current");

  const driver = drivers?.find((d) => d.driverId === driverId);
  const standing = standings?.find((s) => s.Driver.driverId === driverId);
  const teamColor = getTeamColor(standing?.Constructors[0]?.constructorId);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-xs font-mono text-zinc-500">
        Loading driver telemetry profile...
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Driver Not Found</h2>
        <Link href="/drivers">
          <Button variant="outline" size="sm">Back to Drivers</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link href="/drivers" className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Driver Grid</span>
      </Link>

      <Card className="border-zinc-800 bg-carbon-900 shadow-xl overflow-hidden relative">
        <div
          className="h-2 w-full"
          style={{ backgroundColor: teamColor }}
        />
        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-2xl font-black text-racing-red">
                  #{driver.permanentNumber || driver.code || "–"}
                </span>
                <span className="text-xs font-mono text-zinc-500 uppercase">{driver.code}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
                {driver.givenName} {driver.familyName}
              </h1>
              <p className="text-xs font-mono text-zinc-400">
                {standing?.Constructors[0]?.name || "Independent"} • {driver.nationality}
              </p>
            </div>

            {standing && (
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-center font-mono">
                <span className="text-xs text-zinc-500 block uppercase">Championship Rank</span>
                <span className="text-3xl font-black text-amber-400">P{standing.position}</span>
                <span className="text-xs text-zinc-400 block mt-1">{standing.points} points</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
              <span className="text-zinc-500 block text-[10px] uppercase">Nationality</span>
              <span className="font-bold text-white">{driver.nationality}</span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
              <span className="text-zinc-500 block text-[10px] uppercase">Date of Birth</span>
              <span className="font-bold text-white">{driver.dateOfBirth || "N/A"}</span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
              <span className="text-zinc-500 block text-[10px] uppercase">Season Wins</span>
              <span className="font-bold text-amber-400">{standing?.wins || "0"}</span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
              <span className="text-zinc-500 block text-[10px] uppercase">Constructor</span>
              <span className="font-bold text-white truncate block">
                {standing?.Constructors[0]?.name || "–"}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4">
            <Link href="/pro/telemetry">
              <Button variant="racing" size="sm" className="text-xs gap-1.5 font-semibold">
                <Zap className="w-3.5 h-3.5 text-white" />
                Compare Telemetry Trace
              </Button>
            </Link>
            {driver.url && (
              <a
                href={driver.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white font-mono"
              >
                <span>Biography</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
