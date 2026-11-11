"use client";

import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function FAQAccordion({
  items,
  title = "Frequently Asked Questions",
  subtitle = "Clear answers to common questions about Formula 1 telemetry, race strategy, and analytics.",
  className = "",
}: FAQAccordionProps) {
  return (
    <section aria-label="Frequently Asked Questions" className={`space-y-6 w-full ${className}`}>
      {(title || subtitle) && (
        <div className="text-center space-y-2 mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400">
            <HelpCircle className="w-3.5 h-3.5 text-racing-red" />
            <span>KNOWLEDGE BASE</span>
          </div>
          {title && <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">{title}</h2>}
          {subtitle && <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">{subtitle}</p>}
        </div>
      )}

      <div className="space-y-3 max-w-3xl mx-auto">
        {items.map((item, idx) => (
          <details
            key={idx}
            className="group rounded-xl border border-zinc-800/80 bg-carbon-900/70 p-4 transition-colors hover:border-zinc-700/80 open:border-zinc-700 open:bg-carbon-900"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between text-xs sm:text-sm font-bold text-white transition-colors group-hover:text-racing-red focus:outline-none">
              <span className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-zinc-500 font-normal">0{idx + 1}.</span>
                <span>{item.question}</span>
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 group-open:rotate-180 group-hover:text-white" />
            </summary>
            <div className="mt-3 pt-3 border-t border-zinc-800/60 text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
              <p>{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

