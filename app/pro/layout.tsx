"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProGate } from "@/components/pro/pro-gate";
import { GPSelector } from "@/components/pro/gp-selector";
import {
  Activity,
  BarChart2,
  Disc3,
  Radio,
  Sparkles,
  LayoutGrid,
} from "lucide-react";

export default function ProLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const proNavItems = [
    { href: "/pro", label: "Overview", icon: LayoutGrid, exact: true },
    { href: "/pro/telemetry", label: "Telemetry Trace", icon: Activity },
    { href: "/pro/laps", label: "Lap Charts", icon: BarChart2 },
    { href: "/pro/strategy", label: "Tyre Strategy", icon: Disc3 },
    { href: "/pro/replay", label: "Session Replay", icon: Radio },
    { href: "/pro/predictor", label: "Race Predictor", icon: Sparkles },
  ];

  return (
    <div className="w-full flex flex-col">
      {/* Pro Sub-Navigation Header: Clean, non-overlapping horizontal tab bar */}
      <div className="border-b border-zinc-800/80 bg-carbon-950/95 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 py-2.5 overflow-x-auto no-scrollbar">
            {proNavItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 whitespace-nowrap ${
                    isActive
                      ? "bg-zinc-800 text-white font-bold border border-zinc-700 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/80 border border-transparent"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 opacity-80" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Pro Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <ProGate>
          <div className="space-y-6">
            <GPSelector />
            {children}
          </div>
        </ProGate>
      </div>
    </div>
  );
}
