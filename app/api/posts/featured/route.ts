import { NextResponse, type NextRequest } from "next/server";
import { getFeaturedPostsPaginated } from "@/lib/queries";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const offset = parseInt(searchParams.get("offset") || "0");
    const limit = Math.min(parseInt(searchParams.get("limit") || "6"), 20);

    const posts = await getFeaturedPostsPaginated(offset, limit);

    return NextResponse.json(posts);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
