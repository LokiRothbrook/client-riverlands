"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface PartnerRequest {
  id: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  website: string | null;
  address: string | null;
  category: string;
  description: string;
  additional_info: string | null;
  status: string;
  created_at: string;
  county: { name: string; slug: string } | null;
}

export function RequestReview({ requests }: { requests: PartnerRequest[] }) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const pending = requests.filter((r) => r.status === "pending");
  const approved = requests.filter((r) => r.status === "approved");
  const rejected = requests.filter((r) => r.status === "rejected");

  async function handleAction(id: string, status: "approved" | "rejected") {
    const res = await fetch(`/api/admin/partner-requests/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      toast.success(`Request ${status}`);
      router.refresh();
    } else {
      toast.error("Failed to update request");
    }
  }

  function RequestCard({ request }: { request: PartnerRequest }) {
    const isExpanded = expandedId === request.id;

    return (
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{request.business_name}</h3>
              <p className="text-sm text-muted-foreground">
                {request.contact_name} &middot; {request.email}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {request.category}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {request.county?.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(request.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setExpandedId(isExpanded ? null : request.id)
              }
            >
              {isExpanded ? "Collapse" : "Details"}
            </Button>
          </div>

          {isExpanded && (
            <div className="mt-4 space-y-3 border-t pt-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Description
                </p>
                <p className="text-sm">{request.description}</p>
              </div>
              {request.additional_info && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Additional Info
                  </p>
                  <p className="text-sm">{request.additional_info}</p>
                </div>
              )}
              <div className="grid gap-2 text-sm sm:grid-cols-3">
                {request.phone && (
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Phone:
                    </span>{" "}
                    {request.phone}
                  </div>
                )}
                {request.website && (
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Website:
                    </span>{" "}
                    <a
                      href={request.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {request.website}
                    </a>
                  </div>
                )}
                {request.address && (
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Address:
                    </span>{" "}
                    {request.address}
                  </div>
                )}
              </div>
              {request.status === "pending" && (
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => handleAction(request.id, "approved")}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive"
                    onClick={() => handleAction(request.id, "rejected")}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="pending">
      <TabsList>
        <TabsTrigger value="pending">
          Pending ({pending.length})
        </TabsTrigger>
        <TabsTrigger value="approved">
          Approved ({approved.length})
        </TabsTrigger>
        <TabsTrigger value="rejected">
          Rejected ({rejected.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pending" className="mt-4 space-y-4">
        {pending.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-muted-foreground">
                No pending requests
              </CardTitle>
            </CardHeader>
          </Card>
        ) : (
          pending.map((r) => <RequestCard key={r.id} request={r} />)
        )}
      </TabsContent>

      <TabsContent value="approved" className="mt-4 space-y-4">
        {approved.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-muted-foreground">
                No approved requests
              </CardTitle>
            </CardHeader>
          </Card>
        ) : (
          approved.map((r) => <RequestCard key={r.id} request={r} />)
        )}
      </TabsContent>

      <TabsContent value="rejected" className="mt-4 space-y-4">
        {rejected.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-muted-foreground">
                No rejected requests
              </CardTitle>
            </CardHeader>
          </Card>
        ) : (
          rejected.map((r) => <RequestCard key={r.id} request={r} />)
        )}
      </TabsContent>
    </Tabs>
  );
}
