import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  ArrowLeft,
  Calendar,
  User,
  ShieldCheck,
  Activity,
  Layers,
  HelpCircle,
  Zap,
} from "lucide-react";
import { QuickAnswer } from "@/components/ui/quick-answer";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { ProMarketingCard } from "@/components/pro/pro-marketing-card";

export const revalidate = 86400;

const CANONICAL_BASE = "https://www.formula1telemetry.com/guides";

interface GuideContent {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  category: string;
  readTime: string;
  datePublished: string;
  dateModified: string;
  author: {
    name: string;
    role: string;
    credentials: string;
  };
  reviewer: {
    name: string;
    role: string;
  };
  directAnswer: string;
  faqs: { question: string; answer: string }[];
  contentHtml: React.ReactNode;
}

const GUIDES_DATA: Record<string, GuideContent> = {
  "how-to-read-f1-telemetry": {
    slug: "how-to-read-f1-telemetry",
    title: "How to Read an F1 Telemetry Trace: Step-by-Step Guide",
    metaTitle: "How to Read F1 Telemetry Traces | Complete Guide",
    description:
      "Learn how to interpret Formula 1 telemetry speed traces, throttle curves, brake pressures, and gear shifts to analyze driver deltas and lap times.",
    category: "Telemetry Analysis",
    readTime: "7 min read",
    datePublished: "2026-03-05T00:00:00Z",
    dateModified: "2026-11-10T18:00:00Z",
    author: {
      name: "Marcus Vance",
      role: "Lead Motorsport Telemetry Engineer",
      credentials: "Former Formula 3 data engineer and vehicle dynamics analyst.",
    },
    reviewer: {
      name: "Elena Rostova",
      role: "Aerodynamics & Performance Specialist",
    },
    directAnswer:
      "An F1 telemetry trace is a graphical plot of vehicle sensor measurements over track distance or elapsed time. The four fundamental channels are Speed (km/h), Throttle (0-100%), Brake (0-100% pressure), and Gear (1-8). By overlaying two drivers' traces, you can identify braking points, apex speeds, and corner exit traction deltas.",
    faqs: [
      {
        question: "What are the four primary telemetry channels in Formula 1?",
        answer:
          "The four primary telemetry channels are Speed (measured in km/h), Throttle application percentage (0-100%), Brake line pressure (0-100%), and Gear selection (1-8).",
      },
      {
        question: "How do you identify a driver's braking point on telemetry?",
        answer:
          "A braking point is identified where the Speed trace initiates a steep downward slope and the Brake pressure line spikes sharply from 0% toward 100%.",
      },
      {
        question: "What is apex speed in telemetry?",
        answer:
          "Apex speed is the lowest point (local minimum) on the speed trace throughout a corner, representing the minimum velocity carried through the geometric apex before throttle application resumes.",
      },
    ],
    contentHtml: (
      <div className="space-y-8 text-zinc-300 leading-relaxed text-sm">
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            What is a Formula 1 telemetry trace?
          </h2>
          <p>
            An F1 telemetry trace is a continuous recording of electronic sensor data transmitted from the car&apos;s Electronic Control Unit (ECU) at frequencies ranging from 10Hz to 300Hz. Modern Formula 1 cars carry more than 300 sensors measuring mechanical, aerodynamic, and electrical systems.
          </p>
          <p>
            When comparing two drivers on a telemetry chart, the X-axis universally represents <strong>track distance in meters</strong> (from 0m at the start-finish line to the total lap length). The Y-axis represents the magnitude of the specific channel being evaluated.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            What are the core telemetry channels?
          </h2>
          <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-carbon-900">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-zinc-950 text-zinc-400 text-[11px] uppercase border-b border-zinc-800">
                <tr>
                  <th className="p-3">Channel Name</th>
                  <th className="p-3">Units &amp; Range</th>
                  <th className="p-3">Diagnostic Significance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                <tr>
                  <td className="p-3 font-semibold text-white">Speed Trace</td>
                  <td className="p-3 text-amber-400">60 - 360 km/h</td>
                  <td className="p-3 text-zinc-400">Reveals straightline drag, braking deceleration, and apex speed.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Throttle Trace</td>
                  <td className="p-3 text-racing-red">0 - 100%</td>
                  <td className="p-3 text-zinc-400">Shows driver commitment and corner exit rear-end traction stability.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Brake Trace</td>
                  <td className="p-3 text-racing-cyan">0 - 100% Bar / Load</td>
                  <td className="p-3 text-zinc-400">Indicates initial hit pressure, modulation, and trail-braking duration.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Gear Selection</td>
                  <td className="p-3 text-zinc-200">Gears 1 through 8</td>
                  <td className="p-3 text-zinc-400">Shows torque management and shift point synchronization.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Step-by-step: How to analyze a corner on telemetry
          </h2>
          <ol className="space-y-3 list-decimal list-inside text-zinc-300 pl-2">
            <li>
              <strong>Locate the braking threshold:</strong> Inspect the speed curve at the end of the straight. The precise meter mark where the speed drop commences marks the braking point. A driver braking 5 meters later enters the corner with a higher initial delta.
            </li>
            <li>
              <strong>Examine the trail-braking release:</strong> Observe how gradually the brake line returns to 0%. Drivers who release the pedal progressively (&ldquo;trail-braking&rdquo;) keep the front nose pinned down, enhancing turn-in grip toward the apex.
            </li>
            <li>
              <strong>Compare minimum apex speed:</strong> Identify the trough of the speed curve. A higher apex speed indicates greater cornering downforce or better vehicle rotation.
            </li>
            <li>
              <strong>Assess throttle pick-up aggression:</strong> Look at where the throttle trace rises from 0%. The driver who reaches 100% throttle earlier without throttle dips or hesitations will carry superior velocity down the following straight.
            </li>
          </ol>
        </section>
      </div>
    ),
  },
  "undercut-vs-overcut-explained": {
    slug: "undercut-vs-overcut-explained",
    title: "Undercut vs Overcut in F1: Pit Strategy Mechanics Explained",
    metaTitle: "Undercut vs Overcut in F1 Strategy | Technical Guide",
    description:
      "Understand the mechanics of undercuts and overcuts in Formula 1. Discover when pitting early on fresh rubber beats staying out for track position.",
    category: "Race Strategy",
    readTime: "6 min read",
    datePublished: "2026-03-12T00:00:00Z",
    dateModified: "2026-11-10T18:00:00Z",
    author: {
      name: "Marcus Vance",
      role: "Lead Motorsport Telemetry Engineer",
      credentials: "Former Formula 3 data engineer and vehicle dynamics analyst.",
    },
    reviewer: {
      name: "Elena Rostova",
      role: "Aerodynamics & Performance Specialist",
    },
    directAnswer:
      "The undercut is a racing strategy where a chasing driver pits one or two laps earlier than their rival to fit fresh tyres. The new rubber provides immediate grip, enabling an out-lap that is 1.5s to 3.0s faster than the rival's degraded in-lap, allowing the chasing car to take track position when the leader finally pits.",
    faqs: [
      {
        question: "What is an undercut in Formula 1?",
        answer:
          "An undercut is pitting one or several laps before the car ahead to capitalize on fresh tyre grip, setting a blistering out-lap to overtake the opponent when they pit on subsequent laps.",
      },
      {
        question: "What is an overcut in Formula 1?",
        answer:
          "An overcut is staying out on track while the car ahead pits early. It succeeds when tyre warm-up is slow, track temperatures are low, or the driver staying out has clean air and superior pace on durable compounds.",
      },
      {
        question: "What factors determine whether an undercut works?",
        answer:
          "Key factors include tyre warm-up speed, pit lane delta time, track surface abrasiveness, traffic clearance on the out-lap, and the tyre degradation differential per lap.",
      },
    ],
    contentHtml: (
      <div className="space-y-8 text-zinc-300 leading-relaxed text-sm">
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            What is the difference between an undercut and an overcut?
          </h2>
          <p>
            An <strong>undercut</strong> is an offensive pit strategy where a car pits prior to the rival ahead. Because brand-new tyres generate higher chemical and mechanical adhesion, the driver sets an aggressive &ldquo;out-lap&rdquo; that claws back the pit delta gap.
          </p>
          <p>
            Conversely, an <strong>overcut</strong> is remaining on track longer than the rival who pitted. It relies on old tyres retaining acceptable lap times while the opponent struggles with cold tyre warm-up (out-lap &ldquo;graining&rdquo;) or encounters slower traffic.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Strategy Comparison: Undercut vs Overcut
          </h2>
          <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-carbon-900">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-zinc-950 text-zinc-400 text-[11px] uppercase border-b border-zinc-800">
                <tr>
                  <th className="p-3">Strategic Parameter</th>
                  <th className="p-3">The Undercut</th>
                  <th className="p-3">The Overcut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                <tr>
                  <td className="p-3 font-semibold text-white">Timing of Pit Stop</td>
                  <td className="p-3 text-amber-400">Pit 1-2 laps before rival</td>
                  <td className="p-3 text-racing-cyan">Stay out 2-6 laps after rival pits</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Primary Weapon</td>
                  <td className="p-3">Instant fresh tyre grip (+1.8s to +2.5s out-lap)</td>
                  <td className="p-3">Clean air pace while rival clears backmarker traffic</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Ideal Circuit Types</td>
                  <td className="p-3">High tyre degradation tracks (Bahrain, Barcelona)</td>
                  <td className="p-3">Low tyre wear street circuits (Monaco, Baku)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Key Risk Factor</td>
                  <td className="p-3">Re-entering into a DRS train of midfield cars</td>
                  <td className="p-3">Sudden tyre cliff causing massive time drop-off</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    ),
  },
  "what-is-drs-in-f1-telemetry": {
    slug: "what-is-drs-in-f1-telemetry",
    title: "What is DRS and How is it Shown in Telemetry Traces?",
    metaTitle: "What is DRS in F1 Telemetry? Traces & Physics Explained",
    description:
      "Explore the Drag Reduction System in Formula 1. Discover how DRS flap opening is logged in car telemetry and how it boosts straightline speed by 14-20 km/h.",
    category: "Aerodynamics",
    readTime: "5 min read",
    datePublished: "2026-03-20T00:00:00Z",
    dateModified: "2026-11-10T18:00:00Z",
    author: {
      name: "Marcus Vance",
      role: "Lead Motorsport Telemetry Engineer",
      credentials: "Former Formula 3 data engineer and vehicle dynamics analyst.",
    },
    reviewer: {
      name: "Elena Rostova",
      role: "Aerodynamics & Performance Specialist",
    },
    directAnswer:
      "DRS (Drag Reduction System) is a driver-controlled hydraulic mechanism that opens a 85mm flap in the rear wing on designated straights. In telemetry traces, DRS appears as a dedicated binary channel (0 = Closed, 1 = Open). Its effect is visible on the speed curve as a steeper acceleration slope and a top speed increase of 14 to 22 km/h.",
    faqs: [
      {
        question: "What does DRS stand for in Formula 1?",
        answer: "DRS stands for Drag Reduction System, introduced by the FIA in 2011 to promote overtaking.",
      },
      {
        question: "When is a driver allowed to activate DRS during a race?",
        answer:
          "During a Grand Prix, DRS can be activated when a driver is within 1.000 second of the car ahead at the designated detection line and is inside an authorized DRS activation zone.",
      },
      {
        question: "How does DRS appear on a telemetry speed trace?",
        answer:
          "When DRS opens, the speed curve's rate of acceleration changes angle, sustaining strong acceleration past 300 km/h where aerodynamic drag would otherwise flatten the curve.",
      },
    ],
    contentHtml: (
      <div className="space-y-8 text-zinc-300 leading-relaxed text-sm">
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            What is DRS and how does it work physically?
          </h2>
          <p>
            The Drag Reduction System (DRS) is an aerodynamic device introduced to reduce the wake drag penalty suffered by trailing cars. When activated, a hydraulic actuator pivots the upper rear wing flap, opening an 85mm aperture.
          </p>
          <p>
            By reducing total vehicle aerodynamic drag coefficient (Cd) by approximately 20% to 25%, the car requires significantly less engine horsepower to overcome air resistance, allowing speeds to escalate rapidly into braking zones.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            DRS Telemetry Signature Characteristics
          </h2>
          <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-carbon-900">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-zinc-950 text-zinc-400 text-[11px] uppercase border-b border-zinc-800">
                <tr>
                  <th className="p-3">Telemetry Metric</th>
                  <th className="p-3">DRS Closed (Normal)</th>
                  <th className="p-3">DRS Activated (Open)</th>
                  <th className="p-3">Net Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                <tr>
                  <td className="p-3 font-semibold text-white">Terminal Speed Trap</td>
                  <td className="p-3 text-zinc-400">318 - 325 km/h</td>
                  <td className="p-3 text-emerald-400 font-bold">334 - 345 km/h</td>
                  <td className="p-3 text-amber-400">+14 to +22 km/h delta</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Acceleration past 280 km/h</td>
                  <td className="p-3">Progressively flattens due to drag</td>
                  <td className="p-3">Sustains linear acceleration slope</td>
                  <td className="p-3">0.2s - 0.4s sector gain</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Rear Downforce</td>
                  <td className="p-3">100% nominal aero downforce</td>
                  <td className="p-3">~70% downforce while straight</td>
                  <td className="p-3">Flap closes automatically upon braking</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    ),
  },
  "tyre-degradation-models-explained": {
    slug: "tyre-degradation-models-explained",
    title: "How F1 Tyre Degradation Models Work: Thermal vs Mechanical Wear",
    metaTitle: "F1 Tyre Degradation Models & Physics | Pitwall Guide",
    description:
      "Explore how Formula 1 teams model tyre degradation. Understand thermal vs mechanical wear, the performance cliff, and compound stint pacing.",
    category: "Tyre Dynamics",
    readTime: "8 min read",
    datePublished: "2026-03-25T00:00:00Z",
    dateModified: "2026-11-10T18:00:00Z",
    author: {
      name: "Marcus Vance",
      role: "Lead Motorsport Telemetry Engineer",
      credentials: "Former Formula 3 data engineer and vehicle dynamics analyst.",
    },
    reviewer: {
      name: "Elena Rostova",
      role: "Aerodynamics & Performance Specialist",
    },
    directAnswer:
      "A tyre degradation model is a mathematical simulation quantifying how an F1 tyre compound loses lap time as laps accrue. Degradation comprises two mechanisms: mechanical wear (tread thickness reduction) and thermal degradation (overheating of the core rubber). Most circuits exhibit degradation rates between 0.05s and 0.18s per lap before reaching the steep 'cliff'.",
    faqs: [
      {
        question: "What is the difference between tyre wear and tyre degradation?",
        answer:
          "Tyre wear is the physical erosion of tread rubber thickness over distance. Tyre degradation is the overall loss of lap time caused by a combination of tread wear, thermal overheating, graining, and surface blistering.",
      },
      {
        question: "What is the 'tyre cliff' in Formula 1?",
        answer:
          "The tyre cliff is the non-linear inflection point where degradation escalates exponentially, causing a sudden loss of 1.5s to 3.0s per lap as the tread depth can no longer maintain temperature stability.",
      },
      {
        question: "How do teams use tyre models during a race?",
        answer:
          "Teams run real-time Monte Carlo simulations updating with live sector deltas to predict the exact crossover lap when pitting for fresh rubber yields a lower total race time than remaining on worn tyres.",
      },
    ],
    contentHtml: (
      <div className="space-y-8 text-zinc-300 leading-relaxed text-sm">
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            What is tyre degradation in Formula 1?
          </h2>
          <p>
            Tyre degradation is the quantifiable decline in grip generated by the tyre contact patch over successive race laps. In modern Pirelli Formula 1 slick tyres (C1 through C5 compounds), tyre performance follows a multi-phase curve:
          </p>
          <ul className="space-y-2 list-disc list-inside text-zinc-300 pl-2">
            <li><strong>Phase 1 (Peak Grip):</strong> Laps 1-3 where the outer resin offers maximum mechanical micro-interlocking.</li>
            <li><strong>Phase 2 (Linear Degradation):</strong> A predictable lap time decay slope typically between 0.06s and 0.12s per lap.</li>
            <li><strong>Phase 3 (The Cliff):</strong> A sudden exponential drop where the tyre loses bulk thermal compliance and lap times plummet by 2+ seconds per lap.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Compound Characteristics &amp; Degradation Benchmarks
          </h2>
          <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-carbon-900">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-zinc-950 text-zinc-400 text-[11px] uppercase border-b border-zinc-800">
                <tr>
                  <th className="p-3">Pirelli Compound</th>
                  <th className="p-3">Initial Pace Advantage</th>
                  <th className="p-3">Degradation Rate / Lap</th>
                  <th className="p-3">Expected Stint Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                <tr>
                  <td className="p-3 font-semibold text-racing-red">Soft (Red)</td>
                  <td className="p-3 text-emerald-400 font-bold">Baseline (+0.8s vs Med)</td>
                  <td className="p-3 text-red-400">0.14s - 0.22s / lap</td>
                  <td className="p-3 text-zinc-400">12 - 18 laps</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-amber-400">Medium (Yellow)</td>
                  <td className="p-3 text-amber-300">+0.5s vs Hard</td>
                  <td className="p-3 text-amber-400">0.08s - 0.12s / lap</td>
                  <td className="p-3 text-zinc-400">22 - 32 laps</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-zinc-200">Hard (White)</td>
                  <td className="p-3 text-zinc-400">Pace baseline</td>
                  <td className="p-3 text-emerald-400">0.04s - 0.07s / lap</td>
                  <td className="p-3 text-zinc-400">35 - 48 laps</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    ),
  },
};

