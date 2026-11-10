import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description: "Refund and subscription cancellation terms for Formula 1 Telemetry.",
};

export default function RefundPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-zinc-300">
      <div className="space-y-2 border-b border-zinc-800 pb-6">
        <span className="text-xs font-mono uppercase text-racing-red font-bold tracking-wider">
          Billing & Cancellations
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Refund & Cancellation Policy
        </h1>
        <p className="text-xs font-mono text-zinc-500">
          Last Updated: November 10, 2026 • Effective Date: November 10, 2026
        </p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. Subscription Cancellation</h2>
          <p>
            You can cancel your Formula 1 Telemetry Pro subscription at any time with zero cancellation fees or penalties:
          </p>
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-2 text-white font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>How to cancel in under 30 seconds:</span>
            </div>
            <p>1. Log into your account at formula1telemetry.com.</p>
            <p>2. Navigate to your <strong>Account Settings</strong> (/account).</p>
            <p>3. Click <strong>&quot;Manage Billing Portal&quot;</strong> to open the Dodo Payments customer dashboard.</p>
            <p>4. Click <strong>&quot;Cancel Subscription&quot;</strong>.</p>
          </div>
          <p className="text-xs text-zinc-400">
            Upon cancellation, you will continue to enjoy full Pro access until the conclusion of your current monthly billing period. You will not be billed again.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. 7-Day Money-Back Guarantee</h2>
          <p>
            We want you to be completely satisfied with our telemetry analysis tools. If you subscribe to our Pro tier and find it does not meet your expectations, we offer a <strong>full refund within 7 days</strong> of your initial purchase.
          </p>
          <p>
            To request a refund within the 7-day period, send an email to{" "}
            <a href="mailto:billing@formula1telemetry.com" className="text-racing-red hover:underline font-mono">
              billing@formula1telemetry.com
            </a>{" "}
            with your account email or Dodo Payments transaction ID. Refunds are typically processed within 3 to 5 business days back to your original payment method.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. Billing Disputes & Chargebacks</h2>
          <p>
            If you notice an unexpected or duplicate charge on your statement, please contact us directly at{" "}
            <a href="mailto:billing@formula1telemetry.com" className="text-racing-red hover:underline font-mono">
              billing@formula1telemetry.com
            </a>{" "}
            before filing a formal bank dispute. We investigate and resolve billing issues within 24 hours.
          </p>
        </section>

        <div className="pt-4 flex items-center gap-3">
          <Link href="/account">
            <Button variant="outline" size="sm" className="gap-2 font-mono text-xs">
              <span>Go to Account Settings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="ghost" size="sm" className="text-xs text-zinc-400">
              View Pricing Plans
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

