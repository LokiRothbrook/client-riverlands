"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { LinkSquare01Icon } from "@hugeicons/core-free-icons";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
  created_at: string;
  county: { name: string; slug: string } | null;
  category: { name: string } | null;
}

export function PostsTable({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all" ? posts : posts.filter((p) => p.status === filter);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Post deleted");
      router.refresh();
    } else {
      toast.error("Failed to delete post");
    }
  }

  return (
    <Card>
      <div className="flex gap-2 border-b p-4">
        {["all", "draft", "published", "archived"].map((s) => (
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
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No posts found.
                  </td>
                </tr>
              ) : (
                filtered.map((post) => (
                  <tr key={post.id} className="border-b last:border-0">
                    <td className="p-4 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="hover:underline"
                        >
                          {post.title}
                        </Link>
                        {post.status === "published" && post.county?.slug && (
                          <a
                            href={`/counties/${post.county.slug}/posts/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground"
                            title="View published post"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <HugeiconsIcon icon={LinkSquare01Icon} size={14} />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {post.county?.name ?? "-"}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {post.category?.name ?? "-"}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          post.status === "published" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {post.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/posts/${post.id}/edit`}>Edit</Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDelete(post.id)}
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
