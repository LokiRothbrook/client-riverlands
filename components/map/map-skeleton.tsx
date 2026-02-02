import { HugeiconsIcon } from "@hugeicons/react";
import { Location01Icon } from "@hugeicons/core-free-icons";

export function MapSkeleton() {
  return (
    <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-sage/10 via-river-blue/5 to-amber/5">
      <div className="text-center">
        <HugeiconsIcon
          icon={Location01Icon}
          size={48}
          className="mx-auto animate-pulse text-primary/30"
        />
        <p className="mt-4 text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
  );
}
