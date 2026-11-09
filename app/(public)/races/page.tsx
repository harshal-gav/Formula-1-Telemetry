"use client";

import { useRaces } from "@/hooks/use-jolpica";
import { RaceCard } from "@/components/racing/race-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

export default function RacesPage() {
  const { data: races, isLoading, error } = useRaces("current");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="racing" className="text-xs">SEASON SCHEDULE</Badge>
          <span className="text-xs font-mono text-zinc-500">24 ROUNDS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase flex items-center gap-3">
          <Calendar className="w-8 h-8 text-racing-red" />
          Grand Prix Calendar
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
          Complete official timetable, circuit locations, and race results powered by the Jolpica-F1 API.
        </p>
      </div>

      {/* Grid of Races */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 rounded-xl bg-carbon-900 border border-red-900 text-center text-xs text-red-400 font-mono">
          Could not load season calendar. Please check your network connection.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {races?.map((race) => (
            <RaceCard key={race.round} race={race} />
          ))}
        </div>
      )}
    </div>
  );
}
