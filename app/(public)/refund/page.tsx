"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { dodo } from "@/lib/dodo/client";

export default function RefundPage() {
  const { user, loading: authLoading } = useAuth();
  const { subscription, isPro, loading: subLoading } = useSubscription();

  const handleCancelSubscription = () => {
    if (!user?.email) return;
    dodo.openCustomerPortal(user.email);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-zinc-300 w-full max-w-full overflow-hidden">
      <div className="space-y-2 border-b border-zinc-800 pb-6">
        <span className="text-xs font-mono uppercase text-racing-red font-bold tracking-wider">
          Billing & Cancellations
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Cancellation Policy
        </h1>
        <p className="text-xs font-mono text-zinc-500">
          Last Updated: 2026 • Effective Date: 2026
        </p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed">
        {/* Interactive Subscription Cancellation Module */}
        <section className="p-6 rounded-2xl bg-carbon-900 border border-zinc-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-racing-red" />
              Manage & Cancel Subscription
            </h2>
            {isPro && (
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                ACTIVE PRO SUBSCRIBER
              </span>
            )}
          </div>

          <p className="text-xs text-zinc-400">
            Subscription cancellation is managed exclusively on this page. You can cancel your recurring monthly membership at any time with zero cancellation fees.
          </p>

          <div className="pt-2">
            {authLoading || subLoading ? (
              <div className="text-xs font-mono text-zinc-500">Loading subscription details...</div>
            ) : !user ? (
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-3">
                <p className="text-xs text-zinc-300">
                  Please sign in to the account associated with your subscription to initiate cancellation.
                </p>
                <Link href="/login?redirect=/refund">
                  <Button variant="racing" size="sm" className="text-xs font-semibold">
                    Sign In to Cancel Subscription
                  </Button>
                </Link>
              </div>
            ) : isPro ? (
              <div className="space-y-4">
                {subscription?.cancel_at_period_end ? (
                  <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-300 space-y-1 font-mono">
                    <p className="font-bold">Cancellation Scheduled</p>
                    <p className="text-zinc-300">
                      Your subscription is set to conclude at the end of the current billing cycle. You will not be charged again. Pro features remain fully accessible until the period ends.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-3">
                    <div className="text-xs text-zinc-300 font-mono space-y-1">
                      <p>
                        Current Plan: <span className="text-white font-bold capitalize">{subscription?.plan || "Pro"}</span>
                      </p>
                      {subscription?.currentPeriodEnd && (
                        <p>
                          Active Period Ends:{" "}
                          <span className="text-amber-400 font-bold">
                            {new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={handleCancelSubscription}
                      variant="outline"
                      size="sm"
                      className="text-xs font-mono text-red-400 hover:text-white hover:bg-red-950/60 border-red-900/60 gap-1.5"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      Proceed with Subscription Cancellation
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs text-zinc-400 space-y-2 font-mono">
                <p>There is no active recurring Pro subscription on this account.</p>
                <Link href="/pricing">
                  <Button variant="racing" size="sm" className="text-xs font-bold gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Upgrade to Pro ($9.99/mo)
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Cancellation Terms */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">Cancellation Terms</h2>
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2.5 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-2 text-white font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Key Terms & Access Retention:</span>
            </div>
            <p>1. Cancel anytime with immediate confirmation and zero penalties.</p>
            <p>2. Upon cancellation, your Pro telemetry and replay features remain active until the end of your current monthly cycle.</p>
            <p>3. After your current period concludes, no further charges will ever be made.</p>
            <p>4. Your account history, saved preferences, and free dashboard access remain permanently intact.</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">Billing Disputes</h2>
          <p className="text-xs text-zinc-400">
            If you experience an unexpected billing discrepancy or multiple charges, you can review your complete transaction history and invoices directly through the self-service subscription portal above.
          </p>
        </section>

        <div className="pt-4 flex items-center gap-3">
          <Link href="/pricing">
            <Button variant="outline" size="sm" className="gap-2 font-mono text-xs">
              <span>View Pricing Plans</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-xs text-zinc-400">
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
