import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { Store01Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons";

const placeholderPartners = [
  {
    name: "Wittmond Hotel & Restaurant",
    category: "Lodging & Dining",
    county: "Calhoun County",
    description:
      "Serving guests for over five generations in the heart of Brussels, overlooking the scenic countryside.",
  },
  {
    name: "Heartland Lodge",
    category: "Lodging & Recreation",
    county: "Pike County",
    description:
      "Premier hunting lodge offering horseback riding, fishing, ATV trails, and UTV rentals.",
  },
  {
    name: "Villa Kathrine Visitor Center",
    category: "Tourism",
    county: "Adams County",
    description:
      "Mediterranean-style landmark on the Mississippi bluffs housing Quincy's Tourist Information Center.",
  },
  {
    name: "Golden Windmill Museum",
    category: "Museum",
    county: "Adams County",
    description:
      "The only smock mill with original stones and gears, now a museum and gift shop.",
  },
];

export function FeaturedPartners() {
  return (
    <section className="bg-secondary/50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Featured Partners
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Local businesses and attractions worth visiting
            </p>
          </div>
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link href="/partners">View all partners</Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {placeholderPartners.map((partner) => (
            <Card
              key={partner.name}
              className="group transition-shadow hover:shadow-md"
            >
              <CardContent className="p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber/10">
                  <HugeiconsIcon
                    icon={Store01Icon}
                    size={24}
                    className="text-amber"
                  />
                </div>
                <h3 className="mt-3 font-semibold text-foreground group-hover:text-primary">
                  {partner.name}
                </h3>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {partner.category}
                  </Badge>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {partner.description}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {partner.county}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">
            Own a local business?{" "}
            <Link
              href="/partners/apply"
              className="font-medium text-primary hover:text-primary/80"
            >
              Become a featured partner
              <HugeiconsIcon
                icon={ArrowRight02Icon}
                size={12}
                className="ml-1 inline"
              />
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
