import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: subscribers, error } = await supabase
      .from("newsletter_subscribers")
      .select("email, first_name, last_name, counties_subscribed, verified, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Build CSV
    const headers = [
      "Email",
      "First Name",
      "Last Name",
      "Counties",
      "Verified",
      "Subscribed At",
    ];

    const rows = (subscribers ?? []).map((s) => [
      s.email,
      s.first_name || "",
      s.last_name || "",
      (s.counties_subscribed || []).join("; "),
      s.verified ? "Yes" : "No",
      new Date(s.created_at).toISOString(),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
