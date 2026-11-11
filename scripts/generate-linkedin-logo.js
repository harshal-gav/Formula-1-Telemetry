const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// 1. Standalone Iconic Profile Logo (1024x1024) - Perfect for LinkedIn Page / Profile Avatar
// Designed to look stunning in both square (feed) and circular (company page header) crops.
const profileLogoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <!-- Background Gradient -->
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="65%">
      <stop offset="0%" stop-color="#181c28"/>
      <stop offset="60%" stop-color="#0a0c12"/>
      <stop offset="100%" stop-color="#040507"/>
    </radialGradient>

    <!-- Racing Red Gradient -->
    <linearGradient id="racingRed" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF2A1A"/>
      <stop offset="50%" stop-color="#E10600"/>
      <stop offset="100%" stop-color="#9B0000"/>
    </linearGradient>

    <!-- Telemetry Trace Gradient (Red/Amber) -->
    <linearGradient id="traceRed" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FF5500"/>
      <stop offset="45%" stop-color="#E10600"/>
      <stop offset="100%" stop-color="#FF003C"/>
    </linearGradient>

    <!-- Comparison Trace Gradient (Cyan) -->
    <linearGradient id="traceCyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00E5FF"/>
      <stop offset="100%" stop-color="#00A3FF"/>
    </linearGradient>

    <!-- Glassmorphism Shield Gradient -->
    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E2333" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#0E111A" stop-opacity="0.95"/>
    </linearGradient>

    <!-- Glow Filters -->
    <filter id="strongGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="16" result="blur1"/>
      <feGaussianBlur stdDeviation="32" result="blur2"/>
      <feMerge>
        <feMergeNode in="blur2"/>
        <feMergeNode in="blur1"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="redHalo" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="24" result="blur"/>
      <feComponentTransfer in="blur" result="boost">
        <feFuncA type="linear" slope="1.5"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode in="boost"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- Carbon Pattern -->
    <pattern id="carbonGrid" width="16" height="16" patternUnits="userSpaceOnUse">
      <rect width="16" height="16" fill="none"/>
      <circle cx="8" cy="8" r="1.5" fill="#FFFFFF" fill-opacity="0.04"/>
      <circle cx="0" cy="0" r="1.5" fill="#FFFFFF" fill-opacity="0.02"/>
      <circle cx="16" cy="16" r="1.5" fill="#FFFFFF" fill-opacity="0.02"/>
    </pattern>
  </defs>

  <!-- Deep Canvas Background -->
  <rect width="1024" height="1024" fill="url(#bgGlow)"/>
  <rect width="1024" height="1024" fill="url(#carbonGrid)"/>

  <!-- Subtle Radial Ambient Lighting behind Shield -->
  <circle cx="512" cy="512" r="380" fill="#E10600" fill-opacity="0.12" filter="url(#redHalo)"/>

  <!-- Subtle Circular Ring (Safe Area Accent) -->
  <circle cx="512" cy="512" r="430" fill="none" stroke="#252A3D" stroke-width="2" stroke-dasharray="8 12" stroke-opacity="0.6"/>

  <!-- Telemetry Coordinates Crosshair Overlay -->
  <line x1="512" y1="120" x2="512" y2="904" stroke="#1D2335" stroke-width="1.5" stroke-dasharray="4 6"/>
  <line x1="120" y1="512" x2="904" y2="512" stroke="#1D2335" stroke-width="1.5" stroke-dasharray="4 6"/>

  <!-- Grid Data Ticks -->
  <line x1="280" y1="240" x2="744" y2="240" stroke="#181D2C" stroke-width="1" stroke-dasharray="3 5"/>
  <line x1="280" y1="784" x2="744" y2="784" stroke="#181D2C" stroke-width="1" stroke-dasharray="3 5"/>
  <line x1="280" y1="240" x2="280" y2="784" stroke="#181D2C" stroke-width="1" stroke-dasharray="3 5"/>
  <line x1="744" y1="240" x2="744" y2="784" stroke="#181D2C" stroke-width="1" stroke-dasharray="3 5"/>

  <!-- CENTRAL EMBLEM: Sleek Aerodynamic Carbon Monocoque Shield -->
  <g transform="translate(0, -20)">
    <!-- Shield Drop Shadow -->
    <rect x="236" y="216" width="552" height="552" rx="128" fill="#000000" fill-opacity="0.6" filter="url(#strongGlow)"/>

    <!-- Shield Border Glow -->
    <rect x="236" y="216" width="552" height="552" rx="128" fill="none" stroke="#E10600" stroke-width="4" stroke-opacity="0.4" filter="url(#redHalo)"/>

    <!-- Main Shield Body -->
    <rect x="240" y="220" width="544" height="544" rx="124" fill="url(#shieldGrad)" stroke="#384058" stroke-width="2.5"/>

    <!-- Red Racing Corner Flash -->
    <path d="M 660 220 L 754 220 C 770 220 784 234 784 250 L 784 344 Z" fill="url(#racingRed)"/>

    <!-- Inner Shield Telemetry Grid -->
    <line x1="280" y1="360" x2="744" y2="360" stroke="#252D42" stroke-width="1.5" stroke-dasharray="4 4"/>
    <line x1="280" y1="492" x2="744" y2="492" stroke="#252D42" stroke-width="1.5" stroke-dasharray="4 4"/>
    <line x1="280" y1="624" x2="744" y2="624" stroke="#252D42" stroke-width="1.5" stroke-dasharray="4 4"/>
    <line x1="412" y1="260" x2="412" y2="724" stroke="#252D42" stroke-width="1.5" stroke-dasharray="4 4"/>
    <line x1="612" y1="260" x2="612" y2="724" stroke="#252D42" stroke-width="1.5" stroke-dasharray="4 4"/>

    <!-- SECONDARY TELEMETRY TRACE: Electric Cyan Comparison Curve -->
    <path d="M 300 640 Q 360 620, 410 650 T 510 440 T 610 380 T 724 330"
          fill="none"
          stroke="url(#traceCyan)"
          stroke-width="8"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-opacity="0.45"/>

    <!-- Cyan Apex Comparison Marker -->
    <circle cx="410" cy="650" r="9" fill="#00E5FF" fill-opacity="0.6"/>

    <!-- PRIMARY TELEMETRY TRACE: Glowing Racing Red Velocity Curve -->
    <path d="M 300 620 Q 360 590, 420 630 T 520 370 T 630 330 T 724 290"
          fill="none"
          stroke="url(#traceRed)"
          stroke-width="18"
          stroke-linecap="round"
          stroke-linejoin="round"
          filter="url(#strongGlow)"/>

    <!-- Solid Core for Primary Trace -->
    <path d="M 300 620 Q 360 590, 420 630 T 520 370 T 630 330 T 724 290"
          fill="none"
          stroke="#FFFFFF"
          stroke-width="6"
          stroke-linecap="round"
          stroke-linejoin="round"/>

    <!-- Peak Velocity Pulse Node (White-hot energy apex) -->
    <circle cx="630" cy="330" r="26" fill="#E10600" fill-opacity="0.5" filter="url(#strongGlow)"/>
    <circle cx="630" cy="330" r="16" fill="#FFFFFF" filter="url(#strongGlow)"/>
    <circle cx="630" cy="330" r="9" fill="#FF1801"/>

    <!-- Braking Apex Marker -->
    <circle cx="420" cy="630" r="14" fill="#FF7A00" fill-opacity="0.8"/>
    <circle cx="420" cy="630" r="7" fill="#FFFFFF"/>

    <!-- High-Tech Target HUD Crosshairs at Peak -->
    <line x1="630" y1="286" x2="630" y2="374" stroke="#FFFFFF" stroke-width="2" stroke-opacity="0.8"/>
    <line x1="586" y1="330" x2="674" y2="330" stroke="#FFFFFF" stroke-width="2" stroke-opacity="0.8"/>
  </g>

  <!-- TYPOGRAPHIC LOCKUP (Center-Weighted for LinkedIn) -->
  <g transform="translate(512, 850)" text-anchor="middle">
    <!-- "FORMULA 1" -->
    <text font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif"
          font-size="52"
          font-weight="900"
          letter-spacing="6"
          fill="#FFFFFF">
      FORMULA 1
    </text>

    <!-- "TELEMETRY" -->
    <text y="58"
          font-family="'SF Mono', 'Roboto Mono', Menlo, Consolas, monospace"
          font-size="34"
          font-weight="800"
          letter-spacing="14"
          fill="#E10600">
      TELEMETRY
    </text>
  </g>
