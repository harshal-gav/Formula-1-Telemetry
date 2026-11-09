import Link from "next/link";
import { Race } from "@/lib/api/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, ChevronRight, Flag } from "lucide-react";
import { formatRaceDate } from "@/lib/utils";

export function RaceCard({ race }: { race: Race }) {
  const raceDate = new Date(`${race.date}T${race.time || "00:00:00Z"}`);
  const isPast = raceDate < new Date();

  return (
    <Link href={`/races/${race.round}`}>
      <Card className="hover:border-zinc-700 transition-all hover:translate-y-[-2px] bg-carbon-900/80 group">
        <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-zinc-500">
                ROUND {race.round}
              </span>
              <Badge variant={isPast ? "secondary" : "racing"} className="text-[10px]">
                {isPast ? "COMPLETED" : "UPCOMING"}
              </Badge>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
          </div>

          <div>
            <h3 className="font-extrabold text-base text-white group-hover:text-racing-red transition-colors tracking-tight">
              {race.raceName}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1 font-mono">
              <MapPin className="w-3.5 h-3.5 text-zinc-500" />
              <span>{race.Circuit.circuitName}</span>
              <span>•</span>
              <span>{race.Circuit.Location.country}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              <span>{formatRaceDate(race.date, race.time)}</span>
            </div>
            {race.Results && race.Results.length > 0 && (
              <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                <Flag className="w-3 h-3" />
                Winner: {race.Results[0].Driver.familyName}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

