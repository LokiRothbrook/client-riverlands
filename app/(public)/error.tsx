"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PublicError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-4 py-24 sm:py-32">
      <h1 className="text-4xl font-bold text-primary sm:text-5xl">
        Something went wrong
      </h1>
      <p className="mx-auto mt-4 max-w-md text-center text-muted-foreground">
        We ran into an unexpected error. Please try again, and if the problem
        persists, contact us.
      </p>
      <div className="mt-8 flex gap-3">
        <Button onClick={reset} size="lg">
          Try Again
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </section>
  );
}
