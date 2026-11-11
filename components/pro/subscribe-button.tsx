"use client";

import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { dodo } from "@/lib/dodo/client";
import Link from "next/link";

export function SubscribeButton({
  className = "",
  size = "default",
  text = "Subscribe to Pro ($9.99/mo)",
}: {
  className?: string;
  size?: "default" | "sm" | "lg";
  text?: string;
}) {
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

  if (isPro) {
    return (
      <div className="w-full space-y-2">
        <Button disabled variant="outline" className="w-full text-xs border-emerald-500/50 text-emerald-400">
          Current Active Plan
        </Button>
        <Link href="/account" className="block text-center text-[11px] text-zinc-400 hover:text-white underline">
          Manage Subscription &amp; Billing
        </Link>
      </div>
    );
  }

  return (
    <Button
      onClick={handleSubscribe}
      variant="racing"
      size={size}
      className={`w-full font-bold gap-2 shadow-lg shadow-racing-red/30 cursor-pointer ${className}`}
    >
      <span>{text}</span>
      <ArrowRight className="w-4 h-4" />
    </Button>
  );
}

