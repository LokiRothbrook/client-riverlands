import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PageBannerProps {
  children: ReactNode;
  /** "hero" = tall homepage banner; "page" = standard inner-page banner */
  size?: "hero" | "page";
  /** Extra classes on the outer <section> (e.g. custom vertical padding) */
  className?: string;
}

/**
 * Shared blue banner used on every page.
 * Renders animated river wave SVGs as a decorative background.
 * Pure CSS animation — no client JS needed.
 */
export function PageBanner({ children, size = "page", className }: PageBannerProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-gradient-to-b from-river-blue-dark to-river-blue",
        size === "hero" ? "py-24 sm:py-32 lg:py-40" : "py-16 sm:py-20",
        className
      )}
    >
      {/* Animated river waves — 200%-wide SVG scrolls left seamlessly */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <svg
          className="wave-flow absolute inset-0 h-full opacity-10"
          style={{ width: "200%" }}
          viewBox="0 0 2400 600"
          preserveAspectRatio="none"
          fill="none"
        >
          {/*
            Each half (0→1200 and 1200→2400) is one full wave period: an upward
            arch (C) then a downward arch (S). The tangent at x=0, x=1200, and
            x=2400 is identical (3×(220,±50)) so both the mid-join and the
            loop-back are mathematically smooth — no visible seam.
          */}
          <path
            d="M0 300 C220 250,380 250,600 300 S980 350,1200 300 C1420 250,1580 250,1800 300 S2180 350,2400 300"
            stroke="white"
            strokeWidth="3"
          />
          <path
            d="M0 340 C220 290,380 290,600 340 S980 390,1200 340 C1420 290,1580 290,1800 340 S2180 390,2400 340"
            stroke="white"
            strokeWidth="2"
          />
          <path
            d="M0 380 C220 330,380 330,600 380 S980 430,1200 380 C1420 330,1580 330,1800 380 S2180 430,2400 380"
            stroke="white"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Page content sits above the waves */}
      <div className="relative">{children}</div>
    </section>
  );
}
