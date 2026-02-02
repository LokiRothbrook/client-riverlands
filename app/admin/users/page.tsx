import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { UsersTable } from "@/components/admin/users/users-table";

export default async function AdminUsersPage() {
  await requireRole(["admin"]);
  const supabase = await createClient();

  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Users</h2>
        <Button asChild>
          <Link href="/admin/users/invite">Invite User</Link>
        </Button>
      </div>
      <UsersTable users={users ?? []} />
    </div>
  );
}
