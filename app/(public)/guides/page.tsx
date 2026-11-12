import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ArrowRight, Activity, Layers, Zap, Timer } from "lucide-react";
import { ProGate } from "@/components/pro/pro-gate";

export const revalidate = 86400;

const CANONICAL_URL = "https://www.formula1telemetry.com/guides";

export const metadata: Metadata = {
  title: "Formula 1 Engineering & Telemetry Guides | F1 Telemetry",
  description:
    "Master Formula 1 race engineering. Detailed technical guides on reading telemetry traces, tyre degradation modeling, DRS dynamics, and pit strategies.",
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    title: "Formula 1 Engineering & Telemetry Guides | F1 Telemetry",
    description:
      "Educational engineering guides for motorsport fans. Learn how to interpret car telemetry traces, pit window strategies, and tyre wear curves.",
    url: CANONICAL_URL,
    type: "article",
  },
};

const GUIDES = [
  {
    slug: "how-to-read-f1-telemetry",
    title: "How to Read an F1 Telemetry Trace: Beginner to Pro Guide",
    description:
      "Learn how to interpret speed traces, throttle application percentages, braking points, and gear shifts to spot where drivers gain lap time.",
    readTime: "7 min read",
    category: "Telemetry Analysis",
    icon: Activity,
    highlight: "Speed, Throttle, Brake & Gear Trace Interpretation",
  },
  {
    slug: "undercut-vs-overcut-explained",
    title: "Undercut vs Overcut in F1: Pit Strategy Mechanics Explained",
    description:
      "Understand the telemetry and delta mechanics behind undercuts and overcuts. When does fresh tyre out-lap pace defeat old tyre track position?",
    readTime: "6 min read",
    category: "Race Strategy",
    icon: Timer,
    highlight: "Pit Window Timing, Out-Lap Deltas & Tyre Temperature",
  },
  {
    slug: "what-is-drs-in-f1-telemetry",
    title: "What is DRS and How is it Shown in Telemetry Traces?",
    description:
      "Explore the engineering physics of the Drag Reduction System. Discover how DRS actuation appears on speed traces and acceleration slopes.",
    readTime: "5 min read",
    category: "Aerodynamics",
    icon: Zap,
    highlight: "Drag Reduction Coefficient & Speed Trap Deltas",
  },
  {
    slug: "tyre-degradation-models-explained",
    title: "How F1 Tyre Degradation Models Work: Thermal vs Mechanical Wear",
    description:
      "Deep dive into tyre degradation curves, the thermal cliff, compound crossover points, and stint pacing simulations used on the pitwall.",
    readTime: "8 min read",
    category: "Tyre Dynamics",
    icon: Layers,
    highlight: "Stint Decay Slopes, Thermal Blistering & Pit Windows",
  },
];

export default function GuidesIndexPage() {
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
        name: "Guides",
        item: CANONICAL_URL,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 w-full max-w-full overflow-hidden">
        {/* Breadcrumb nav */}
        <nav aria-label="Breadcrumb" className="text-xs font-mono text-zinc-500 flex items-center gap-2">
          <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-zinc-200">Guides</span>
        </nav>

        {/* Page Header */}
        <header className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="racing" className="text-xs">ENGINEERING KNOWLEDGE BASE</Badge>
            <span className="text-xs font-mono text-zinc-500">TECHNICAL GUIDES</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase flex items-center gap-3">
            <BookOpen className="w-8 h-8 sm:w-10 h-10 text-racing-red" />
            <span>Formula 1 Telemetry &amp; Strategy Guides</span>
          </h1>

          {/* AEO Direct Answer Target Box */}
          <div className="p-4 rounded-xl bg-carbon-900 border border-zinc-800 text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-3xl">
            <p>
              <strong className="text-white font-semibold">How do race engineers analyze F1 telemetry?</strong> Race engineers analyze telemetry through continuous channel graphs correlating car velocity, throttle position, brake line pressure, steering angle, and gear selection across track distance to identify driving line deltas, optimize aerodynamic downforce, and calculate pit stop windows.
            </p>
          </div>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
            Written by motorsport data specialists and peer-reviewed for engineering accuracy. Learn the core principles of race engineering and telemetry analysis.
          </p>
        </header>

        {/* Guides Grid - Pro Access Only */}
        <ProGate
          title="Unlock Pro Race Engineering Guides & Telemetry Tutorials"
          description="Access expert-level Formula 1 telemetry tutorials, speed & throttle curve interpretation, tyre degradation modeling, and pit strategy mechanics."
        >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {GUIDES.map((guide) => {
            const Icon = guide.icon;

            return (
              <article key={guide.slug}>
                <Link href={`/guides/${guide.slug}`}>
                  <Card className="hover:border-zinc-700 bg-carbon-900/90 hover:-translate-y-1 transition-all group h-full">
                    <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-[10px] font-mono">
                            {guide.category}
                          </Badge>
                          <span className="text-xs font-mono text-zinc-500">{guide.readTime}</span>
                        </div>

                        <h2 className="text-lg font-bold text-white group-hover:text-racing-red transition-colors tracking-tight">
                          {guide.title}
                        </h2>

                        <p className="text-xs text-zinc-400 leading-relaxed">
                          {guide.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                        <span className="text-zinc-500 text-[11px] truncate">{guide.highlight}</span>
                        <span className="text-racing-cyan font-bold flex items-center gap-1 shrink-0">
                          <span>Read Guide</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </article>
            );
          })}
        </div>
        </ProGate>
      </div>
    </>
  );
}

