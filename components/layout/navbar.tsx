"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { Button } from "@/components/ui/button";
import { ProBadge } from "@/components/layout/pro-badge";
import {
  Activity,
  Calendar,
  Users,
  Trophy,
  Zap,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  CreditCard,
  MapPin,
  BookOpen,
  ArrowRight,
  Radio,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { user, loading: authLoading, logout } = useAuth();
  const { isPro } = useSubscription();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/pro/live", label: "Live Race", icon: Radio, isPro: true, isLive: true },
    { href: "/races", label: "Races", icon: Calendar, isPro: true },
    { href: "/drivers", label: "Drivers", icon: Users, isPro: true },
    { href: "/standings", label: "Standings", icon: Trophy, isPro: true },
    { href: "/circuits", label: "Circuits", icon: MapPin, isPro: true },
    { href: "/guides", label: "Guides", icon: BookOpen, isPro: true },
    { href: "/pro", label: "Pro Hub", icon: Zap, isPro: true },
    { href: "/pricing", label: "Pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-carbon-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-3 sm:px-6 lg:px-8 gap-2">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-racing-red to-red-800 flex items-center justify-center shadow-md shadow-racing-red/20 group-hover:scale-105 transition-transform shrink-0">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base tracking-wider text-white">FORMULA 1</span>
              <span className="text-racing-red font-mono font-bold text-xs">TELEMETRY</span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-zinc-400 -mt-1 font-mono tracking-widest uppercase hidden xs:block">
              Grand Prix Analytics
            </span>
          </div>
        </Link>

        {/* Desktop Navigation - Responsive & Non-Overlapping */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 shrink-0" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href) && (link.href !== "/" || pathname === "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap flex items-center gap-1 px-2 xl:px-2.5 py-1.5 rounded-md text-xs xl:text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-zinc-800 text-white font-semibold"
                    : "text-zinc-300 hover:text-white hover:bg-zinc-800/50"
                }`}
              >
                <span>{link.label}</span>
                {link.isLive ? (
                  <span className="flex items-center gap-1 px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase rounded bg-red-600 text-white animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    LIVE
                  </span>
                ) : link.isPro ? (
                  <span className="px-1 py-0.2 text-[9px] font-mono font-bold uppercase rounded bg-racing-red text-white">
                    PRO
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Auth CTA & Profile */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-2.5 shrink-0">
          {authLoading ? (
            <div className="w-20 h-8 bg-zinc-800 rounded animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-2 shrink-0">
              {isPro ? (
                <div className="flex items-center gap-1 text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded-full font-mono shrink-0">
                  <Zap className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>PRO MEMBER</span>
                </div>
              ) : (
                <Link href="/pricing" className="shrink-0">
                  <Button variant="racing" size="sm" className="h-8 px-2.5 text-xs font-bold gap-1 shadow-md shadow-racing-red/25 cursor-pointer">
                    <Zap className="w-3.5 h-3.5 fill-white text-white" />
                    <span>Go Pro</span>
                    <span className="hidden xl:inline text-white/90 font-mono text-[11px]">($9.99)</span>
                  </Button>
                </Link>
              )}

              <Link href="/account" className="shrink-0">
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs gap-1 text-zinc-300 hover:text-white">
                  <UserIcon className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="max-w-[70px] xl:max-w-[100px] truncate">{user.email?.split("@")[0]}</span>
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="h-8 w-8 text-zinc-400 hover:text-red-400 shrink-0"
                aria-label="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 shrink-0">
              <Link href="/login" className="shrink-0">
                <Button variant="ghost" size="sm" className="h-8 px-2.5 text-xs text-zinc-300 hover:text-white">
                  Sign In
                </Button>
              </Link>
              <Link href="/pricing" className="shrink-0">
                <Button variant="racing" size="sm" className="h-8 px-3 text-xs font-bold gap-1 bg-gradient-to-r from-racing-red to-red-600 shadow-md shadow-racing-red/25">
                  <Zap className="w-3.5 h-3.5 fill-white text-white" />
                  <span>Get Pro</span>
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu and Go Pro CTA */}
        <div className="flex lg:hidden items-center gap-1.5">
          {!isPro && (
            <Link href="/pricing" className="shrink-0">
              <Button variant="racing" size="sm" className="h-7 px-2 text-[11px] font-bold gap-1">
                <Zap className="w-3 h-3 fill-white" />
                <span>Pro $9.99</span>
              </Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-zinc-300 h-8 w-8"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-zinc-800 bg-carbon-950 px-4 pt-2 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                <span className="flex items-center gap-2">
                  {link.icon && <link.icon className="w-4 h-4 text-zinc-400" />}
                  {link.label}
                </span>
                {link.isPro && <ProBadge />}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-800 space-y-2">
            {user ? (
              <div className="space-y-2">
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded-md"
                >
                  <CreditCard className="w-4 h-4 text-zinc-400" />
                  <span>Account &amp; Subscription</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-zinc-800 rounded-md text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full text-xs">
                    Sign In
                  </Button>
                </Link>
                <Link href="/pricing" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="racing" className="w-full text-xs font-bold gap-1.5 shadow-md shadow-racing-red/30">
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    <span>Upgrade to Pro ($9.99/mo)</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
