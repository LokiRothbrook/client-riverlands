"use client";

import { useState } from "react";
import { toast } from "sonner";

export function FooterNewsletterForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;

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
      form.reset();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
      <input
        type="email"
        name="email"
        placeholder="Your email"
        required
        className="min-w-0 flex-1 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-amber px-4 py-2 text-sm font-medium text-river-blue-dark transition-colors hover:bg-amber-light disabled:opacity-50"
      >
        {loading ? "..." : "Join"}
      </button>
    </form>
  );
}
