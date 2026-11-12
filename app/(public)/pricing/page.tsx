import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProBadge } from "@/components/layout/pro-badge";
import { Check, Zap, Radio, Activity, ShieldCheck, Flame, Layers, Sparkles, Sliders } from "lucide-react";
import { SubscribeButton } from "@/components/pro/subscribe-button";
import { QuickAnswer } from "@/components/ui/quick-answer";
import { FAQAccordion } from "@/components/ui/faq-accordion";

export const revalidate = 86400; // Static revalidation daily

const CANONICAL_URL = "https://www.formula1telemetry.com/pricing";

export const metadata: Metadata = {
  title: "F1 Telemetry Pro Pricing | All-Access Paddock Pass $9.99/mo",
  description:
    "Formula 1 Telemetry is an all-access professional platform. Unlock live race telemetry, speed overlays, tyre degradation modeling, and driver analytics for $9.99/mo.",
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    title: "F1 Telemetry Pro Pricing | All-Access Paddock Pass $9.99/mo",
    description:
      "All-inclusive monthly Formula 1 telemetry subscription. Access live race telemetry streaming across all 20 drivers, speed traces, and strategy models.",
    url: CANONICAL_URL,
    type: "website",
  },
};

const PRICING_FAQS = [
  {
    question: "How much does Formula 1 Telemetry Pro cost?",
    answer:
      "Formula 1 Telemetry Pro costs $9.99 per month with no annual commitment or long-term contract. Subscribers can cancel at any time directly through their self-service account portal.",
  },
  {
    question: "Is there a free tier on Formula 1 Telemetry?",
    answer:
      "No. Formula 1 Telemetry is a 100% all-access professional platform. All features, live race telemetry feeds, driver sensor traces, replay towers, and analytics are exclusively available to Pro members.",
  },
  {
    question: "What is included with the Pro Membership?",
    answer:
      "Pro unlocks live race telemetry streaming across all 20 drivers (speed, throttle, brake, RPM, gear, DRS, ERS, tyre thermals), flying lap telemetry trace overlays, tyre degradation simulator, session replays, Monte Carlo race predictors, and full season race calendars.",
  },
  {
    question: "How does payment and billing work?",
    answer:
      "Payments are securely processed via encrypted Stripe / Dodo Payments checkout supporting credit cards, Apple Pay, and Google Pay. Billing occurs monthly on your anniversary date, and invoices are generated automatically.",
  },
  {
    question: "How do I cancel my subscription?",
    answer:
      "You can cancel your subscription at any time with a single click in your Account settings. Upon cancellation, your Pro access remains active until the end of your prepaid monthly billing cycle.",
  },
  {
    question: "Is there a refund policy?",
    answer:
      "Yes. If you experience technical difficulties or are unsatisfied within the first 14 days of your initial billing cycle, you can request a full refund via our Refund & Cancellation page.",
  },
];

