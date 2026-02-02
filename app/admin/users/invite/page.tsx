import { requireRole } from "@/lib/auth";
import { InviteForm } from "@/components/admin/users/invite-form";

export default async function InviteUserPage() {
  await requireRole(["admin"]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Invite User</h2>
      <InviteForm />
    </div>
  );
}
