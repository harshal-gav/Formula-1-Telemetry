"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async () => {
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
      console.error("Failed to redirect to checkout:", err);
      setIsSubmitting(false);
    }
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
      disabled={isSubmitting}
      variant="racing"
      size={size}
      className={`w-full font-bold gap-2 shadow-lg shadow-racing-red/30 cursor-pointer ${className}`}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-white" />
          <span>Opening Direct Payment...</span>
        </>
      ) : (
        <>
          <span>{text}</span>
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </Button>
  );
}
