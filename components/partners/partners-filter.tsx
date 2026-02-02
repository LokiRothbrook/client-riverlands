"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { counties } from "@/lib/counties";
import { HugeiconsIcon } from "@hugeicons/react";
import { Store01Icon } from "@hugeicons/core-free-icons";
import type { ActivePartner } from "@/lib/queries";

export function PartnersFilter({ partners }: { partners: ActivePartner[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeCounty = searchParams.get("county") || "all";

  function setFilter(county: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (county === "all") {
      params.delete("county");
    } else {
      params.set("county", county);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const filteredPartners =
    activeCounty === "all"
      ? partners
      : partners.filter((p) => p.countySlug === activeCounty);

  return (
    <>
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-bold text-foreground">All Listings</h2>
        <div className="flex flex-wrap gap-2">
          <Badge
            className={`cursor-pointer ${
              activeCounty === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </Badge>
          {counties.map((county) => (
            <Badge
              key={county.slug}
              variant={activeCounty === county.slug ? "default" : "outline"}
              className="cursor-pointer hover:bg-secondary"
              onClick={() => setFilter(county.slug)}
            >
              {county.name.replace(" County", "")}
            </Badge>
          ))}
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPartners.length === 0 ? (
          <p className="col-span-full py-8 text-center text-muted-foreground">
            No partners found for this county.
          </p>
        ) : (
          filteredPartners.map((partner) => (
            <Card
              key={partner.id}
              className="transition-shadow hover:shadow-md"
            >
              <CardContent className="flex gap-4 p-5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-amber/10">
                  <HugeiconsIcon
                    icon={Store01Icon}
                    size={20}
                    className="text-amber"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {partner.name}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {partner.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {partner.countyName}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {partner.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
