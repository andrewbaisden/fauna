import { createReadStream } from "node:fs";
import { access, stat } from "node:fs/promises";
import path from "node:path";
import { get } from "@vercel/blob";
import { type NextRequest, NextResponse } from "next/server";

const ALLOWED_PREFIXES = ["media/", "models/"] as const;

function contentTypeFor(pathname: string, blobType?: string | null): string {
  if (blobType) {
    return blobType;
  }
  if (pathname.endsWith(".glb")) {
    return "model/gltf-binary";
  }
  if (pathname.endsWith(".gltf")) {
    return "model/gltf+json";
  }
  if (pathname.endsWith(".png")) {
    return "image/png";
  }
  if (pathname.endsWith(".webp")) {
    return "image/webp";
  }
  return "application/octet-stream";
}

/**
 * Streams curated photos and GLBs from private Vercel Blob.
 * Locally, models/ also falls back to public/models for offline viewer use.
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
    !ALLOWED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  ) {
    return NextResponse.json({ error: "Invalid pathname" }, { status: 400 });
  }

  try {
    const result = await get(pathname, { access: "private" });
    if (
      result !== null &&
      result.statusCode === 200 &&
      result.stream !== null
    ) {
      return new NextResponse(result.stream, {
        headers: {
          "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable",
          "Content-Type": contentTypeFor(pathname, result.blob.contentType),
          "X-Content-Type-Options": "nosniff",
        },
      });
    }
  } catch {
    // Fall through to local models/ for development without Blob.
  }

  if (pathname.startsWith("models/")) {
    const localPath = path.join(process.cwd(), "public", pathname);
    try {
      await access(localPath);
      const info = await stat(localPath);
      const stream = createReadStream(localPath);
      return new NextResponse(stream as unknown as BodyInit, {
        headers: {
          "Cache-Control": "public, max-age=3600",
          "Content-Type": contentTypeFor(pathname),
          "Content-Length": String(info.size),
          "X-Content-Type-Options": "nosniff",
        },
      });
    } catch {
      // not found locally
    }
  }

  return new NextResponse("Not found", { status: 404 });
}
