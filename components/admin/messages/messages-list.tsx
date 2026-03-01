"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  archived: boolean;
  created_at: string;
}

export function MessagesList({ messages }: { messages: Message[] }) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const visible = messages.filter((m) =>
    showArchived ? m.archived : !m.archived
  );

  async function markRead(id: string) {
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });
    if (res.ok) {
      router.refresh();
    } else {
      toast.error("Failed to mark as read");
    }
  }

  async function toggleArchive(id: string, archived: boolean) {
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived: !archived }),
    });
    if (res.ok) {
      toast.success(archived ? "Unarchived" : "Archived");
      router.refresh();
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setShowArchived(false)}
          className="inline-flex"
        >
          <Badge variant={!showArchived ? "default" : "outline"}>
            Inbox ({messages.filter((m) => !m.archived).length})
          </Badge>
        </button>
        <button
          type="button"
          onClick={() => setShowArchived(true)}
          className="inline-flex"
        >
          <Badge variant={showArchived ? "default" : "outline"}>
            Archived ({messages.filter((m) => m.archived).length})
          </Badge>
        </button>
      </div>

      {visible.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            {showArchived ? "No archived messages." : "No messages."}
          </CardContent>
        </Card>
      ) : (
        visible.map((msg) => {
          const isExpanded = expandedId === msg.id;
          return (
            <Card
              key={msg.id}
              className={cn(!msg.read && "border-l-4 border-l-primary")}
            >
              <CardContent className="p-5">
                <button
                  type="button"
                  className="flex w-full cursor-pointer items-start justify-between text-left"
                  onClick={() => {
                    setExpandedId(isExpanded ? null : msg.id);
                    if (!msg.read) markRead(msg.id);
                  }}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        className={cn(
                          "text-sm",
                          !msg.read && "font-bold"
                        )}
                      >
                        {msg.subject}
                      </h3>
                      {!msg.read && (
                        <Badge variant="default" className="text-[10px]">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {msg.name} &lt;{msg.email}&gt; &middot;{" "}
                      {new Date(msg.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <span>{isExpanded ? "Collapse" : "Expand"}</span>
                  </Button>
                </button>

                {isExpanded && (
                  <div className="mt-4 space-y-3 border-t pt-4">
                    <div className="whitespace-pre-wrap text-sm">
                      {msg.message}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleArchive(msg.id, msg.archived)}
                      >
                        {msg.archived ? "Unarchive" : "Archive"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                      >
                        <a href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}>
                          Reply
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
