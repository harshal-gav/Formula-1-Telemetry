import { Sparkles } from "lucide-react";

interface QuickAnswerProps {
  question: string;
  answer: string;
  className?: string;
}

export function QuickAnswer({ question, answer, className = "" }: QuickAnswerProps) {
  return (
    <aside
      aria-label="Direct Answer Summary"
      className={`rounded-xl border-l-4 border-l-racing-red border-y border-r border-zinc-800/80 bg-carbon-900/60 p-3.5 sm:p-4.5 backdrop-blur-sm shadow-md space-y-1.5 ${className}`}
    >
      <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-racing-red">
        <Sparkles className="w-3.5 h-3.5 text-racing-red" />
        <span>Direct Answer</span>
      </div>
      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
        <strong className="text-white font-semibold">{question} </strong>
        {answer}
      </p>
    </aside>
  );
}

