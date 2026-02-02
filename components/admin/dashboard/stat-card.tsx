import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";
import type { IconSvgElement } from "@hugeicons/react";

interface StatCardProps {
  icon: IconSvgElement;
  label: string;
  value: number;
  highlight?: boolean;
}

export function StatCard({ icon, label, value, highlight }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-lg",
            highlight ? "bg-rustic-red/10" : "bg-primary/10"
          )}
        >
          <HugeiconsIcon
            icon={icon}
            size={22}
            className={highlight ? "text-rustic-red" : "text-primary"}
          />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