export function generateStaticParams() {
  return Object.keys(GUIDES_DATA).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDES_DATA[slug];

  if (!guide) {
    return {
      title: "Technical Guide | Formula 1 Telemetry",
      description: "Formula 1 telemetry and race engineering technical guides.",
    };
  }

  return {
    title: guide.metaTitle,
    description: guide.description.slice(0, 160),
    alternates: {
      canonical: `${CANONICAL_BASE}/${guide.slug}`,
    },
    openGraph: {
      title: guide.metaTitle,
      description: guide.description,
      url: `${CANONICAL_BASE}/${guide.slug}`,
      type: "article",
      publishedTime: guide.datePublished,
      modifiedTime: guide.dateModified,
      authors: [guide.author.name],
    },
  };
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = GUIDES_DATA[slug];

  if (!guide) {
    notFound();
  }

  const canonicalUrl = `${CANONICAL_BASE}/${guide.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${canonicalUrl}/#article`,
    headline: guide.title,
    description: guide.description,
    url: canonicalUrl,
    datePublished: guide.datePublished,
    dateModified: guide.dateModified,
    inLanguage: "en-US",
    author: {
      "@type": "Person",
      name: guide.author.name,
      jobTitle: guide.author.role,
      description: guide.author.credentials,
    },
    publisher: {
      "@type": "Organization",
      name: "Formula 1 Telemetry",
      url: "https://www.formula1telemetry.com",
    },
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
        name: "Guides",
        item: "https://www.formula1telemetry.com/guides",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: guide.title,
        item: canonicalUrl,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((faq) => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 w-full max-w-full overflow-hidden">
        {/* Navigation & Breadcrumbs */}
        <div className="flex items-center justify-between">
          <Link
            href="/guides"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Guides</span>
          </Link>
          <nav aria-label="Breadcrumb" className="text-xs font-mono text-zinc-500 hidden sm:flex items-center gap-2">
            <Link href="/" className="hover:text-zinc-300">Home</Link>
            <span>/</span>
            <Link href="/guides" className="hover:text-zinc-300">Guides</Link>
            <span>/</span>
            <span className="text-zinc-200 truncate max-w-[200px]">{guide.title}</span>
          </nav>
        </div>

        {/* Header */}
        <header className="space-y-4 border-b border-zinc-800 pb-8">
          <div className="flex items-center gap-2">
            <Badge variant="racing" className="text-xs font-mono">{guide.category}</Badge>
            <span className="text-xs font-mono text-zinc-500">{guide.readTime}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {guide.title}
          </h1>

          <QuickAnswer
            question="Key Technical Answer:"
            answer={guide.directAnswer}
          />

          {/* E-E-A-T Author & Reviewer Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 text-xs font-mono text-zinc-400 border-t border-zinc-800/80">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 font-bold">
                MV
              </div>
              <div>
                <span className="text-white font-semibold block">{guide.author.name}</span>
                <span className="text-[11px] text-zinc-500">{guide.author.role}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-zinc-500">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                Reviewed by {guide.reviewer.name}
              </span>
              <span>•</span>
              <span>Updated Nov 10, 2026</span>
            </div>
          </div>
        </header>

        {/* Main Body Content */}
        <div className="space-y-8">
          {guide.contentHtml}
        </div>

        {/* Compact, Crawlable FAQ Accordion */}
        <FAQAccordion
          items={guide.faqs}
          title="Frequently Asked Questions"
          subtitle="Key technical details and engineering concepts explained."
          className="pt-6 border-t border-zinc-800"
        />

        {/* Bottom Pro Marketing Banner */}
        <ProMarketingCard
          title="Put This Engineering Theory Into Practice"
          subtitle="Explore high-resolution dual-car telemetry traces, braking deceleration points, and tyre degradation curves for $9.99/mo."
          contextTag="HANDS-ON TELEMETRY LAB"
        />
      </article>
    </>
  );
}

