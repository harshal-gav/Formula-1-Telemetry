import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format milliseconds into standard F1 lap time string (e.g. 1:23.456)
 */
export function formatLapTime(timeInSecondsOrMs: number | string | null | undefined): string {
  if (timeInSecondsOrMs == null || timeInSecondsOrMs === "") return "--:--.---";
  
  if (typeof timeInSecondsOrMs === "string") {
    // If already in MM:SS.mmm format
    if (timeInSecondsOrMs.includes(":") || timeInSecondsOrMs.includes(".")) {
      return timeInSecondsOrMs;
    }
    timeInSecondsOrMs = parseFloat(timeInSecondsOrMs);
  }

  if (isNaN(timeInSecondsOrMs)) return "--:--.---";

  // Check if milliseconds (usually > 1000 for a lap time > 1 second)
  let totalSeconds = timeInSecondsOrMs;
  if (totalSeconds > 1000) {
    totalSeconds = totalSeconds / 1000;
  }

  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  const seconds = Math.floor(remainingSeconds);
  const milliseconds = Math.floor((remainingSeconds - seconds) * 1000);

  const formattedMin = minutes > 0 ? `${minutes}:` : "";
  const formattedSec = minutes > 0 ? seconds.toString().padStart(2, "0") : seconds.toString();
  const formattedMs = milliseconds.toString().padStart(3, "0");

  return `${formattedMin}${formattedSec}.${formattedMs}`;
}

/**
 * Format gap delta string (+1.234s or LAP)
 */
export function formatGap(gap: string | number | null | undefined): string {
  if (gap == null || gap === "") return "-";
  const str = String(gap);
  if (str.startsWith("+") || str.includes("LAP") || str === "LEADER") {
    return str;
  }
  const num = parseFloat(str);
  if (!isNaN(num)) {
    return num > 0 ? `+${num.toFixed(3)}s` : "LEADER";
  }
  return str;
}

/**
 * Format date string into human readable F1 weekend date (e.g. "Mar 22 - 24, 2026")
 */
export function formatRaceDate(dateString: string, timeString?: string): string {
  try {
    const date = new Date(dateString + (timeString ? `T${timeString}` : "T00:00:00Z"));
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Get compound color code
 */
export function getCompoundColor(compound: string | null | undefined): string {
  const c = (compound || "").toUpperCase();
  if (c.includes("SOFT")) return "#e10600";
  if (c.includes("MEDIUM")) return "#ffd12f";
  if (c.includes("HARD")) return "#ffffff";
  if (c.includes("INTER")) return "#39b54a";
  if (c.includes("WET")) return "#0072ce";
  return "#9ca3af";
}

/**
 * Team primary colors for visual branding
 */
export const TEAM_COLORS: Record<string, string> = {
  mclaren: "#FF8000",
  ferrari: "#E80020",
  red_bull: "#3671C6",
  mercedes: "#27F4D2",
  aston_martin: "#229971",
  alpine: "#FF87BC",
  williams: "#64C4FF",
  haas: "#B6BABD",
  rb: "#6692FF",
  sauber: "#52E252",
  audi: "#52E252",
  cadillac: "#C8102E",
};

export function getTeamColor(constructorId: string | null | undefined): string {
  if (!constructorId) return "#71717a";
  const id = constructorId.toLowerCase().replace(/[\s-]/g, "_");
  return TEAM_COLORS[id] || "#71717a";
}
