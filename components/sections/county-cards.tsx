import Link from "next/link";
import { counties } from "@/lib/counties";
import { Card } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";

const countyGradients = [
  "from-river-blue/30 to-river-blue/10",
  "from-amber/30 to-amber/10",
  "from-sage/30 to-sage/10",
  "from-rustic-red/20 to-amber/10",
  "from-river-blue/20 to-sage/10",
  "from-amber/20 to-rustic-red/10",
  "from-sage/20 to-river-blue/10",
];

export function CountyCards() {
  return (
    <section className="bg-secondary/50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Explore Our Counties
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-lg text-muted-foreground">
            Seven counties, countless stories. Each with its own character,
            history, and hidden gems waiting to be discovered.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {counties.map((county, i) => (
            <Link key={county.slug} href={`/counties/${county.slug}`}>
              <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5">
                <div
                  className={`aspect-[16/9] bg-gradient-to-br ${countyGradients[i]}`}
                />
                <div className="p-4">
                  <h3 className="font-semibold text-foreground group-hover:text-primary">
                    {county.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    County Seat: {county.seat}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {county.shortDescription}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                    Explore
                    <HugeiconsIcon
                      icon={ArrowRight02Icon}
                      size={12}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
