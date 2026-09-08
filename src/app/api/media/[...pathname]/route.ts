import { get } from "@vercel/blob";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Streams curated species photos from a private Vercel Blob store.
 * Only pathnames under media/ are allowed (encyclopedia assets, not arbitrary blobs).
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ pathname: string[] }> },
) {
  const parts = (await context.params).pathname;
  const pathname = parts.join("/");

  if (
    parts.length === 0 ||
    parts.some((part) => part === ".." || part === ".") ||
    !pathname.startsWith("media/")
  ) {
    return NextResponse.json({ error: "Invalid pathname" }, { status: 400 });
  }

  const result = await get(pathname, { access: "private" });

  if (result === null || result.statusCode !== 200 || result.stream === null) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(result.stream, {
    headers: {
      "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable",
      "Content-Type": result.blob.contentType,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
