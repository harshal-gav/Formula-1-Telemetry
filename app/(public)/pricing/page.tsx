"use client";

import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProBadge } from "@/components/layout/pro-badge";
import { Check, Zap, ArrowRight } from "lucide-react";
import { dodo } from "@/lib/dodo/client";
import Link from "next/link";

export default function PricingPage() {
  const { user } = useAuth();
  const { isPro } = useSubscription();

  const handleSubscribe = () => {
    if (!user) {
      window.location.href = "/login?redirect=/pricing";
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="racing" className="text-xs">TRANSPARENT PRICING</Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
          Choose Your Paddock Pass
        </h1>
        <p className="text-sm sm:text-base text-zinc-400">
          From basic season schedules to deep car telemetry traces, pick the plan that suits your racing curiosity.
        </p>
      </div>

      {/* Pricing Cards: Mobile shows only Pro Analytics column; Desktop shows both */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
        {/* FREE TIER: Hidden on mobile devices, visible on medium screens and up */}
        <Card className="hidden md:flex border-zinc-800 bg-carbon-900/80 flex-col justify-between">
          <div>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold text-white">Free Paddock</CardTitle>
                <Badge variant="outline" className="text-xs font-mono">FOREVER FREE</Badge>
              </div>
              <CardDescription className="text-xs text-zinc-400">
                Core calendar, race classifications, and championship tables.
              </CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-black text-white">$0</span>
                <span className="text-zinc-500 font-mono text-xs"> / month</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 text-xs">
              <div className="font-semibold text-zinc-300">Included features:</div>
              <ul className="space-y-2.5 text-zinc-400">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  Full Season Race Calendar & Circuit Maps
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  Official Race Classifications & Grid Formations
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  Driver & Constructor Championship Tables
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  Basic Driver Profiles & Historical Stats
                </li>
              </ul>
            </CardContent>
          </div>

          <CardFooter className="pt-6">
            <Link href="/dashboard" className="w-full">
              <Button variant="outline" className="w-full text-xs font-semibold">
                Access Free Dashboard
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* PRO TIER: Displayed as single column on mobile, side-by-side on desktop */}
        <Card className="border-racing-red/60 bg-gradient-to-b from-carbon-900 via-carbon-900 to-carbon-950 flex flex-col justify-between relative shadow-2xl shadow-racing-red/10 w-full">
          <div className="absolute -top-3 right-6">
            <ProBadge className="py-1 px-3 text-xs" />
          </div>

          <div>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-extrabold text-white flex items-center gap-1.5">
                  Pro Analytics <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                </CardTitle>
                <Badge variant="racing" className="text-xs font-mono">MOST POPULAR</Badge>
              </div>
              <CardDescription className="text-xs text-zinc-400">
                Full telemetry suite, tyre strategies, and race prediction heuristics.
              </CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-black text-white">$9.99</span>
                <span className="text-zinc-400 font-mono text-xs"> / month (cancel anytime)</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 text-xs">
              <div className="font-semibold text-zinc-200">Everything in Free, plus:</div>
              <ul className="space-y-2.5 text-zinc-300">
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  Lap-by-Lap Synchronized Telemetry Overlays
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  Tyre Stint Degradation Curves & Cliff Analysis
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  Interactive Session Replay Timing Tower
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  Client-Side Podium Outcome Predictor
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  Pit Stop Window & Undercut Optimizer
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  Self-Service Subscription Portal Access
                </li>
              </ul>
            </CardContent>
          </div>

          <CardFooter className="pt-6">
            {isPro ? (
              <div className="w-full space-y-2">
                <Button disabled variant="outline" className="w-full text-xs border-emerald-500/50 text-emerald-400">
                  Current Active Plan
                </Button>
                <Link href="/refund" className="block text-center text-[11px] text-zinc-400 hover:text-white underline">
                  Subscription & Cancellation Options
                </Link>
              </div>
            ) : (
              <Button
                onClick={handleSubscribe}
                variant="racing"
                className="w-full text-xs font-bold gap-2 shadow-lg shadow-racing-red/30 py-5"
              >
                <span>Subscribe to Pro ($9.99/mo)</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto pt-10 space-y-6">
        <h3 className="text-xl font-bold text-white text-center">Frequently Asked Questions</h3>
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-lg bg-carbon-900 border border-zinc-800 space-y-1">
            <h4 className="font-bold text-zinc-200">How does payment and billing work?</h4>
            <p className="text-zinc-400 leading-relaxed">
              Payments are processed securely via encrypted checkout. Your subscription renews automatically
              each month. We never store credit card numbers on our servers.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-carbon-900 border border-zinc-800 space-y-1">
            <h4 className="font-bold text-zinc-200">How do I cancel or update payment methods?</h4>
            <p className="text-zinc-400 leading-relaxed">
              You can cancel your subscription at any time directly through the Refund & Cancellation page.
              Upon cancellation, you will retain active access until the end of your monthly billing cycle with zero penalties.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-carbon-900 border border-zinc-800 space-y-1">
            <h4 className="font-bold text-zinc-200">How is live data handled without latency?</h4>
            <p className="text-zinc-400 leading-relaxed">
              Our application streams and synchronizes telemetry directly in your browser. Data is intelligently
              cached with throttled pacing for smooth, instant playback.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
