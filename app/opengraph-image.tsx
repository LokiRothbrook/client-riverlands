import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Riverlands - Discover the Heart of Illinois";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1B4965",
          color: "#FFFFFF",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Decorative wave lines */}
        <svg
          width="400"
          height="60"
          viewBox="0 0 400 60"
          style={{ marginBottom: 24, opacity: 0.3 }}
        >
          <path
            d="M0 25 C50 10, 100 40, 150 25 S250 10, 300 25 S400 40, 450 25"
            stroke="white"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M0 40 C50 25, 100 55, 150 40 S250 25, 300 40 S400 55, 450 40"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
        </svg>

        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          Riverlands
        </div>

        <div
          style={{
            fontSize: 28,
            marginTop: 16,
            color: "#C6923A",
            fontWeight: 600,
          }}
        >
          Discover the Heart of Illinois
        </div>

        <div
          style={{
            fontSize: 18,
            marginTop: 24,
            opacity: 0.7,
            maxWidth: 600,
            textAlign: "center" as const,
            lineHeight: 1.5,
          }}
        >
          History, culture, and natural beauty across seven river counties
        </div>
      </div>
    ),
    { ...size }
  );
}
