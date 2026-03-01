"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldError } from "@/components/admin/field-error";
import { updateUserSchema, validateForm } from "@/lib/validations/admin";
import { counties } from "@/lib/counties";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  assigned_counties: string[];
}

interface EditUserDialogProps {
  user: User;
  onClose: () => void;
}

export function EditUserDialog({ user, onClose }: EditUserDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [role, setRole] = useState(user.role);
  const [assignedCounties, setAssignedCounties] = useState<string[]>(
    user.assigned_counties
  );

  function clearError(field: string) {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function toggleCounty(slug: string) {
    setAssignedCounties((prev) =>
      prev.includes(slug)
        ? prev.filter((c) => c !== slug)
        : [...prev, slug]
    );
    clearError("assignedCounties");
  }

  async function handleSave() {
    const data = { role, assignedCounties };

    const result = validateForm(updateUserSchema, data);
    if (!result.success) {
      setErrors(result.errors);
      return;
    }

    setLoading(true);

    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast.success("User updated");
      router.refresh();
      onClose();
    } else {
      toast.error("Failed to update user");
    }
    setLoading(false);
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">{user.full_name || user.email}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              value={role}
              onValueChange={(val) => {
                setRole(val);
                clearError("assignedCounties");
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {role === "editor" && (
            <div className="space-y-2">
              <Label>Assigned Counties</Label>
              <div className="grid grid-cols-2 gap-2">
                {counties.map((county) => (
                  <label
                    key={county.slug}
                    className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-secondary"
                  >
                    <input
                      type="checkbox"
                      checked={assignedCounties.includes(county.slug)}
                      onChange={() => toggleCounty(county.slug)}
                      className="rounded"
                    />
                    {county.name}
                  </label>
                ))}
              </div>
              <FieldError error={errors.assignedCounties} />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
