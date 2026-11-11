import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const BASE_URL = "https://www.formula1telemetry.com";
const TARGETS = [
  { name: "home", path: "/" },
  { name: "races", path: "/races" },
  { name: "drivers", path: "/drivers" },
  { name: "standings", path: "/standings" },
  { name: "pricing", path: "/pricing" },
  { name: "pro", path: "/pro" },
  { name: "race-detail", path: "/races/1" },
  { name: "driver-detail", path: "/drivers/max_verstappen" },
];

const outDir = path.resolve("./audit-reports");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const summary = [];

for (const target of TARGETS) {
  for (const preset of ["mobile", "desktop"]) {
    const outFile = path.join(outDir, `${target.name}-${preset}.json`);
    
    // If already generated and valid, read it
    if (fs.existsSync(outFile)) {
      try {
        const raw = JSON.parse(fs.readFileSync(outFile, "utf8"));
        summary.push({
          target: target.name,
          path: target.path,
          preset,
          perf: Math.round((raw.categories.performance?.score || 0) * 100),
          a11y: Math.round((raw.categories.accessibility?.score || 0) * 100),
          bp: Math.round((raw.categories["best-practices"]?.score || 0) * 100),
          seo: Math.round((raw.categories.seo?.score || 0) * 100),
          lcp: raw.audits["largest-contentful-paint"]?.displayValue || "N/A",
          fcp: raw.audits["first-contentful-paint"]?.displayValue || "N/A",
          cls: raw.audits["cumulative-layout-shift"]?.displayValue || "N/A",
          tbt: raw.audits["total-blocking-time"]?.displayValue || "N/A",
        });
        continue;
      } catch (e) {}
    }

    const url = `${BASE_URL}${target.path}`;
    console.log(`Auditing ${url} (${preset})...`);
    const flags = preset === "desktop"
      ? `--preset=desktop --chrome-flags="--headless" --output=json --output-path="${outFile}" --only-categories=performance,accessibility,best-practices,seo`
      : `--chrome-flags="--headless" --output=json --output-path="${outFile}" --only-categories=performance,accessibility,best-practices,seo`;

    try {
      execSync(`npx lighthouse "${url}" ${flags}`, { stdio: "ignore" });
      const raw = JSON.parse(fs.readFileSync(outFile, "utf8"));
      summary.push({
        target: target.name,
        path: target.path,
        preset,
        perf: Math.round((raw.categories.performance?.score || 0) * 100),
        a11y: Math.round((raw.categories.accessibility?.score || 0) * 100),
        bp: Math.round((raw.categories["best-practices"]?.score || 0) * 100),
        seo: Math.round((raw.categories.seo?.score || 0) * 100),
        lcp: raw.audits["largest-contentful-paint"]?.displayValue || "N/A",
        fcp: raw.audits["first-contentful-paint"]?.displayValue || "N/A",
        cls: raw.audits["cumulative-layout-shift"]?.displayValue || "N/A",
        tbt: raw.audits["total-blocking-time"]?.displayValue || "N/A",
      });
      console.log(`  ✓ ${target.name} [${preset}]: Perf ${summary[summary.length-1].perf}, LCP ${summary[summary.length-1].lcp}, CLS ${summary[summary.length-1].cls}`);
    } catch (err) {
      console.error(`  ✗ Error auditing ${url} (${preset}):`, err.message);
    }
  }
}

fs.writeFileSync("./audit-summary-before.json", JSON.stringify(summary, null, 2));
console.log("\n--- AUDIT SUMMARY BEFORE FIXES ---");
console.table(summary.map(s => ({
  Page: s.path,
  Device: s.preset,
  Perf: s.perf,
  A11y: s.a11y,
  SEO: s.seo,
  LCP: s.lcp,
  CLS: s.cls,
  TBT: s.tbt,
})));
