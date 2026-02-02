"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ActiveAd } from "@/lib/queries";
import { cn } from "@/lib/utils";

interface AdBannerProps {
  ads: ActiveAd[];
  zone: string;
  className?: string;
}

export function AdBanner({ ads, zone, className }: AdBannerProps) {
  const [ad] = useState<ActiveAd | null>(() =>
    ads.length > 0 ? ads[Math.floor(Math.random() * ads.length)] : null
  );
  const impressionTracked = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const trackEvent = useCallback(
    (type: "impression" | "click") => {
      if (!ad) return;
      fetch("/api/ads/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adId: ad.id, type }),
      }).catch(() => {});
    },
    [ad]
  );

  useEffect(() => {
    if (!ad || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !impressionTracked.current) {
          impressionTracked.current = true;
          trackEvent("impression");
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [ad, trackEvent]);

  if (!ad) return null;

  return (
    <div
      ref={containerRef}
      className={cn("flex flex-col items-center", className)}
      data-ad-zone={zone}
    >
      <a
        href={ad.linkUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={() => trackEvent("click")}
        className="overflow-hidden rounded-lg transition-opacity hover:opacity-90"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ad.imageUrl}
          alt={ad.businessName}
          className="max-w-full"
        />
      </a>
      <span className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        Sponsored
      </span>
    </div>
  );
}