</svg>
`;

async function generateLogos() {
  const publicDir = path.join(__dirname, "..", "public");

  // Save SVG source
  const svgPath = path.join(publicDir, "linkedin-logo.svg");
  fs.writeFileSync(svgPath, profileLogoSvg.trim());
  console.log("Saved SVG:", svgPath);

  // Render 1024x1024 High-Res PNG (LinkedIn Recommended)
  const pngPath = path.join(publicDir, "linkedin-logo.png");
  await sharp(Buffer.from(profileLogoSvg))
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(pngPath);
  console.log("Generated 1024x1024 PNG:", pngPath);

  // Render 400x400 PNG (Standard LinkedIn Upload Size)
  const png400Path = path.join(publicDir, "linkedin-logo-400.png");
  await sharp(Buffer.from(profileLogoSvg))
    .resize(400, 400)
    .png({ quality: 100 })
    .toFile(png400Path);
  console.log("Generated 400x400 PNG:", png400Path);

  // Render 300x300 PNG (Alternative LinkedIn Company Logo Specification)
  const png300Path = path.join(publicDir, "linkedin-logo-300.png");
  await sharp(Buffer.from(profileLogoSvg))
    .resize(300, 300)
    .png({ quality: 100 })
    .toFile(png300Path);
  console.log("Generated 300x300 PNG:", png300Path);
}

generateLogos().catch(console.error);
