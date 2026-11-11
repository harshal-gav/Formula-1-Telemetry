import { ImageResponse } from "next/og";
import { GRAND_PRIX_LIST } from "@/lib/grand-prix";

export const runtime = "nodejs";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ round: string }>;
}) {
  const { round } = await params;
  const normalized = decodeURIComponent(round).toLowerCase().trim();
  const gp = GRAND_PRIX_LIST.find(
    (g) =>
      g.round.toString() === normalized ||
      g.id.toLowerCase() === normalized ||
      g.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === normalized
  ) || GRAND_PRIX_LIST[0];

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
          background: "linear-gradient(135deg, #090A0F 0%, #141724 50%, #06070A 100%)",
          color: "#FFFFFF",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          border: "8px solid #1E2230",
        }}
      >
        {/* Glow red light */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-80px",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(225, 6, 0, 0.35) 0%, rgba(225, 6, 0, 0) 70%)",
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
                background: "linear-gradient(135deg, #E10600, #990000)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 20px rgba(225, 6, 0, 0.5)",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
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
              background: "rgba(225, 6, 0, 0.2)",
              border: "1px solid rgba(225, 6, 0, 0.6)",
              color: "#FF5E57",
              fontSize: "14px",
              fontWeight: 800,
              fontFamily: "monospace",
            }}
          >
            ROUND {gp.round} OF 24
          </div>
        </div>

        {/* Middle Main Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
          <span
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#38BDF8",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontFamily: "monospace",
            }}
          >
            {gp.country} • {gp.circuitName}
          </span>
          <h1
            style={{
              fontSize: "56px",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
              margin: 0,
            }}
          >
            {gp.name}
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
            Circuit telemetry benchmarks: {gp.lapDistanceMeters.toLocaleString()}m track length, {gp.turns} turns, and speed trap peaks of {gp.topSpeedTrapKmH} km/h.
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
              <span style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", fontFamily: "monospace" }}>Speed Trap</span>
              <span style={{ fontSize: "18px", fontWeight: 800, color: "#F59E0B", fontFamily: "monospace" }}>{gp.topSpeedTrapKmH} km/h</span>
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
              <span style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", fontFamily: "monospace" }}>Full Throttle</span>
              <span style={{ fontSize: "18px", fontWeight: 800, color: "#EF4444", fontFamily: "monospace" }}>{gp.fullThrottlePercent}%</span>
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
              <span style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", fontFamily: "monospace" }}>DRS Zones</span>
              <span style={{ fontSize: "18px", fontWeight: 800, color: "#38BDF8", fontFamily: "monospace" }}>{gp.drsZones} Zones</span>
            </div>
          </div>

          <div style={{ fontSize: "13px", fontFamily: "monospace", color: "#64748B" }}>
            formula1telemetry.com/races/{gp.round}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

