import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/admin/dashboard/stat-card";
import { RecentActivity } from "@/components/admin/dashboard/recent-activity";
import {
  News01Icon,
  Calendar03Icon,
  Store01Icon,
  Mail01Icon,
  CheckListIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";

async function getDashboardStats() {
  const supabase = await createClient();

  const [posts, events, partners, subscribers, requests, messages] =
    await Promise.all([
      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("status", "published"),
      supabase
        .from("events")
        .select("id", { count: "exact", head: true })
        .eq("status", "published"),
      supabase
        .from("partners")
        .select("id", { count: "exact", head: true })
        .eq("status", "active"),
      supabase
        .from("newsletter_subscribers")
        .select("id", { count: "exact", head: true })
        .eq("verified", true),
      supabase
        .from("partner_requests")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("contact_messages")
        .select("id", { count: "exact", head: true })
        .eq("read", false),
    ]);

  return {
    publishedPosts: posts.count ?? 0,
    publishedEvents: events.count ?? 0,
    activePartners: partners.count ?? 0,
    verifiedSubscribers: subscribers.count ?? 0,
    pendingRequests: requests.count ?? 0,
    unreadMessages: messages.count ?? 0,
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Welcome back</h2>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening across Riverlands.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={News01Icon}
          label="Published Posts"
          value={stats.publishedPosts}
        />
        <StatCard
          icon={Calendar03Icon}
          label="Published Events"
          value={stats.publishedEvents}
        />
        <StatCard
          icon={Store01Icon}
          label="Active Partners"
          value={stats.activePartners}
        />
        <StatCard
          icon={Mail01Icon}
          label="Verified Subscribers"
          value={stats.verifiedSubscribers}
        />
        <StatCard
          icon={CheckListIcon}
          label="Pending Requests"
          value={stats.pendingRequests}
          highlight={stats.pendingRequests > 0}
        />
        <StatCard
          icon={UserIcon}
          label="Unread Messages"
          value={stats.unreadMessages}
          highlight={stats.unreadMessages > 0}
        />
      </div>

      <RecentActivity />
    </div>
  );
}
