"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function NewsletterCta() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Failed to subscribe");
        return;
      }

      toast.success(result.message);
      setEmail("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-river-blue px-6 py-12 sm:px-12 sm:py-16">
          {/* Decorative river lines */}
          <svg
            className="absolute inset-0 h-full w-full opacity-5"
            preserveAspectRatio="none"
            viewBox="0 0 800 400"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M0 200 C80 170, 160 230, 240 200 S400 170, 480 200 S640 230, 720 200 S800 170, 880 200"
              stroke="white"
              strokeWidth="3"
            />
            <path
              d="M0 230 C80 200, 160 260, 240 230 S400 200, 480 230 S640 260, 720 230 S800 200, 880 230"
              stroke="white"
              strokeWidth="2"
            />
          </svg>

          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Stay in the Loop
            </h2>
            <p className="mt-4 text-lg text-white/80">
              Get the latest events, stories, and travel tips from across the
              river counties delivered straight to your inbox. Choose which
              counties you want to hear about.
            </p>
            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full max-w-sm rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/50 sm:w-auto sm:min-w-[300px]"
              />
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full bg-amber text-river-blue-dark hover:bg-amber-light sm:w-auto"
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
            <p className="mt-4 text-xs text-white/50">
              No spam, ever. Unsubscribe anytime.{" "}
              <Link
                href="/privacy"
                className="underline hover:text-white/70"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
