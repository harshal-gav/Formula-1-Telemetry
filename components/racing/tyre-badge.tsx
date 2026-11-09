import { getCompoundColor } from "@/lib/utils";

export function TyreBadge({ compound, laps }: { compound: string; laps?: number }) {
  const color = getCompoundColor(compound);

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border"
      style={{
        borderColor: `${color}60`,
        backgroundColor: `${color}15`,
        color: color === "#ffffff" ? "#f4f4f5" : color,
      }}
    >
      <span
        className="w-2 h-2 rounded-full inline-block"
        style={{ backgroundColor: color }}
      />
      <span>{compound}</span>
      {laps !== undefined && <span className="opacity-75">({laps}L)</span>}
    </span>
  );
}

