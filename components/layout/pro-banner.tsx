"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, ArrowRight, X } from "lucide-react";
import { useSubscription } from "@/hooks/use-subscription";

export function ProBanner() {
  const { isPro } = useSubscription();
  const [dismissed, setDismissed] = useState(true); // default true to avoid flash

  useEffect(() => {
    // Only show if not dismissed in current session and user is not Pro
    if (typeof window !== "undefined") {
      const isDismissed = sessionStorage.getItem("f1_pro_banner_dismissed");
      if (!isDismissed) {
        setDismissed(false);
      }
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("f1_pro_banner_dismissed", "1");
    }
  };

  if (isPro || dismissed) {
    return null;
  }

  return (
    <aside
      aria-label="Pro Subscription Promotion"
      className="relative z-40 bg-gradient-to-r from-red-950 via-carbon-900 to-zinc-950 border-b border-racing-red/30 px-3 py-2 text-xs"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 font-mono">
        <div className="flex items-center gap-2 text-zinc-300 min-w-0">
          <span className="flex h-2 w-2 rounded-full bg-racing-red animate-pulse shrink-0" />
          <span className="text-[11px] font-bold text-white uppercase tracking-wider hidden sm:inline shrink-0">
            2026 Season Pro Pass:
          </span>
          <span className="text-zinc-300 truncate text-[11px] sm:text-xs">
            Unlock flying lap telemetry traces, tyre degradation &amp; Monte Carlo predictor
          </span>
          <span className="hidden md:inline font-bold text-amber-400 shrink-0">
            $9.99/mo
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-racing-red hover:bg-red-600 text-white font-bold text-[11px] uppercase tracking-wider transition-all shadow-sm shadow-racing-red/40 hover:scale-105"
          >
            <Zap className="w-3 h-3 fill-white" />
            <span>Upgrade to Pro</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss banner"
            className="text-zinc-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

