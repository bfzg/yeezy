import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createUploadFileName, getUploadDir, isSupportedImageUpload } from "@/lib/uploads";

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File is required." }, { status: 400 });
  }
  if (!isSupportedImageUpload(file.name, file.type)) {
    return NextResponse.json({ error: "Only PNG, JPG, JPEG, WEBP, GIF, and AVIF images are allowed." }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = createUploadFileName(file.name);
  const dir = getUploadDir();
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, safeName), bytes);
  return NextResponse.json({ url: `/uploads/${safeName}` }, { status: 201 });
}
