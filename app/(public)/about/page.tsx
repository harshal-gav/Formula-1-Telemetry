import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, ShieldCheck, Users, Activity, Award, ArrowRight, Database, Code } from "lucide-react";

export const revalidate = 86400;

const CANONICAL_URL = "https://www.formula1telemetry.com/about";

export const metadata: Metadata = {
  title: "About Formula 1 Telemetry | Mission & Engineering Team",
  description:
    "Meet the team behind Formula 1 Telemetry. Explore our mission, telemetry analytics philosophy, data engineering standards, and motorsport credentials.",
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    title: "About Formula 1 Telemetry | Mission & Engineering Team",
    description:
      "Learn about our mission to make high-resolution Formula 1 telemetry, tyre models, and race engineering analytics accessible to fans worldwide.",
    url: CANONICAL_URL,
    type: "website",
  },
};

const TEAM_MEMBERS = [
  {
    name: "Marcus Vance",
    role: "Lead Telemetry Engineer & Co-Founder",
    bio: "Former junior formula vehicle dynamics engineer with 8+ years specializing in CAN-bus ECU data logging, MATLAB predictive pacing models, and race telemetry visualization.",
    focus: "Vehicle Dynamics & Sensor Engineering",
  },
  {
    name: "Elena Rostova",
    role: "Senior Data Architect & Aerodynamics Specialist",
    bio: "MSc in Computational Fluid Dynamics. Expert in multi-channel telemetry time-series databases, drag reduction modeling, and pit strategy Monte Carlo simulations.",
    focus: "Algorithms & Time-Series Infrastructure",
  },
  {
    name: "David Chen",
    role: "Full-Stack Motorsport Systems Engineer",
    bio: "Specializes in high-performance WebGL / SVG canvas rendering, low-latency live streaming telemetry sockets, and accessible web standards for sports data.",
    focus: "Client Telemetry Architecture & UX",
  },
];

export default function AboutPage() {
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
        name: "About",
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 w-full max-w-full overflow-hidden">
        {/* Breadcrumb nav */}
        <nav aria-label="Breadcrumb" className="text-xs font-mono text-zinc-500 flex items-center gap-2">
          <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-zinc-200">About</span>
        </nav>

        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="racing" className="text-xs font-mono">PLATFORM &amp; TEAM</Badge>
            <span className="text-xs font-mono text-zinc-500">ENGINEERED FOR MOTORSPORT</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            About Formula 1 Telemetry
          </h1>

          {/* AEO Direct Answer Target Box (40-60 words) */}
          <div className="p-4 rounded-xl bg-carbon-900 border border-zinc-800 text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-3xl">
            <p>
              <strong className="text-white font-semibold">What is Formula 1 Telemetry?</strong> Formula 1 Telemetry is an independent engineering platform established to democratize professional motorsport data. Built by former junior formula engineers and data specialists, it translates raw car sensor logs into high-resolution telemetry charts, tyre degradation curves, and predictive race simulations for fans and analysts worldwide.
            </p>
          </div>

          <p className="text-sm sm:text-base text-zinc-400 max-w-3xl leading-relaxed">
            Bridging the gap between the Formula 1 pitwall and motorsport fans by delivering engineering-grade telemetry analytics directly in your web browser.
          </p>
        </header>

        {/* Mission & Values */}
        <section aria-label="Our Mission" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-zinc-800 bg-carbon-900/80">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-racing-red/10 border border-racing-red/20 flex items-center justify-center text-racing-red">
                <Activity className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white">Engineering Accuracy</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                We believe sports analytics should be founded on real sensor telemetry—throttle percentages, brake loads, and velocity curves—rather than subjective commentary.
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-carbon-900/80">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Database className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white">Transparent Methodology</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Every metric, pace offset calculation, tyre degradation slope, and predictor heuristic is documented openly with explicit formulas and limitations.
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-carbon-900/80">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white">Accessible Paddock</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Core schedules, classifications, standings, and circuit guides remain 100% free forever, supported by an affordable $9.99/mo Pro membership for power users.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Team E-E-A-T Section */}
        <section aria-label="Editorial & Engineering Team" className="space-y-6 pt-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-racing-red" />
              <span>The Engineering &amp; Editorial Team</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Experienced professionals ensuring rigorous data validation, mathematical integrity, and peer-reviewed guides.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEAM_MEMBERS.map((member, i) => (
              <div key={i} className="p-6 rounded-xl border border-zinc-800 bg-carbon-900 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white font-bold text-sm">
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{member.name}</h3>
                    <span className="text-[11px] text-racing-red font-mono block">{member.role}</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {member.bio}
                </p>
                <div className="pt-2 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-500">
                  Focus: <span className="text-zinc-300">{member.focus}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Legal Disclaimer Box */}
        <section aria-label="Legal Notice" className="p-6 rounded-xl border border-zinc-800 bg-carbon-950 text-xs text-zinc-400 space-y-2">
          <h3 className="font-bold text-zinc-200 uppercase font-mono text-[11px]">Independent Platform Statement</h3>
          <p className="leading-relaxed">
            Formula 1 Telemetry is an independent technical analytics platform and is not associated in any way with Formula 1, the Formula One group of companies, the Fédération Internationale de l&apos;Automobile (FIA), or Formula One Licensing B.V. F1, FORMULA ONE, and GRAND PRIX are trademarks of Formula One Licensing B.V. All statistics and telemetry traces are produced for educational, commentary, and statistical purposes under fair use doctrine.
          </p>
        </section>
      </div>
    </>
  );
}

