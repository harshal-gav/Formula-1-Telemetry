import { NextResponse } from "next/server";
import { GRAND_PRIX_LIST } from "@/lib/grand-prix";
import { PRO_DRIVERS } from "@/lib/drivers";

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  const payload = {
    title: "Formula 1 Telemetry Public Results & Standings Feed",
    description: "Official 2026 World Championship race results, circuit telemetry benchmarks, and standings.",
    link: "https://www.formula1telemetry.com",
    lastUpdated: "2026-11-10T18:00:00Z",
    season: 2026,
    standings: {
      drivers: PRO_DRIVERS.map((d) => ({
        rank: d.championshipRank,
        name: d.name,
        code: d.code,
        number: d.number,
        constructor: d.constructorName,
        points: d.seasonPoints,
        paceOffsetKmH: d.speedOffset,
        profileUrl: `https://www.formula1telemetry.com/drivers/${d.id}`,
      })),
    },
    races: GRAND_PRIX_LIST.map((gp) => ({
      round: gp.round,
      name: gp.name,
      circuit: gp.circuitName,
      country: gp.country,
      status: gp.status,
      lapDistanceMeters: gp.lapDistanceMeters,
      totalLaps: gp.totalLaps,
      topSpeedTrapKmH: gp.topSpeedTrapKmH,
      drsZones: gp.drsZones,
      lapRecord: gp.lapRecord,
      raceUrl: `https://www.formula1telemetry.com/races/${gp.round}`,
      circuitUrl: `https://www.formula1telemetry.com/circuits/${gp.id}`,
    })),
  };

  return NextResponse.json(payload, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

