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
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { user, loading: authLoading, logout } = useAuth();
  const { isPro } = useSubscription();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/races", label: "Races", icon: Calendar },
    { href: "/drivers", label: "Drivers", icon: Users },
    { href: "/standings", label: "Standings", icon: Trophy },
    { href: "/pro", label: "Pro Analytics", icon: Zap, isPro: true },
    { href: "/pricing", label: "Pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-carbon-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-racing-red to-red-800 flex items-center justify-center shadow-md shadow-racing-red/20 group-hover:scale-105 transition-transform">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-wider text-white">APEX</span>
              <span className="text-racing-red font-mono font-bold text-xs">PULSE</span>
            </div>
            <span className="text-[10px] text-zinc-400 -mt-1 font-mono tracking-widest uppercase">
              Grand Prix Analytics
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href) && (link.href !== "/" || pathname === "/");
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-zinc-800/90 text-white"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40"
                }`}
              >
                {Icon && <Icon className="w-4 h-4 opacity-75" />}
                <span>{link.label}</span>
                {link.isPro && <ProBadge className="ml-1 scale-90" />}
              </Link>
            );
          })}
        </nav>

        {/* Auth CTA & Profile */}
        <div className="hidden md:flex items-center gap-3">
          {authLoading ? (
            <div className="w-24 h-8 bg-zinc-800 rounded animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              {isPro ? (
                <div className="hidden lg:flex items-center gap-1 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full font-mono">
                  <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>PRO SUBSCRIBER</span>
                </div>
              ) : (
                <Link href="/pricing">
                  <Button variant="racing" size="sm" className="h-8 text-xs font-semibold">
                    Upgrade to Pro
                  </Button>
                </Link>
              )}

              <Link href="/account">
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                  <UserIcon className="w-3.5 h-3.5" />
                  <span className="max-w-[100px] truncate">
                    {user.displayName || user.email?.split("@")[0] || "Account"}
                  </span>
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => logout()}
                title="Sign out"
                className="h-8 w-8 text-zinc-400 hover:text-red-400"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="h-8 text-xs text-zinc-300">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="racing" size="sm" className="h-8 text-xs font-semibold">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-zinc-400"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-carbon-900 px-4 pt-2 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                <span className="flex items-center gap-2">
                  {link.icon && <link.icon className="w-4 h-4" />}
                  {link.label}
                </span>
                {link.isPro && <ProBadge />}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-zinc-800 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-zinc-300 hover:bg-zinc-800"
                >
                  <CreditCard className="w-4 h-4" />
                  Account & Billing
                </Link>
                <Button
                  variant="outline"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-xs text-red-400"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full text-xs">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="racing" className="w-full text-xs">
                    Get Started
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
