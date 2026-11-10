import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const alt = "Formula 1 Telemetry | Grand Prix Analytics & Telemetry Comparison";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
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
          background: "linear-gradient(135deg, #090A0F 0%, #11141E 50%, #06070A 100%)",
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
            background: "radial-gradient(circle, rgba(225, 6, 0, 0.3) 0%, rgba(225, 6, 0, 0) 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Glow cyan light */}
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "100px",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(0, 210, 190, 0.2) 0%, rgba(0, 210, 190, 0) 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Top Header: Brand & Badge */}
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
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #E10600, #990000)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 24px rgba(225, 6, 0, 0.5)",
              }}
            >
              <svg
                width="28"
                height="28"
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
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: 900,
                  letterSpacing: "0.08em",
                  color: "#FFFFFF",
                }}
              >
                FORMULA 1 <span style={{ color: "#E10600" }}>TELEMETRY</span>
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  color: "#8E9BB0",
                  textTransform: "uppercase",
                }}
              >
                The Pitwall In Your Browser
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              borderRadius: "999px",
              background: "rgba(225, 6, 0, 0.15)",
              border: "1px solid rgba(225, 6, 0, 0.5)",
              color: "#FF5E57",
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "0.1em",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#E10600",
              }}
            />
            2026 LIVE PADDOCK SUITE
          </div>
        </div>

        {/* Center: Main Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "20px" }}>
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
            High-Resolution Car Telemetry & Race Strategy Analytics
          </h1>
          <p
            style={{
              fontSize: "22px",
              color: "#94A3B8",
              margin: 0,
              lineHeight: 1.4,
              maxWidth: "950px",
            }}
          >
            Overlay speed, throttle, and brake traces between any two drivers. Simulate tyre degradation curves and scrub through interactive session replays.
          </p>
        </div>

        {/* Bottom Feature Badges & Feeds */}
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
          <div style={{ display: "flex", gap: "14px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "8px",
                background: "#131722",
                border: "1px solid #2A3042",
                fontSize: "14px",
                fontWeight: 700,
                color: "#E2E8F0",
              }}
            >
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#FF8000" }} />
              Telemetry Overlays
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "8px",
                background: "#131722",
                border: "1px solid #2A3042",
                fontSize: "14px",
                fontWeight: 700,
                color: "#E2E8F0",
              }}
            >
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#E80020" }} />
              Tyre Stint Simulator
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "8px",
                background: "#131722",
                border: "1px solid #2A3042",
                fontSize: "14px",
                fontWeight: 700,
                color: "#E2E8F0",
              }}
            >
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#27F4D2" }} />
              Session Replay Tower
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "13px",
              fontFamily: "monospace",
              color: "#64748B",
            }}
          >
            <span>formula1telemetry.com</span>
            <span>•</span>
            <span style={{ color: "#10B981" }}>Live Telemetry Feeds</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

