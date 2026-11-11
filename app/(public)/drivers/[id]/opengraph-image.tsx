import { ImageResponse } from "next/og";
import { PRO_DRIVERS } from "@/lib/drivers";

export const runtime = "nodejs";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const norm = decodeURIComponent(id).toLowerCase().trim();
  const driver = PRO_DRIVERS.find(
    (d) =>
      d.id.toLowerCase() === norm ||
      d.code.toLowerCase() === norm ||
      d.name.toLowerCase().replace(/[^a-z0-9]+/g, "_") === norm ||
      d.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === norm ||
      d.name.toLowerCase().split(" ").pop()?.toLowerCase() === norm
  ) || PRO_DRIVERS[0];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 70px",
          background: "linear-gradient(135deg, #090A0F 0%, #151826 50%, #06070A 100%)",
          color: "#FFFFFF",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          border: "8px solid #1E2230",
        }}
      >
        {/* Glow driver color light */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-80px",
            width: "500px",
            height: "500px",
            background: `radial-gradient(circle, ${driver.teamColor}55 0%, rgba(0, 0, 0, 0) 70%)`,
            borderRadius: "50%",
          }}
        />

        {/* Top Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: driver.teamColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 20px ${driver.teamColor}80`,
              }}
            >
              <span style={{ fontSize: "20px", fontWeight: 900, color: "#FFFFFF", fontFamily: "monospace" }}>
                #{driver.number}
              </span>
            </div>
            <span
              style={{
                fontSize: "24px",
                fontWeight: 900,
                letterSpacing: "0.08em",
                color: "#FFFFFF",
              }}
            >
              FORMULA 1 <span style={{ color: "#E10600" }}>TELEMETRY</span>
            </span>
          </div>

          <div
            style={{
              padding: "8px 18px",
              borderRadius: "999px",
              background: "rgba(245, 158, 11, 0.2)",
              border: "1px solid rgba(245, 158, 11, 0.6)",
              color: "#F59E0B",
              fontSize: "14px",
              fontWeight: 800,
              fontFamily: "monospace",
            }}
          >
            RANK P{driver.championshipRank} ({driver.seasonPoints} PTS)
          </div>
        </div>

        {/* Middle Main Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
          <span
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: driver.teamColor,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontFamily: "monospace",
            }}
          >
            {driver.constructorName} • #{driver.number} {driver.code} • {driver.country}
          </span>
          <h1
            style={{
              fontSize: "58px",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
              margin: 0,
            }}
          >
            {driver.name}
          </h1>
          <p
            style={{
              fontSize: "20px",
              color: "#94A3B8",
              margin: 0,
              lineHeight: 1.4,
              maxWidth: "900px",
            }}
          >
            Telemetry profile benchmarks: pace offset of {driver.speedOffset > 0 ? `+${driver.speedOffset}` : driver.speedOffset} km/h and throttle aggression factor of {driver.throttleAggression}x.
          </p>
        </div>

        {/* Bottom Specs Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "24px",
            borderTop: "1px solid #1F2433",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", gap: "16px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "8px 16px",
                borderRadius: "8px",
                background: "#121622",
                border: "1px solid #242B3D",
              }}
            >
              <span style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", fontFamily: "monospace" }}>Championship Rank</span>
              <span style={{ fontSize: "18px", fontWeight: 800, color: "#F59E0B", fontFamily: "monospace" }}>P{driver.championshipRank} ({driver.seasonPoints} pts)</span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "8px 16px",
                borderRadius: "8px",
                background: "#121622",
                border: "1px solid #242B3D",
              }}
            >
              <span style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", fontFamily: "monospace" }}>Pace Delta Offset</span>
              <span style={{ fontSize: "18px", fontWeight: 800, color: "#38BDF8", fontFamily: "monospace" }}>{driver.speedOffset > 0 ? `+${driver.speedOffset}` : driver.speedOffset} km/h</span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "8px 16px",
                borderRadius: "8px",
                background: "#121622",
                border: "1px solid #242B3D",
              }}
            >
              <span style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", fontFamily: "monospace" }}>Throttle Index</span>
              <span style={{ fontSize: "18px", fontWeight: 800, color: "#EF4444", fontFamily: "monospace" }}>{driver.throttleAggression}x</span>
            </div>
          </div>

          <div style={{ fontSize: "13px", fontFamily: "monospace", color: "#64748B" }}>
            formula1telemetry.com/drivers/{driver.id}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

