import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createProductCategory, deleteProductCategory, getProductCategories } from "@/lib/db";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  return NextResponse.json({ categories: getProductCategories() });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const body = await request.json();
  try {
    const category = createProductCategory(String(body.label ?? ""));
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Category creation failed.";
    const status = message.includes("already exists") ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const value = searchParams.get("value") ?? "";
  const mode = searchParams.get("mode") === "delete-products" ? "delete-products" : "unassign";
  try {
    return NextResponse.json(deleteProductCategory(value, mode));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Category deletion failed.";
    const status = message.includes("not found") ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
