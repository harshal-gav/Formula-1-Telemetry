"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { Button } from "@/components/ui/button";
import { ProBadge } from "@/components/layout/pro-badge";
import { Zap, ShieldCheck, Lock, ArrowRight, Sparkles } from "lucide-react";
import { dodo } from "@/lib/dodo/client";

interface ProGateProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function ProGate({
  children,
  title = "Unlock Pro Telemetry Suite",
  description = "Access high-frequency car telemetry overlays, tyre degradation curves, interactive session replays, and race prediction algorithms.",
}: ProGateProps) {
  const { user, loading: authLoading } = useAuth();
  const { isPro, loading: subLoading } = useSubscription();

  if (authLoading || subLoading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-racing-red border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono text-zinc-500">Verifying paddock credentials...</p>
      </div>
    );
  }

  // If user has active Pro subscription, render children
  if (isPro) {
    return <>{children}</>;
  }

  const handleUpgrade = () => {
    if (!user) {
      window.location.href = "/login?redirect=/pro";
      return;
    }
    const checkoutUrl = dodo.getCheckoutUrl({
      uid: user.uid,
      email: user.email || "",
      returnUrl: `${window.location.origin}/account?payment=success`,
    });
    window.location.href = checkoutUrl;
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-zinc-800 bg-carbon-900/60 p-6 md:p-12 my-6 text-center">
      {/* Background glow effect */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-racing-red/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-xs font-mono text-zinc-300">
          <Lock className="w-3.5 h-3.5 text-racing-red" />
          <span>PRO SUBSCRIBER ACCESS ONLY</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{title}</h2>
            <ProBadge />
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
        </div>

        {/* Value Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left py-2">
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-carbon-950/60 border border-zinc-800/60 text-xs">
            <Zap className="w-4 h-4 text-racing-red shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-zinc-200 block">Telemetry Comparison</span>
              <span className="text-zinc-500">Throttle, brake, speed & gear traces via OpenF1.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-carbon-950/60 border border-zinc-800/60 text-xs">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-zinc-200 block">Tyre Strategy Engine</span>
              <span className="text-zinc-500">Stint degradation modeling & pit window optimizer.</span>
            </div>
          </div>
        </div>

        {/* Pricing CTA */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={handleUpgrade}
            variant="racing"
            size="lg"
            className="w-full sm:w-auto font-bold tracking-wide shadow-lg shadow-racing-red/30 gap-2 cursor-pointer"
          >
            <span>Upgrade to Pro ($9.99/mo)</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          {!user && (
            <Link href="/login?redirect=/pro">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-xs">
                Existing subscriber? Sign In
              </Button>
            </Link>
          )}
        </div>

        <div className="flex items-center justify-center gap-4 text-[11px] text-zinc-500 pt-2 font-mono">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Powered by Dodo Payments
          </span>
          <span>•</span>
          <span>Cancel anytime in Customer Portal</span>
        </div>
      </div>
    </div>
  );
}
