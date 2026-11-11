import Link from "next/link";
import { Activity, ShieldCheck, Database, Zap, BookOpen, MapPin, Info, FileText } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/80 bg-carbon-950 text-zinc-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        {/* Brand Description */}
        <div className="sm:col-span-2 lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-racing-red to-red-800 flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-base tracking-wider text-white">FORMULA 1 TELEMETRY</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-md">
            Next-generation Formula 1 telemetry, tyre degradation simulator, and session replay analytics
            for motorsport enthusiasts. High-precision analytics engineered directly for fans.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-zinc-400" />
              Live Telemetry Feeds
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
              256-Bit SSL Encrypted
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-3 font-mono">
            Championship
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/races" className="hover:text-white transition-colors">
                Grand Prix Calendar
              </Link>
            </li>
            <li>
              <Link href="/standings" className="hover:text-white transition-colors">
                Championship Standings
              </Link>
            </li>
            <li>
              <Link href="/drivers" className="hover:text-white transition-colors">
                Driver Roster
              </Link>
            </li>
            <li>
              <Link href="/circuits" className="hover:text-white transition-colors flex items-center gap-1">
                <MapPin className="w-3 h-3 text-racing-red" />
                <span>Circuits & Tracks</span>
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-white transition-colors">
                Pro Membership ($9.99/mo)
              </Link>
            </li>
          </ul>
        </div>

        {/* Technical Guides */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-3 font-mono">
            Engineering Guides
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/guides/how-to-read-f1-telemetry" className="hover:text-white transition-colors flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-blue-400" />
                <span>Reading Telemetry</span>
              </Link>
            </li>
            <li>
              <Link href="/guides/undercut-vs-overcut-explained" className="hover:text-white transition-colors">
                Undercut vs Overcut
              </Link>
            </li>
            <li>
              <Link href="/guides/what-is-drs-in-f1-telemetry" className="hover:text-white transition-colors">
                DRS in Telemetry
              </Link>
            </li>
            <li>
              <Link href="/guides/tyre-degradation-models-explained" className="hover:text-white transition-colors">
                Tyre Degradation Models
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
                Speed & Throttle Traces
              </Link>
            </li>
            <li>
              <Link href="/pro/strategy" className="hover:text-white transition-colors flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                Tyre Stint Degradation
              </Link>
            </li>
            <li>
              <Link href="/pro/replay" className="hover:text-white transition-colors flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                Session Replay Tower
              </Link>
            </li>
            <li>
              <Link href="/pro/predictor" className="hover:text-white transition-colors flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                Race Outcome Predictor
              </Link>
            </li>
            <li>
              <Link href="/pro/laps" className="hover:text-white transition-colors flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                Lap Time Charts
              </Link>
            </li>
          </ul>
        </div>

        {/* E-E-A-T & Policies */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-3 font-mono">
            Platform & Legal
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/about" className="hover:text-white transition-colors flex items-center gap-1">
                <Info className="w-3 h-3 text-emerald-400" />
                <span>About & Mission</span>
              </Link>
            </li>
            <li>
              <Link href="/methodology" className="hover:text-white transition-colors flex items-center gap-1">
                <FileText className="w-3 h-3 text-emerald-400" />
                <span>Data Methodology</span>
              </Link>
            </li>
            <li>
              <Link href="/changelog" className="hover:text-white transition-colors">
                Changelog & Updates
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/refund" className="hover:text-white transition-colors">
                Refund & Cancellation
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
          This website is not associated in any way with Formula 1,
          the Formula One group of companies, the Fédération Internationale de l'Automobile (FIA),
          or Formula One Licensing B.V.
        </p>
        <p>
          F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX and related
          marks are trade marks of Formula One Licensing B.V. All trademarks and brand names are
          the property of their respective owners and used solely for descriptive and statistical
          purposes under fair use.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row justify-between items-center text-zinc-400 gap-2">
          <span>&copy; {new Date().getFullYear()} Formula 1 Telemetry. All rights reserved.</span>
          <span>High-precision timing & telemetry analytics platform.</span>
        </div>
      </div>
    </footer>
  );
}
