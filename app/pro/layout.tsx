"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProGate } from "@/components/pro/pro-gate";
import { ProBadge } from "@/components/layout/pro-badge";
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
    <div className="w-full">
      {/* Pro Sub-Navigation Header */}
      <div className="border-b border-zinc-800 bg-carbon-950/90 backdrop-blur-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-12 overflow-x-auto">
          <div className="flex items-center gap-1.5 shrink-0 pr-4">
            <span className="font-extrabold text-xs tracking-wider text-white">APEX</span>
            <ProBadge />
          </div>

          <div className="flex items-center gap-1">
            {proNavItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-colors shrink-0 ${
                    isActive
                      ? "bg-zinc-800 text-white font-bold"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 opacity-80" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProGate>{children}</ProGate>
      </div>
    </div>
  );
}

