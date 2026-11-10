"use client";

import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProBadge } from "@/components/layout/pro-badge";
import {
  User,
  CreditCard,
  ShieldCheck,
  Calendar,
  Sparkles,
  LogOut,
} from "lucide-react";
import { dodo } from "@/lib/dodo/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const { subscription, isPro, loading: subLoading } = useSubscription();

  if (authLoading || subLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs font-mono text-zinc-500">
        Loading account profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Sign In Required</h2>
        <p className="text-xs text-zinc-400">Please sign in to view your account details.</p>
        <Link href="/login?redirect=/account">
          <Button variant="racing" size="sm">Sign In</Button>
        </Link>
      </div>
    );
  }

  const handleUpgrade = () => {
    const checkoutUrl = dodo.getCheckoutUrl({
      uid: user.uid,
      email: user.email || "",
      returnUrl: `${window.location.origin}/account?payment=success`,
    });
    window.location.href = checkoutUrl;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Account & Subscription
        </h1>
        <p className="text-xs text-zinc-400">
          Manage your credentials, subscription plan, and account preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="border-zinc-800 bg-carbon-900 md:col-span-1 shadow-xl">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-zinc-400" />
              User Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs font-mono">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block">Name</span>
              <span className="text-white font-bold text-sm">
                {user.displayName || "Racer"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block">Email</span>
              <span className="text-zinc-300 break-all">{user.email}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block">Account ID</span>
              <span className="text-[10px] text-zinc-500 break-all">{user.uid}</span>
            </div>
          </CardContent>
          <CardFooter className="pt-2 border-t border-zinc-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => logout()}
              className="w-full text-xs text-red-400 gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </Button>
          </CardFooter>
        </Card>

        {/* Subscription Card */}
        <Card className="border-zinc-800 bg-carbon-900 md:col-span-2 shadow-xl flex flex-col justify-between">
          <div>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-racing-red" />
                  Subscription Plan
                </CardTitle>
                {isPro ? (
                  <ProBadge />
                ) : (
                  <Badge variant="outline" className="text-[10px] font-mono">
                    FREE TIER
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs text-zinc-400">
                {isPro
                  ? "You have full access to high-frequency car telemetry, tyre strategy simulator, and AI predictions."
                  : "You are currently on the Free Paddock plan with calendar and standings access."}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px] uppercase">Plan</span>
                  <span className="font-bold text-white capitalize">
                    {subscription?.plan || "free"}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px] uppercase">Status</span>
                  <span
                    className={`font-bold capitalize ${
                      subscription?.status === "active" ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    {subscription?.status || "active"}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 col-span-2 sm:col-span-1">
                  <span className="text-zinc-500 block text-[10px] uppercase">Billing Cycle</span>
                  <span className="text-zinc-300">
                    {isPro ? "Monthly ($9.99)" : "None"}
                  </span>
                </div>
              </div>

              {isPro && subscription?.currentPeriodEnd && (
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                    {subscription.cancel_at_period_end ? "Access Active Until:" : "Next Billing / Renewal Date:"}
                  </span>
                  <span className="text-amber-400 font-bold">
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}

              {subscription?.cancel_at_period_end && (
                <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-xs text-amber-300 font-mono">
                  Your recurring subscription has been scheduled for cancellation. Your Pro access remains active until the end of your billing cycle.
                </div>
              )}
            </CardContent>
          </div>

          <CardFooter className="pt-4 border-t border-zinc-800 flex items-center justify-between">
            {isPro ? (
              <div className="flex items-center justify-between w-full text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  Active Pro Membership
                </span>
                <span className="text-[11px] text-zinc-500 font-mono">
                  Full Telemetry Suite Unlocked
                </span>
              </div>
            ) : (
              <>
                <Button
                  onClick={handleUpgrade}
                  variant="racing"
                  className="w-full sm:w-auto text-xs font-bold gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Upgrade to Pro ($9.99/mo)
                </Button>
                <span className="text-[11px] text-zinc-500 font-mono">
                  Instant access to all telemetry
                </span>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
