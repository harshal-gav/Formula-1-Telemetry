import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:3000";
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

const outDir = path.resolve("./audit-reports-after");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const afterSummary = [];

for (const target of TARGETS) {
  for (const preset of ["mobile", "desktop"]) {
    const outFile = path.join(outDir, `${target.name}-${preset}.json`);
    
    // Check if already completed
    if (fs.existsSync(outFile)) {
      try {
        const raw = JSON.parse(fs.readFileSync(outFile, "utf8"));
        afterSummary.push({
          target: target.name,
          path: target.path,
          preset,
          perf: Math.round((raw.categories.performance?.score || 0) * 100),
          a11y: Math.round((raw.categories.accessibility?.score || 0) * 100),
          bp: Math.round((raw.categories["best-practices"]?.score || 0) * 100),
          seo: Math.round((raw.categories.seo?.score || 0) * 100),
          lcp: raw.audits["largest-contentful-paint"]?.displayValue || "N/A",
          fcp: raw.audits["first-contentful-paint"]?.displayValue || "N/A",
          cls: raw.audits["cumulative-layout-shift"]?.displayValue || "0",
          tbt: raw.audits["total-blocking-time"]?.displayValue || "0 ms",
        });
        continue;
      } catch (e) {}
    }

    const url = `${BASE_URL}${target.path}`;
    console.log(`Auditing ${url} (${preset})...`);
    const flags = preset === "desktop"
      ? `--preset=desktop --chrome-flags="--headless --no-sandbox" --output=json --output-path="${outFile}" --only-categories=performance,accessibility,best-practices,seo`
      : `--chrome-flags="--headless --no-sandbox" --output=json --output-path="${outFile}" --only-categories=performance,accessibility,best-practices,seo`;

    try {
      execSync(`npx lighthouse "${url}" ${flags}`, { stdio: "ignore" });
      const raw = JSON.parse(fs.readFileSync(outFile, "utf8"));
      const result = {
        target: target.name,
        path: target.path,
        preset,
        perf: Math.round((raw.categories.performance?.score || 0) * 100),
        a11y: Math.round((raw.categories.accessibility?.score || 0) * 100),
        bp: Math.round((raw.categories["best-practices"]?.score || 0) * 100),
        seo: Math.round((raw.categories.seo?.score || 0) * 100),
        lcp: raw.audits["largest-contentful-paint"]?.displayValue || "N/A",
        fcp: raw.audits["first-contentful-paint"]?.displayValue || "N/A",
        cls: raw.audits["cumulative-layout-shift"]?.displayValue || "0",
        tbt: raw.audits["total-blocking-time"]?.displayValue || "0 ms",
      };
      afterSummary.push(result);
      console.log(`  ✓ ${target.name} [${preset}]: Perf ${result.perf}, LCP ${result.lcp}, CLS ${result.cls}, A11y ${result.a11y}, SEO ${result.seo}`);
    } catch (err) {
      console.error(`  ✗ Error auditing ${url} (${preset}):`, err.message);
    }
  }
}

fs.writeFileSync("./audit-summary-after.json", JSON.stringify(afterSummary, null, 2));

// Compare before and after
let beforeSummary = [];
try {
  beforeSummary = JSON.parse(fs.readFileSync("./audit-summary-before.json", "utf8"));
} catch (e) {}

const comparison = afterSummary.map(after => {
  const before = beforeSummary.find(b => b.path === after.path && b.preset === after.preset) || {};
  return {
    Page: after.path,
    Device: after.preset,
    "Perf (Before -> After)": `${before.perf ?? "N/A"} -> ${after.perf}`,
    "LCP (Before -> After)": `${before.lcp ?? "N/A"} -> ${after.lcp}`,
    "CLS (Before -> After)": `${before.cls ?? "N/A"} -> ${after.cls}`,
    "TBT (Before -> After)": `${before.tbt ?? "N/A"} -> ${after.tbt}`,
    "A11y": `${before.a11y ?? "N/A"} -> ${after.a11y}`,
    "SEO": `${before.seo ?? "N/A"} -> ${after.seo}`,
  };
});

console.log("\n=================== BEFORE VS AFTER COMPARISON ===================");
console.table(comparison);

