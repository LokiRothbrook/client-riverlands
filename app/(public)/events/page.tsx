import type { Metadata } from "next";
import { Suspense } from "react";
import { EventsFilter } from "@/components/events/events-filter";
import { Breadcrumb } from "@/components/breadcrumb";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema } from "@/lib/structured-data";
import { getPublishedEvents } from "@/lib/queries";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://riverlands.org";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Discover upcoming events across the seven river counties of western Illinois. Festivals, tours, cultural events, and outdoor activities.",
};

export default async function EventsPage() {
  const events = await getPublishedEvents();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Events", url: `${SITE_URL}/events` },
        ])}
      />

      {/* Hero */}
      <section className="bg-river-blue py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Events Calendar
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Festivals, heritage tours, cultural events, and outdoor activities
            happening across the river counties.
          </p>
        </div>
      </section>

      <div className="border-b bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Events" }]} />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Suspense>
          <EventsFilter events={events} />
        </Suspense>
      </div>
    </>
  );
}
