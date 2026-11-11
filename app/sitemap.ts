import { MetadataRoute } from "next";
import { GRAND_PRIX_LIST } from "@/lib/grand-prix";
import { PRO_DRIVERS } from "@/lib/drivers";

const CANONICAL_BASE_URL = "https://www.formula1telemetry.com";

const GUIDES_LIST = [
  "how-to-read-f1-telemetry",
  "undercut-vs-overcut-explained",
  "what-is-drs-in-f1-telemetry",
  "tyre-degradation-models-explained",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastSyncDate = new Date("2026-11-10T18:00:00Z");
  const policyDate = new Date("2026-11-01T00:00:00Z");

  const coreRoutes: MetadataRoute.Sitemap = [
    { url: `${CANONICAL_BASE_URL}`, lastModified: lastSyncDate, changeFrequency: "daily", priority: 1.0 },
    { url: `${CANONICAL_BASE_URL}/races`, lastModified: lastSyncDate, changeFrequency: "daily", priority: 0.9 },
    { url: `${CANONICAL_BASE_URL}/standings`, lastModified: lastSyncDate, changeFrequency: "daily", priority: 0.9 },
    { url: `${CANONICAL_BASE_URL}/drivers`, lastModified: lastSyncDate, changeFrequency: "weekly", priority: 0.85 },
    { url: `${CANONICAL_BASE_URL}/circuits`, lastModified: lastSyncDate, changeFrequency: "weekly", priority: 0.85 },
    { url: `${CANONICAL_BASE_URL}/guides`, lastModified: lastSyncDate, changeFrequency: "weekly", priority: 0.85 },
    { url: `${CANONICAL_BASE_URL}/pricing`, lastModified: lastSyncDate, changeFrequency: "monthly", priority: 0.8 },
    { url: `${CANONICAL_BASE_URL}/about`, lastModified: lastSyncDate, changeFrequency: "monthly", priority: 0.6 },
    { url: `${CANONICAL_BASE_URL}/methodology`, lastModified: lastSyncDate, changeFrequency: "monthly", priority: 0.6 },
    { url: `${CANONICAL_BASE_URL}/changelog`, lastModified: lastSyncDate, changeFrequency: "weekly", priority: 0.6 },
    { url: `${CANONICAL_BASE_URL}/pro`, lastModified: lastSyncDate, changeFrequency: "weekly", priority: 0.7 },
    { url: `${CANONICAL_BASE_URL}/pro/telemetry`, lastModified: lastSyncDate, changeFrequency: "weekly", priority: 0.7 },
    { url: `${CANONICAL_BASE_URL}/pro/strategy`, lastModified: lastSyncDate, changeFrequency: "weekly", priority: 0.7 },
    { url: `${CANONICAL_BASE_URL}/pro/replay`, lastModified: lastSyncDate, changeFrequency: "weekly", priority: 0.7 },
    { url: `${CANONICAL_BASE_URL}/pro/predictor`, lastModified: lastSyncDate, changeFrequency: "weekly", priority: 0.7 },
    { url: `${CANONICAL_BASE_URL}/pro/laps`, lastModified: lastSyncDate, changeFrequency: "weekly", priority: 0.7 },
    { url: `${CANONICAL_BASE_URL}/terms`, lastModified: policyDate, changeFrequency: "monthly", priority: 0.4 },
    { url: `${CANONICAL_BASE_URL}/privacy`, lastModified: policyDate, changeFrequency: "monthly", priority: 0.4 },
    { url: `${CANONICAL_BASE_URL}/refund`, lastModified: policyDate, changeFrequency: "monthly", priority: 0.4 },
  ];

  // 24 Programmatic Grand Prix race pages
  const raceRoutes: MetadataRoute.Sitemap = GRAND_PRIX_LIST.map((gp) => ({
    url: `${CANONICAL_BASE_URL}/races/${gp.round}`,
    lastModified: lastSyncDate,
    changeFrequency: gp.status === "completed" ? "monthly" : "weekly",
    priority: 0.8,
  }));

  // 24 Programmatic Circuit telemetry pages
  const circuitRoutes: MetadataRoute.Sitemap = GRAND_PRIX_LIST.map((gp) => ({
    url: `${CANONICAL_BASE_URL}/circuits/${gp.id}`,
    lastModified: lastSyncDate,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  // 20 Programmatic Driver profile pages
  const driverRoutes: MetadataRoute.Sitemap = PRO_DRIVERS.map((d) => ({
    url: `${CANONICAL_BASE_URL}/drivers/${d.id}`,
    lastModified: lastSyncDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Technical Explainer Guides
  const guideRoutes: MetadataRoute.Sitemap = GUIDES_LIST.map((slug) => ({
    url: `${CANONICAL_BASE_URL}/guides/${slug}`,
    lastModified: lastSyncDate,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...coreRoutes, ...raceRoutes, ...circuitRoutes, ...driverRoutes, ...guideRoutes];
}
