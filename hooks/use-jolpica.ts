"use client";

import { useQuery } from "@tanstack/react-query";
import { jolpica } from "@/lib/api/jolpica";

export function useRaces(season: string = "current") {
  return useQuery({
    queryKey: ["jolpica", "races", season],
    queryFn: () => jolpica.getRaces(season),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useRaceResults(season: string = "current", round: string = "last") {
  return useQuery({
    queryKey: ["jolpica", "results", season, round],
    queryFn: () => jolpica.getRaceResults(season, round),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}

export function useQualifying(season: string = "current", round: string = "last") {
  return useQuery({
    queryKey: ["jolpica", "qualifying", season, round],
    queryFn: () => jolpica.getQualifyingResults(season, round),
    staleTime: 1000 * 60 * 15,
  });
}

export function useDriverStandings(season: string = "current") {
  return useQuery({
    queryKey: ["jolpica", "driverStandings", season],
    queryFn: () => jolpica.getDriverStandings(season),
    staleTime: 1000 * 60 * 20,
  });
}

export function useConstructorStandings(season: string = "current") {
  return useQuery({
    queryKey: ["jolpica", "constructorStandings", season],
    queryFn: () => jolpica.getConstructorStandings(season),
    staleTime: 1000 * 60 * 20,
  });
}

export function useDrivers(season: string = "current") {
  return useQuery({
    queryKey: ["jolpica", "drivers", season],
    queryFn: () => jolpica.getDrivers(season),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function usePitStops(season: string = "current", round: string = "last") {
  return useQuery({
    queryKey: ["jolpica", "pitstops", season, round],
    queryFn: () => jolpica.getPitStops(season, round),
    staleTime: 1000 * 60 * 30,
  });
}

