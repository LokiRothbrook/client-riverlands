import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  Location01Icon,
  ArrowLeft02Icon,
  Download01Icon,
  Link01Icon,
} from "@hugeicons/core-free-icons";
import { Breadcrumb } from "@/components/breadcrumb";
import { JsonLd } from "@/components/json-ld";
import { eventSchema, breadcrumbSchema } from "@/lib/structured-data";
import { getEventById } from "@/lib/queries";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://riverlands.org";

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    return { title: "Event Not Found" };
  }

  return {
    title: event.title,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      ...(event.featuredImage && { images: [event.featuredImage] }),
    },
  };
}

function formatDate(isoDate: string): string {
  return new Date(isoDate + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatShortDate(isoDate: string): string {
  return new Date(isoDate + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getGoogleCalendarUrl(event: {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string | null;
}): string {
  const start = event.startDate.replace(/-/g, "");
  const end = event.endDate
    ? event.endDate.replace(/-/g, "")
    : // If no end date, set to next day (all-day event)
      new Date(
        new Date(event.startDate + "T00:00:00").getTime() + 86400000
      )
        .toISOString()
        .split("T")[0]
        .replace(/-/g, "");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
    details: event.description,
    location: event.location,
  });

  return `https://www.google.com/calendar/render?${params.toString()}`;
}

function getICalContent(event: {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string | null;
  id: string;
}): string {
  const start = event.startDate.replace(/-/g, "");
  const end = event.endDate
    ? event.endDate.replace(/-/g, "")
    : new Date(
        new Date(event.startDate + "T00:00:00").getTime() + 86400000
      )
        .toISOString()
        .split("T")[0]
        .replace(/-/g, "");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Riverlands//Events//EN",
    "BEGIN:VEVENT",
    `UID:${event.id}@riverlands`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`,
    `LOCATION:${event.location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) notFound();

  const googleCalUrl = getGoogleCalendarUrl(event);
  const icalContent = getICalContent(event);
  const icalDataUri = `data:text/calendar;charset=utf-8,${encodeURIComponent(icalContent)}`;

  return (
    <>
      <JsonLd
        data={eventSchema({
          name: event.title,
          description: event.description,
          startDate: event.startDate,
          endDate: event.endDate || undefined,
          location: event.location,
          url: `${SITE_URL}/events/${event.id}`,
          image: event.featuredImage || undefined,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Events", url: `${SITE_URL}/events` },
          { name: event.title, url: `${SITE_URL}/events/${event.id}` },
        ])}
      />

      {/* Hero */}
      {event.featuredImage ? (
        <section className="relative bg-river-blue py-16 sm:py-20">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${event.featuredImage})` }}
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Badge className="bg-white/20 text-white">{event.category}</Badge>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {event.title}
            </h1>
            <p className="mt-4 text-lg text-white/80">{event.countyName}</p>
          </div>
        </section>
      ) : (
        <section className="bg-river-blue py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Badge className="bg-white/20 text-white">{event.category}</Badge>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {event.title}
            </h1>
            <p className="mt-4 text-lg text-white/80">{event.countyName}</p>
          </div>
        </section>
      )}

      <div className="border-b bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: "Events", href: "/events" },
              { label: event.title },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            <Button asChild variant="ghost" size="sm" className="mb-6">
              <Link href="/events">
                <HugeiconsIcon
                  icon={ArrowLeft02Icon}
                  size={16}
                  className="mr-1"
                />
                Back to Events
              </Link>
            </Button>

            <div className="prose prose-lg max-w-none dark:prose-invert">
              <p className="text-lg text-muted-foreground whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {event.recurring && (
              <div className="mt-6 rounded-lg bg-amber/10 px-4 py-3">
                <p className="text-sm font-medium text-amber">
                  Recurring Event: {event.recurring}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="font-semibold text-foreground">Event Details</h2>

                <div className="flex items-start gap-3">
                  <HugeiconsIcon
                    icon={Calendar03Icon}
                    size={18}
                    className="mt-0.5 text-primary"
                  />
                  <div>
                    <p className="font-medium text-foreground">
                      {formatDate(event.startDate)}
                    </p>
                    {event.endDate && (
                      <p className="text-sm text-muted-foreground">
                        through {formatShortDate(event.endDate)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <HugeiconsIcon
                    icon={Location01Icon}
                    size={18}
                    className="mt-0.5 text-primary"
                  />
                  <div>
                    <p className="font-medium text-foreground">
                      {event.location}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {event.countyName}
                    </p>
                  </div>
                </div>

                {event.externalLink && (
                  <Button asChild className="w-full">
                    <a
                      href={event.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <HugeiconsIcon
                        icon={Link01Icon}
                        size={16}
                        className="mr-1"
                      />
                      Visit Event Website
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-3">
                <h2 className="font-semibold text-foreground">
                  Add to Calendar
                </h2>
                <Button asChild variant="outline" className="w-full">
                  <a
                    href={googleCalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <HugeiconsIcon
                      icon={Calendar03Icon}
                      size={16}
                      className="mr-1"
                    />
                    Google Calendar
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <a href={icalDataUri} download={`${event.title}.ics`}>
                    <HugeiconsIcon
                      icon={Download01Icon}
                      size={16}
                      className="mr-1"
                    />
                    Download .ics File
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
