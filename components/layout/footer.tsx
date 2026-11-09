import Link from "next/link";
import { Activity, ShieldCheck, Database, Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/80 bg-carbon-950 text-zinc-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Description */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-racing-red to-red-800 flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-base tracking-wider text-white">APEX PULSE</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-md">
            Next-generation telemetry, tyre strategy simulator, and session replay analytics
            for motorsport enthusiasts. Direct client-side browser telemetry powered by Jolpica and OpenF1.
          </p>
          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-zinc-400" />
              Jolpica Ergast & OpenF1
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Dodo Payments SSL
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-3 font-mono">
            Navigation
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/races" className="hover:text-white transition-colors">
                Season Calendar & Results
              </Link>
            </li>
            <li>
              <Link href="/standings" className="hover:text-white transition-colors">
                Championship Standings
              </Link>
            </li>
            <li>
              <Link href="/drivers" className="hover:text-white transition-colors">
                Driver Profiles
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-white transition-colors">
                Pro Subscription
              </Link>
            </li>
          </ul>
        </div>

        {/* Pro Features */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-3 font-mono">
            Pro Suite
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/pro/telemetry" className="hover:text-white transition-colors flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                Car Telemetry Comparison
              </Link>
            </li>
            <li>
              <Link href="/pro/strategy" className="hover:text-white transition-colors flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                Tyre Degradation Modeling
              </Link>
            </li>
            <li>
              <Link href="/pro/replay" className="hover:text-white transition-colors flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                Session Timing Replay
              </Link>
            </li>
            <li>
              <Link href="/pro/predictor" className="hover:text-white transition-colors flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                Podium Outcome Predictor
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* MANDATORY LEGAL DISCLAIMER */}
      <div className="max-w-7xl mx-auto border-t border-zinc-900 mt-8 pt-8 text-[11px] text-zinc-400 leading-relaxed space-y-2">
        <p className="font-semibold text-zinc-400">
          DISCLAIMER & LEGAL NOTICE:
        </p>
        <p>
          This website is an unofficial product and is not associated in any way with Formula 1,
          the Formula One group of companies, the Fédération Internationale de l'Automobile (FIA),
          or Formula One Licensing B.V.
        </p>
        <p>
          F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX and related
          marks are trade marks of Formula One Licensing B.V. All trademarks and brand names are
          the property of their respective owners and used solely for descriptive and statistical
          purposes under fair use.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row justify-between items-center text-zinc-400">
          <span>&copy; {new Date().getFullYear()} Apex Pulse Analytics. All rights reserved.</span>
          <span>Data provided via public community APIs (Jolpica-F1 & OpenF1).</span>
        </div>
      </div>
    </footer>
  );
}
