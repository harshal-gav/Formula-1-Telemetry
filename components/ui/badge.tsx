import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "racing" | "pro";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-zinc-800 text-zinc-100",
    secondary: "border-transparent bg-zinc-700/60 text-zinc-200",
    destructive: "border-transparent bg-red-950/80 text-red-400 border border-red-800/40",
    outline: "border-zinc-700 text-zinc-400",
    racing: "border-transparent bg-racing-red/20 text-racing-red border border-racing-red/40 font-mono font-semibold",
    pro: "border-transparent bg-gradient-to-r from-amber-500/20 via-racing-red/20 to-purple-500/20 text-amber-300 border border-amber-500/40 font-mono font-semibold",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };

