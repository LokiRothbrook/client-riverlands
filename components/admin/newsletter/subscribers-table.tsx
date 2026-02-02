"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Subscriber {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  counties_subscribed: string[];
  verified: boolean;
  created_at: string;
}

export function SubscribersTable({
  subscribers,
}: {
  subscribers: Subscriber[];
}) {
  async function handleExport() {
    window.open("/api/admin/newsletter/export", "_blank");
  }

  return (
    <Card>
      <div className="flex items-center justify-between border-b p-4">
        <p className="text-sm text-muted-foreground">
          {subscribers.length} total subscribers
        </p>
        <Button variant="outline" size="sm" onClick={handleExport}>
          Export CSV
        </Button>
      </div>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Counties</th>
                <th className="p-4 font-medium">Verified</th>
                <th className="p-4 font-medium">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No subscribers yet.
                  </td>
                </tr>
              ) : (
                subscribers.map((sub) => (
                  <tr key={sub.id} className="border-b last:border-0">
                    <td className="p-4">{sub.email}</td>
                    <td className="p-4 text-muted-foreground">
                      {[sub.first_name, sub.last_name]
                        .filter(Boolean)
                        .join(" ") || "-"}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {sub.counties_subscribed.length > 0
                        ? sub.counties_subscribed.join(", ")
                        : "All"}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={sub.verified ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {sub.verified ? "Yes" : "No"}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(sub.created_at).toLocaleDateString()}
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
