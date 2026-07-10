import { readFile, stat } from "node:fs/promises";
import { NextResponse } from "next/server";
import { getImageContentType, resolveUploadPath } from "@/lib/uploads";

export const runtime = "nodejs";

type UploadRouteContext = {
  params: Promise<{ path: string[] }>;
};

export async function GET(_request: Request, { params }: UploadRouteContext) {
  const { path } = await params;
  const filePath = resolveUploadPath(path);
  if (!filePath) {
    return NextResponse.json({ error: "Image not found." }, { status: 404 });
  }

  try {
    const info = await stat(filePath);
    if (!info.isFile()) {
      return NextResponse.json({ error: "Image not found." }, { status: 404 });
    }

    const file = await readFile(filePath);
    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": String(info.size),
        "Content-Type": getImageContentType(filePath)
      }
    });
  } catch {
    return NextResponse.json({ error: "Image not found." }, { status: 404 });
  }
}

export async function HEAD(_request: Request, { params }: UploadRouteContext) {
  const { path } = await params;
  const filePath = resolveUploadPath(path);
  if (!filePath) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const info = await stat(filePath);
    if (!info.isFile()) {
      return new NextResponse(null, { status: 404 });
    }

    return new NextResponse(null, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": String(info.size),
        "Content-Type": getImageContentType(filePath)
      }
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}

