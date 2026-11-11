"use client";

import Link from "next/link";
import { Zap, ShieldCheck, ArrowRight, CheckCircle2, Activity, Layers, Radio } from "lucide-react";
import { ProBadge } from "@/components/layout/pro-badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { dodo } from "@/lib/dodo/client";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface ProMarketingCardProps {
  title?: string;
  subtitle?: string;
  contextTag?: string;
  compact?: boolean;
  className?: string;
}

export function ProMarketingCard({
  title = "Unlock Full 2026 Telemetry Suite",
  subtitle = "Direct telemetry overlay comparisons, tyre degradation curve models, and session replay towers for $9.99/mo.",
  contextTag = "PRO SUBSCRIBER EXCLUSIVE",
  compact = false,
  className = "",
}: ProMarketingCardProps) {
  const { user } = useAuth();
  const { isPro } = useSubscription();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isPro) {
    return null;
  }

  const handleDirectUpgrade = async () => {
    if (!user) {
      window.location.href = "/login?redirect=/pricing";
      return;
    }
    try {
      setIsSubmitting(true);
      await dodo.redirectToCheckout({
        uid: user.uid,
        email: user.email || "",
        name: user.displayName || "",
        returnUrl: `${window.location.origin}/account?payment=success`,
      });
    } catch (err) {
      console.error("Direct checkout launch failed:", err);
      setIsSubmitting(false);
    }
  };

  if (compact) {
    return (
      <div
        className={`rounded-xl border border-racing-red/40 bg-gradient-to-r from-carbon-900 via-zinc-950 to-carbon-900 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl ${className}`}
      >
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-racing-red/20 border border-racing-red/40 flex items-center justify-center text-racing-red shrink-0">
            <Zap className="w-4 h-4 fill-racing-red" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white tracking-tight">{title}</h4>
              <ProBadge />
            </div>
            <p className="text-xs text-zinc-400">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <Button
            onClick={handleDirectUpgrade}
            disabled={isSubmitting}
            variant="racing"
            size="sm"
            className="w-full sm:w-auto text-xs font-bold gap-1.5 shadow-md shadow-racing-red/30 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Opening Payment...</span>
              </>
            ) : (
              <>
                <span>Upgrade Pro ($9.99/mo)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-racing-red/40 bg-gradient-to-b from-carbon-900 via-zinc-950 to-carbon-900 p-6 sm:p-8 shadow-2xl ${className}`}
    >
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-racing-red/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-700/60 text-[11px] font-mono text-zinc-300">
            <Zap className="w-3 h-3 text-racing-red fill-racing-red" />
            <span>{contextTag}</span>
          </div>
          <span className="text-xs font-mono text-amber-400 font-bold">$9.99 / MONTH • CANCEL ANYTIME</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{title}</h3>
            <ProBadge />
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl">{subtitle}</p>
        </div>

        {/* Feature Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-2.5 p-3 rounded-lg bg-carbon-950/80 border border-zinc-800/80 text-xs">
            <Activity className="w-4 h-4 text-racing-red shrink-0" />
            <span className="text-zinc-200 font-medium">Dual-Car Speed &amp; Throttle Overlays</span>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-lg bg-carbon-950/80 border border-zinc-800/80 text-xs">
            <Layers className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-zinc-200 font-medium">Tyre Stint Degradation Curves</span>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-lg bg-carbon-950/80 border border-zinc-800/80 text-xs">
            <Radio className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-zinc-200 font-medium">Lap-by-Lap Timing Tower Replays</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <Button
            onClick={handleDirectUpgrade}
            disabled={isSubmitting}
            variant="racing"
            size="lg"
            className="w-full sm:w-auto text-xs sm:text-sm font-bold gap-2 shadow-lg shadow-racing-red/30 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Redirecting to Instant Checkout...</span>
              </>
            ) : (
              <>
                <span>Get Pro Access ($9.99/mo)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>

          <Link href="/pricing" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-xs">
              Compare All Plan Features
            </Button>
          </Link>

          <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-500 sm:ml-auto">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted Checkout • Instant Access</span>
          </div>
        </div>
      </div>
    </div>
  );
}

