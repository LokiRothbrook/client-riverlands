import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

/**
 * Rate limiter instance - only created if Upstash credentials are configured.
 * Uses sliding window algorithm with 10 requests per 10 seconds default.
 */
let ratelimit: Ratelimit | null = null;

function getRateLimiter(): Ratelimit | null {
  if (ratelimit) return ratelimit;

  // Skip rate limiting if not configured (development)
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }

  ratelimit = new Ratelimit({
    redis: new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    }),
    limiter: Ratelimit.slidingWindow(10, "10 s"),
    analytics: true,
    prefix: "riverlands_ratelimit",
  });

  return ratelimit;
}

/**
 * Check rate limit for a given identifier (usually IP address).
 * Returns null if allowed, or a NextResponse with 429 status if rate limited.
 *
 * @param identifier - Unique identifier for the client (IP address, user ID, etc.)
 * @param customLimit - Optional custom rate limit (requests per window)
 */
export async function checkRateLimit(
  identifier: string,
  customLimit?: { requests: number; window: string }
): Promise<NextResponse | null> {
  const limiter = getRateLimiter();

  // Skip rate limiting if not configured
  if (!limiter) {
    return null;
  }

  // Use custom limiter if provided
  let result;
  if (customLimit) {
    const customRatelimit = new Ratelimit({
      redis: new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      }),
      limiter: Ratelimit.slidingWindow(
        customLimit.requests,
        customLimit.window as Parameters<typeof Ratelimit.slidingWindow>[1]
      ),
      prefix: "riverlands_ratelimit_custom",
    });
    result = await customRatelimit.limit(identifier);
  } else {
    result = await limiter.limit(identifier);
  }

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Too many requests. Please try again later.",
        retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(result.limit),
          "X-RateLimit-Remaining": String(result.remaining),
          "X-RateLimit-Reset": String(result.reset),
          "Retry-After": String(Math.ceil((result.reset - Date.now()) / 1000)),
        },
      }
    );
  }

  return null;
}

/**
 * Get client IP address from request headers.
 * Works with Vercel, Cloudflare, and other proxies.
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback for development
  return "127.0.0.1";
}