export default function PricingPage() {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${CANONICAL_URL}/#product`,
    name: "Formula 1 Telemetry Pro Membership",
    description:
      "All-access professional Formula 1 car telemetry traces, live race telemetry feeds, tyre degradation modeling, and session replays.",
    brand: {
      "@type": "Brand",
      name: "Formula 1 Telemetry",
    },
    offers: [
      {
        "@type": "Offer",
        name: "Pro Monthly Subscription",
        price: "9.99",
        priceCurrency: "USD",
        priceValidUntil: "2027-12-31",
        availability: "https://schema.org/InStock",
        url: CANONICAL_URL,
        billingDuration: "P1M",
        description: "Full live race telemetry, dual-driver telemetry comparisons, tyre degradation simulator, session replays, and predictive race outcomes.",
      },
    ],
  };

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.formula1telemetry.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Pricing",
        item: CANONICAL_URL,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PRICING_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 w-full max-w-full overflow-hidden">
        {/* Breadcrumb nav */}
        <nav aria-label="Breadcrumb" className="text-xs font-mono text-zinc-500 flex items-center gap-2">
          <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-zinc-200">Pricing</span>
        </nav>

        {/* Header */}
        <header className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/30 text-xs font-mono text-racing-red font-bold">
            <Zap className="w-3.5 h-3.5 fill-racing-red" />
            <span>ALL-ACCESS PRO PLATFORM</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Formula 1 Telemetry Pro
          </h1>

          <QuickAnswer
            question="How much does Formula 1 telemetry cost?"
            answer="Formula 1 Telemetry is an all-access Pro platform at $9.99/month. There is no free tier; all features including live race telemetry feeds across all 20 drivers, speed and throttle curve overlays, tyre degradation modeling, and session replays are strictly unlocked for active Pro subscribers."
          />

          <p className="text-xs sm:text-sm text-zinc-400">
            Professional Grand Prix engineering telemetry, real-time car ECU sensor streaming, and race analysis suite. Cancel anytime with zero fees.
          </p>
        </header>

        {/* PRO ALL-ACCESS CARD */}
        <div className="max-w-2xl mx-auto w-full">
          <Card className="border-racing-red/60 bg-gradient-to-b from-carbon-900 via-carbon-900 to-carbon-950 flex flex-col justify-between relative shadow-2xl shadow-racing-red/10 w-full overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-racing-red/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              <CardHeader className="border-b border-zinc-800/80 pb-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-2xl font-extrabold text-white flex items-center gap-2">
                      <span>Pro All-Access Membership</span>
                      <ProBadge />
                    </CardTitle>
                  </div>
                  <Badge variant="racing" className="text-xs font-mono">ALL FEATURES INCLUDED</Badge>
                </div>
                <CardDescription className="text-xs text-zinc-400 pt-1">
                  Full pit wall telemetry suite, 20-driver live sensor stream, tyre lifecycle models, and race predictions.
                </CardDescription>

                <div className="pt-4 flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white tracking-tight">$9.99</span>
                  <span className="text-zinc-400 font-mono text-sm"> / month</span>
                  <span className="text-xs font-mono text-emerald-400 ml-2">Cancel anytime</span>
                </div>
              </CardHeader>

              <CardContent className="p-6 sm:p-8 space-y-6 text-xs">
                <div className="font-mono text-xs font-bold text-zinc-200 uppercase tracking-wider">
                  Complete Telemetry Suite Included:
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-zinc-300">
                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-carbon-950/80 border border-zinc-800/60 font-mono">
                    <Radio className="w-4 h-4 text-racing-red shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Live Race Telemetry Feed</span>
                      <span className="text-zinc-400 text-[11px]">Real-time 10Hz streaming car data across all 20 drivers.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-carbon-950/80 border border-zinc-800/60 font-mono">
                    <Activity className="w-4 h-4 text-racing-cyan shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Dual-Driver Telemetry Traces</span>
                      <span className="text-zinc-400 text-[11px]">Synchronized speed, throttle %, brake &amp; gear curves.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-carbon-950/80 border border-zinc-800/60 font-mono">
                    <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">4-Corner Thermals &amp; Brakes</span>
                      <span className="text-zinc-400 text-[11px]">Tyre carcass temps, brake rotor glow, and degradation cliff.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-carbon-950/80 border border-zinc-800/60 font-mono">
                    <Layers className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Session Replay Tower</span>
                      <span className="text-zinc-400 text-[11px]">Lap-by-lap timing tower, gap deltas, and pit stops.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-carbon-950/80 border border-zinc-800/60 font-mono">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">AI Race Outcome Predictor</span>
                      <span className="text-zinc-400 text-[11px]">Monte Carlo simulation calculating win and podium odds.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-carbon-950/80 border border-zinc-800/60 font-mono">
                    <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Full Season Calendar &amp; Circuits</span>
                      <span className="text-zinc-400 text-[11px]">All 23 rounds, circuit specs, and driver standings.</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-zinc-400 font-mono text-[11px]">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    256-Bit SSL Encrypted Checkout
                  </span>
                  <span>Instant Automatic Activation</span>
                </div>
              </CardContent>
            </div>

            <CardFooter className="p-6 sm:p-8 pt-0">
              <SubscribeButton size="lg" text="Unlock Pro All-Access ($9.99/mo)" />
            </CardFooter>
          </Card>
        </div>

        {/* Compact, Crawlable FAQ Accordion */}
        <FAQAccordion
          items={PRICING_FAQS}
          title="Subscription & Billing FAQ"
          subtitle="Everything you need to know about encrypted payments, billing cycles, and self-service cancellation."
          className="pt-6"
        />
      </div>
    </>
  );
}
