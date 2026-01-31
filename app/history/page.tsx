import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "History & Heritage",
  description:
    "Explore the rich history of western Illinois — from Abraham Lincoln's law practice to the Underground Railroad, Native American heritage, and frontier pioneers.",
};

const timelineEntries = [
  {
    era: "Pre-1800s",
    title: "Native American Heritage",
    description:
      "The river counties were home to Native American communities for thousands of years. Indian Mounds Park in Adams County preserves mounds that tell the story of these early inhabitants. The Kamp Mound Site in Calhoun County is listed on the National Register of Historic Places.",
    county: "Adams & Calhoun",
  },
  {
    era: "1820s",
    title: "Pioneer Settlement",
    description:
      "Euro-American settlers began arriving in the 1820s. Pike County was established in 1821, named for explorer Zebulon Pike. Schuyler County organized in 1825, and Rushville was settled by Calvin Hobart in 1823. These early pioneers carved communities out of the Illinois frontier.",
    county: "Pike, Schuyler",
  },
  {
    era: "1830s",
    title: "Lincoln's Western Illinois",
    description:
      "Abraham Lincoln's law practice brought him frequently to Pike County, where nearly 550 legal cases bear his name. His secretaries John Hay and John George Nicolay had Pittsfield roots. Stephen A. Douglas taught school in Winchester in 1833 before teaching himself law.",
    county: "Pike, Scott",
  },
  {
    era: "1836",
    title: "New Philadelphia Founded",
    description:
      "'Free' Frank McWorter platted New Philadelphia in Pike County — the first town in the United States legally registered by an African American. McWorter used proceeds from lot sales to purchase his family's freedom from slavery. The site became a National Historic Landmark in 2008.",
    county: "Pike",
  },
  {
    era: "1840s",
    title: "Underground Railroad",
    description:
      "Quincy became known as the 'City of Refuge' for its role in the Underground Railroad. The Dr. Richard Eells House helped hundreds of slaves escape to freedom. In Morgan County, Woodlawn Farm and Beecher Hall at Illinois College served as crucial stops. The Asa Talcott home in Jacksonville is now the African American History Museum.",
    county: "Adams, Morgan",
  },
  {
    era: "1858",
    title: "Lincoln-Douglas Debates",
    description:
      "On October 13, 1858, Washington Park in Quincy hosted the sixth of the famous Lincoln-Douglas debates before an estimated crowd of over 15,000 people. This pivotal moment in American political history played out in the heart of Adams County.",
    county: "Adams",
  },
  {
    era: "1870s-1890s",
    title: "Growth and Architecture",
    description:
      "The region saw remarkable growth. Brown County's fair began in 1872. Pike County's stunning courthouse was built in 1894 in Cleveland sandstone with an octagonal dome. Schuyler County's striking jail was constructed in 1882. Many buildings from this era still stand in historic districts across the counties.",
    county: "All Counties",
  },
  {
    era: "1900",
    title: "The Big Eli Wheel",
    description:
      "Inspired by the 1893 Chicago World's Fair Ferris wheel, W.E. Sullivan built the first portable Ferris wheel — the 'Big Eli' Wheel — which debuted in Jacksonville's Central Park. It still gives free rides today, a living connection to the spirit of American invention.",
    county: "Morgan",
  },
  {
    era: "1930",
    title: "Joe Page Bridge",
    description:
      "The Joe Page Bridge was built as the only bridge access to Calhoun County, spanning the Illinois River with one of the largest lift spans in the world at 308 feet 9 inches. Dedicated in 1931, it remains an engineering marvel.",
    county: "Calhoun",
  },
  {
    era: "Present",
    title: "Preserving Our Heritage",
    description:
      "Today, the river counties maintain dozens of museums, historic districts, and National Register properties. From Quincy's 100+ landmarks and Museum Passport program to the restored Whistle Stop Depot Museum in Mount Sterling, these communities are committed to preserving their stories for future generations.",
    county: "All Counties",
  },
];

export default function HistoryPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-river-blue py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            History &amp; Heritage
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            From Native American mounds to Lincoln&apos;s law practice, the
            Underground Railroad to engineering marvels — the river counties
            hold centuries of American history.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 hidden h-full w-px bg-border sm:block" />

          <div className="space-y-8">
            {timelineEntries.map((entry, i) => (
              <div key={i} className="relative flex gap-6 sm:gap-8">
                {/* Era marker */}
                <div className="relative z-10 flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center rounded-full bg-primary text-center text-primary-foreground">
                  <span className="text-xs font-bold leading-tight">
                    {entry.era}
                  </span>
                </div>

                {/* Content */}
                <Card className="flex-1">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-lg font-bold text-foreground">
                        {entry.title}
                      </h2>
                      <Badge variant="secondary" className="flex-shrink-0 text-xs">
                        {entry.county}
                      </Badge>
                    </div>
                    <p className="mt-2 leading-relaxed text-muted-foreground">
                      {entry.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-foreground">
            Explore County Histories
          </h2>
          <p className="mt-2 text-muted-foreground">
            Each county has its own unique story. Dive deeper into the history
            of a specific county.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {[
              { name: "Adams", slug: "adams" },
              { name: "Pike", slug: "pike" },
              { name: "Brown", slug: "brown" },
              { name: "Schuyler", slug: "schuyler" },
              { name: "Calhoun", slug: "calhoun" },
              { name: "Scott", slug: "scott" },
              { name: "Morgan", slug: "morgan" },
            ].map((county) => (
              <Link key={county.slug} href={`/counties/${county.slug}`}>
                <Badge
                  variant="outline"
                  className="cursor-pointer px-4 py-2 text-sm hover:bg-secondary"
                >
                  {county.name} County
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
