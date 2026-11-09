import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ProBadge({ className }: { className?: string }) {
  return (
    <Badge
      variant="pro"
      className={`inline-flex items-center gap-1 uppercase tracking-wider text-[10px] py-0.5 px-2 bg-gradient-to-r from-amber-500/20 via-racing-red/20 to-purple-500/20 border-amber-500/50 text-amber-300 font-bold ${className}`}
    >
      <Sparkles className="w-3 h-3 text-amber-400" />
      PRO
    </Badge>
  );
}
