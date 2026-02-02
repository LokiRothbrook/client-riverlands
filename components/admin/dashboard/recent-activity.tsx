import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export async function RecentActivity() {
  const supabase = await createClient();

  const { data: recentPosts } = await supabase
    .from("posts")
    .select("id, title, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentEvents } = await supabase
    .from("events")
    .select("id, title, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {recentPosts && recentPosts.length > 0 ? (
            <ul className="space-y-3">
              {recentPosts.map((post) => (
                <li key={post.id} className="flex items-center justify-between">
                  <span className="truncate text-sm">{post.title}</span>
                  <Badge
                    variant={
                      post.status === "published" ? "default" : "secondary"
                    }
                    className="ml-2 text-xs"
                  >
                    {post.status}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No posts yet.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Events</CardTitle>
        </CardHeader>
        <CardContent>
          {recentEvents && recentEvents.length > 0 ? (
            <ul className="space-y-3">
              {recentEvents.map((event) => (
                <li
                  key={event.id}
                  className="flex items-center justify-between"
                >
                  <span className="truncate text-sm">{event.title}</span>
                  <Badge
                    variant={
                      event.status === "published" ? "default" : "secondary"
                    }
                    className="ml-2 text-xs"
                  >
                    {event.status}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No events yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
