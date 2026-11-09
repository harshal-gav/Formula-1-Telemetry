import { DriverStanding } from "@/lib/api/types";
import { getTeamColor } from "@/lib/utils";

export function DriverStandingRow({ standing }: { standing: DriverStanding }) {
  const teamColor = getTeamColor(standing.Constructors[0]?.constructorId);

  return (
    <div className="flex items-center justify-between py-2.5 px-4 hover:bg-zinc-800/40 transition-colors font-mono text-xs rounded-lg">
      <div className="flex items-center gap-3">
        <span
          className={`w-6 text-center font-bold ${
            standing.position === "1"
              ? "text-amber-400 font-extrabold"
              : standing.position === "2"
              ? "text-zinc-200"
              : standing.position === "3"
              ? "text-amber-700"
              : "text-zinc-400"
          }`}
        >
          {standing.position}
        </span>
        <span
          className="w-1.5 h-4 rounded-full"
          style={{ backgroundColor: teamColor }}
        />
        <div>
          <span className="font-bold text-white">
            {standing.Driver.givenName} {standing.Driver.familyName}
          </span>
          <span className="text-zinc-500 text-[10px] block sm:inline sm:ml-2">
            {standing.Constructors[0]?.name}
          </span>
        </div>
      </div>
      <div className="text-right">
        <span className="font-bold text-white text-sm">{standing.points} pts</span>
        <span className="text-[10px] text-zinc-500 block">
          {standing.wins} {standing.wins === "1" ? "win" : "wins"}
        </span>
      </div>
    </div>
  );
}

