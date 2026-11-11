"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { GPProvider } from "@/context/gp-context";

const TelemetryChartDynamic = dynamic(
  () => import("@/components/pro/telemetry-chart").then((m) => m.TelemetryChart),
  {
    loading: () => <TelemetrySkeleton />,
    ssr: false,
  }
);

function TelemetrySkeleton() {
  return (
    <div
      className="w-full h-[520px] rounded-2xl border border-zinc-800 bg-carbon-900/60 p-6 flex flex-col justify-between animate-pulse"
      aria-label="Loading interactive telemetry chart"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="h-6 w-56 bg-zinc-800 rounded" />
        <div className="flex gap-2">
          <div className="h-7 w-20 bg-zinc-800 rounded" />
          <div className="h-7 w-20 bg-zinc-800 rounded" />
        </div>
      </div>
      <div className="h-80 w-full bg-zinc-950/40 rounded-lg flex items-center justify-center border border-zinc-800/40">
        <span className="text-xs font-mono text-zinc-500">
          Initialising Formula 1 high-resolution telemetry traces...
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-zinc-800/80">
        <div className="h-14 bg-zinc-800/50 rounded" />
        <div className="h-14 bg-zinc-800/50 rounded" />
        <div className="h-14 bg-zinc-800/50 rounded" />
        <div className="h-14 bg-zinc-800/50 rounded" />
      </div>
    </div>
  );
}

export function LazyTelemetryPreview() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldLoad) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div ref={containerRef} className="min-h-[520px]">
      {shouldLoad ? (
        <GPProvider>
          <TelemetryChartDynamic />
        </GPProvider>
      ) : (
        <TelemetrySkeleton />
      )}
    </div>
  );
}
