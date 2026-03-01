"use client";

import { Button } from "@/components/ui/button";

export default function AdminError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold text-destructive">
        Something went wrong
      </h1>
      <p className="max-w-md text-center text-sm text-muted-foreground">
        An error occurred in the admin panel. Please try again or contact the
        system administrator.
      </p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
