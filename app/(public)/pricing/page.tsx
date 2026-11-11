import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProBadge } from "@/components/layout/pro-badge";
import { Check, Zap } from "lucide-react";
import { SubscribeButton } from "@/components/pro/subscribe-button";
import { QuickAnswer } from "@/components/ui/quick-answer";
import { FAQAccordion } from "@/components/ui/faq-accordion";

export const revalidate = 86400; // Static revalidation daily

const CANONICAL_URL = "https://www.formula1telemetry.com/pricing";

export const metadata: Metadata = {
  title: "F1 Telemetry Pro Pricing | Plans from $9.99/mo",
  description:
    "Compare Formula 1 Telemetry subscription plans. Free paddock tier with race schedules and standings, plus $9.99/mo Pro with full telemetry traces.",
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    title: "F1 Telemetry Pro Pricing | Plans from $9.99/mo",
    description:
      "Affordable monthly Formula 1 telemetry subscription. Access high-resolution speed traces, tyre degradation modeling, and session replays.",
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
    question: "What is included in the Free Paddock tier?",
    answer:
      "The Free Paddock tier ($0 forever) includes the complete 24-round World Championship race calendar, official Grand Prix classifications, starting grids, and full driver and constructor championship standings.",
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
      "High-resolution Formula 1 car telemetry traces, tyre degradation modeling, session replays, and predictive race outcomes.",
    brand: {
      "@type": "Brand",
      name: "Formula 1 Telemetry",
    },
    offers: [
      {
        "@type": "Offer",
        name: "Free Paddock Pass",
        price: "0",
        priceCurrency: "USD",
        priceValidUntil: "2027-12-31",
        availability: "https://schema.org/InStock",
        url: CANONICAL_URL,
        description: "Official 24-round calendar, driver & constructor standings, and race classifications.",
      },
      {
        "@type": "Offer",
        name: "Pro Monthly Subscription",
        price: "9.99",
        priceCurrency: "USD",
        priceValidUntil: "2027-12-31",
        availability: "https://schema.org/InStock",
        url: CANONICAL_URL,
        billingDuration: "P1M",
        description: "Full dual-driver telemetry comparisons, tyre degradation simulator, session replays, and predictive race outcomes.",
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 w-full max-w-full overflow-hidden">
        {/* Breadcrumb nav */}
        <nav aria-label="Breadcrumb" className="text-xs font-mono text-zinc-500 flex items-center gap-2">
          <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-zinc-200">Pricing</span>
        </nav>

        {/* Header */}
        <header className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="racing" className="text-xs">TRANSPARENT PRICING</Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Choose Your Paddock Plan
          </h1>

          <QuickAnswer
            question="How much does Formula 1 telemetry cost?"
            answer="Formula 1 Telemetry offers a 100% free Paddock tier with full race schedules and standings tables, alongside a comprehensive Pro plan at $9.99/month. Pro unlocks dual-car telemetry overlays, tyre degradation stint curves, interactive session replays, and predictive race algorithms with no lock-in contracts."
          />

          <p className="text-xs sm:text-sm text-zinc-400">
            From basic season schedules to deep car telemetry traces, pick the plan that suits your racing curiosity.
          </p>
        </header>

        {/* Pricing Cards: On Mobile, only Pro Analytics is displayed! */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* FREE TIER - Hidden on mobile so users see Pro directly */}
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
                    Full Season Race Calendar &amp; Circuit Maps
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    Official Race Classifications &amp; Grid Formations
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    Driver &amp; Constructor Championship Tables
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    Circuit Telemetry Benchmarks &amp; Turn Maps
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    Basic Driver Profiles &amp; Career Stats
                  </li>
                </ul>
              </CardContent>
            </div>

            <CardFooter className="pt-6">
              <Link href="/races" className="w-full">
                <Button variant="outline" className="w-full text-xs font-semibold">
                  Access Free Calendar &amp; Standings
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* PRO TIER */}
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
                    Tyre Stint Degradation Curves &amp; Cliff Analysis
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    Interactive Session Replay Timing Tower
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    Monte Carlo Race Outcome &amp; Podium Predictor
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    Pit Stop Window &amp; Undercut Optimizer
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    Self-Service Customer Billing &amp; Subscriptions
                  </li>
                </ul>
              </CardContent>
            </div>

            <CardFooter className="pt-6">
              <SubscribeButton size="lg" text="Unlock Pro Monthly ($9.99/mo)" />
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
