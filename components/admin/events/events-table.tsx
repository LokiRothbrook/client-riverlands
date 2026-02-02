"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  status: string;
  start_date: string;
  location: string;
  category: string;
  county: { name: string; slug: string } | null;
}

export function EventsTable({ events }: { events: Event[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all" ? events : events.filter((e) => e.status === filter);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this event?")) return;

    const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Event deleted");
      router.refresh();
    } else {
      toast.error("Failed to delete event");
    }
  }

  return (
    <Card>
      <div className="flex gap-2 border-b p-4">
        {["all", "draft", "published", "cancelled"].map((s) => (
          <Badge
            key={s}
            variant={filter === s ? "default" : "outline"}
            className="cursor-pointer capitalize"
            onClick={() => setFilter(s)}
          >
            {s}
          </Badge>
        ))}
      </div>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium">County</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Location</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No events found.
                  </td>
                </tr>
              ) : (
                filtered.map((event) => (
                  <tr key={event.id} className="border-b last:border-0">
                    <td className="p-4 font-medium">{event.title}</td>
                    <td className="p-4 text-muted-foreground">
                      {event.county?.name ?? "-"}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(event.start_date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {event.location}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          event.status === "published" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {event.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/events/${event.id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDelete(event.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
