import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://formula1telemetry.com";
  const now = new Date();

  const routes = [
    { path: "", changeFrequency: "daily" as const, priority: 1.0 },
    { path: "/races", changeFrequency: "daily" as const, priority: 0.9 },
    { path: "/standings", changeFrequency: "daily" as const, priority: 0.9 },
    { path: "/drivers", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/pricing", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/dashboard", changeFrequency: "daily" as const, priority: 0.8 },
    { path: "/pro", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/pro/telemetry", changeFrequency: "weekly" as const, priority: 0.7 },
    { path: "/pro/strategy", changeFrequency: "weekly" as const, priority: 0.7 },
    { path: "/pro/replay", changeFrequency: "weekly" as const, priority: 0.7 },
    { path: "/pro/predictor", changeFrequency: "weekly" as const, priority: 0.7 },
    { path: "/pro/laps", changeFrequency: "weekly" as const, priority: 0.7 },
    { path: "/terms", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/privacy", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/refund", changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}

