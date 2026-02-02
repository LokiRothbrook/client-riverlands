import Link from "next/link";
import { getAffiliateLinks } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";

export async function AffiliateSidebar({
  countyName,
  countySeat,
}: {
  countyName: string;
  countySeat: string;
}) {
  const links = await getAffiliateLinks();

  if (links.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-5 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Planning a visit to {countySeat}?
          </p>
          <Button asChild variant="outline" size="sm" className="mt-3">
            <Link href="/advertise">Find Hotels & Lodging</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-sm font-medium text-foreground">
          Planning a visit to {countyName}?
        </p>
        <ul className="mt-3 space-y-2">
          {links.map((link) => (
            <li key={link.type}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <HugeiconsIcon
                  icon={ArrowRight02Icon}
                  size={12}
                  className="text-primary"
                />
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
