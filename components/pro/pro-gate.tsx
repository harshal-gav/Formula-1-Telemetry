"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProBadge } from "@/components/layout/pro-badge";
import { Zap, ShieldCheck, Lock, ArrowRight, Sparkles, Activity, Layers, BarChart2, Loader2 } from "lucide-react";
import { dodo } from "@/lib/dodo/client";

interface ProGateProps {
  children: ReactNode;
  title?: string;
  description?: string;
  previewTitle?: string;
  previewSummary?: string;
  showPreview?: boolean;
}

export function ProGate({
  children,
  title = "Unlock Pro Telemetry Suite",
  description = "Access high-frequency car telemetry overlays, tyre degradation curves, interactive session replays, and race prediction algorithms.",
  previewTitle = "Sample Telemetry Trace Benchmark: Bahrain Grand Prix Turn 1-4",
  previewSummary = "Official 2026 telemetry preview demonstrating telemetry trace overlay between Red Bull Racing and McLaren. Brake telemetry indicates deceleration from 324 km/h to 82 km/h over 112 meters (-4.9G peak), while throttle trace demonstrates full power-down application on exit at 345 meters.",
  showPreview = false,
}: ProGateProps) {
  const { user, loading: authLoading } = useAuth();
  const { isPro, loading: subLoading } = useSubscription();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If user has confirmed active Pro subscription, render live Pro tool
  if (!authLoading && !subLoading && isPro) {
    return <>{children}</>;
  }

  const handleUpgrade = async () => {
    if (!user) {
      window.location.href = "/login?redirect=/pro";
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
      console.error("Failed to redirect to checkout:", err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* 1. Pro Upgrade Paywall Card */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-zinc-800 bg-carbon-900/90 p-6 md:p-10 text-center shadow-2xl">
        {/* Ambient glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-racing-red/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-xs font-mono text-zinc-300">
            <Lock className="w-3.5 h-3.5 text-racing-red" />
            <span>PRO SUBSCRIBER ACCESS ONLY</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{title}</h2>
              <ProBadge />
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{description}</p>
          </div>

          {/* Value Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left py-1">
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-carbon-950/80 border border-zinc-800/60 text-xs font-mono">
              <Zap className="w-4 h-4 text-racing-red shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-zinc-200 block">Telemetry Comparison</span>
                <span className="text-zinc-500">Speed, throttle, brake &amp; gear traces.</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-carbon-950/80 border border-zinc-800/60 text-xs font-mono">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-zinc-200 block">Tyre Strategy Engine</span>
                <span className="text-zinc-500">Stint degradation &amp; pit stop windows.</span>
              </div>
            </div>
          </div>

          {/* Pricing CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              onClick={handleUpgrade}
              disabled={isSubmitting}
              variant="racing"
              size="lg"
              className="w-full sm:w-auto font-bold tracking-wide shadow-lg shadow-racing-red/30 gap-2 cursor-pointer text-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Opening Direct Payment...</span>
                </>
              ) : (
                <>
                  <span>Upgrade to Pro ($9.99/mo)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>

            {!user && (
              <Link href="/login?redirect=/pro">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-xs">
                  Existing subscriber? Sign In
                </Button>
              </Link>
            )}
          </div>

          <div className="flex items-center justify-center gap-4 text-[11px] text-zinc-500 pt-1 font-mono">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              256-Bit SSL Encrypted
            </span>
            <span>•</span>
            <span>Cancel anytime with zero fees</span>
          </div>
        </div>
      </div>

      {/* 2. CRAWLABLE PREVIEW (if enabled) */}
      {showPreview && (
        <section aria-label="Pro Telemetry Preview" className="space-y-4 rounded-2xl border border-zinc-800/80 bg-carbon-900/60 p-6 md:p-8">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <div className="space-y-1">
              <Badge variant="outline" className="text-xs font-mono">PRO TELEMETRY BENCHMARK</Badge>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-racing-cyan" />
                <span>{previewTitle}</span>
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-500">ENGINEERING BENCHMARK</span>
          </div>

        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
          {previewSummary}
        </p>

        {/* Crawlable Sample Telemetry Visual SVG */}
        <div className="w-full h-48 sm:h-64 rounded-xl bg-carbon-950 border border-zinc-800/80 p-4 relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-center text-[11px] font-mono text-zinc-500">
            <span>Speed Channel (km/h) vs Distance (m)</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-racing-red font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-racing-red inline-block" /> Driver A (Norris)
              </span>
              <span className="flex items-center gap-1 text-blue-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" /> Driver B (Verstappen)
              </span>
            </div>
          </div>

          {/* Inline SVG Chart Trace */}
          <div className="w-full h-32 sm:h-44 relative">
            <svg
              className="w-full h-full"
              viewBox="0 0 800 200"
              preserveAspectRatio="none"
              aria-label="Sample telemetry speed curve graph comparison"
            >
              {/* Grid lines */}
              <line x1="0" y1="40" x2="800" y2="40" stroke="#1f2433" strokeDasharray="3 3" />
              <line x1="0" y1="90" x2="800" y2="90" stroke="#1f2433" strokeDasharray="3 3" />
              <line x1="0" y1="140" x2="800" y2="140" stroke="#1f2433" strokeDasharray="3 3" />

              {/* Driver 1 Curve (Red) */}
              <path
                d="M 0 50 Q 150 40, 220 180 T 360 80 T 520 150 T 680 45 T 800 60"
                fill="none"
                stroke="#FF8000"
                strokeWidth="2.5"
              />
              {/* Driver 2 Curve (Blue) */}
              <path
                d="M 0 55 Q 160 42, 235 175 T 375 75 T 530 145 T 695 40 T 800 65"
                fill="none"
                stroke="#3671C6"
                strokeWidth="2.5"
                strokeDasharray="4 2"
              />
            </svg>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 border-t border-zinc-900 pt-1">
            <span>0m (Straight)</span>
            <span>300m (Turn 1 Apex: 82 km/h)</span>
            <span>600m (Turn 2-3 Acceleration)</span>
            <span>900m (Turn 4 Braking)</span>
          </div>
        </div>

        {/* Accessible Preview Data Table */}
        <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-carbon-950">
          <table className="w-full text-left font-mono text-xs">
            <caption className="sr-only">Free Telemetry Trace Comparison Data Preview</caption>
            <thead className="bg-zinc-900 text-zinc-400 text-[11px] border-b border-zinc-800">
              <tr>
                <th scope="col" className="p-2.5">Track Distance</th>
                <th scope="col" className="p-2.5">Driver 1 (Speed)</th>
                <th scope="col" className="p-2.5">Driver 2 (Speed)</th>
                <th scope="col" className="p-2.5">Telemetry Sector Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300 text-[11px]">
              <tr>
                <td className="p-2.5">0m - 150m (Main Straight)</td>
                <td className="p-2.5">324.5 km/h (100% Throttle)</td>
                <td className="p-2.5">323.2 km/h (100% Throttle)</td>
                <td className="p-2.5 text-emerald-400">+1.3 km/h Driver 1 advantage</td>
              </tr>
              <tr>
                <td className="p-2.5">220m (Turn 1 Braking Point)</td>
                <td className="p-2.5">100% Brake (-4.9G)</td>
                <td className="p-2.5">100% Brake (-4.8G)</td>
                <td className="p-2.5 text-zinc-400">Driver 2 brakes 6m later</td>
              </tr>
              <tr>
                <td className="p-2.5">280m (Turn 1 Apex)</td>
                <td className="p-2.5">82.4 km/h (Gear 3)</td>
                <td className="p-2.5">84.1 km/h (Gear 3)</td>
                <td className="p-2.5 text-blue-400">+1.7 km/h Driver 2 apex advantage</td>
              </tr>
              <tr>
                <td className="p-2.5">450m (Turn 2-3 Exit)</td>
                <td className="p-2.5">214.0 km/h (Gear 6)</td>
                <td className="p-2.5">211.5 km/h (Gear 6)</td>
                <td className="p-2.5 text-emerald-400">+2.5 km/h Driver 1 exit traction</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      )}
    </div>
  );
}
