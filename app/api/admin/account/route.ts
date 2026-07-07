import { NextResponse } from "next/server";
import { hashPassword, requireAdmin, verifyPassword } from "@/lib/auth";
import { db } from "@/lib/db";

type AdminCredentialRow = {
  password_hash: string;
};

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const email = String(body.email ?? "").trim().toLowerCase();
  const name = String(body.name ?? "").trim();
  const currentPassword = String(body.currentPassword ?? "");
  const newPassword = String(body.newPassword ?? "");
  const confirmPassword = String(body.confirmPassword ?? "");
  const wantsPasswordChange = Boolean(newPassword || confirmPassword);

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "请输入有效邮箱" }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: "请输入管理员名称" }, { status: 400 });
  }
  if (wantsPasswordChange) {
    if (newPassword.length < 6) {
      return NextResponse.json({ error: "新密码至少 6 位" }, { status: 400 });
    }
    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "两次输入的新密码不一致" }, { status: 400 });
    }
    const row = db().prepare("SELECT password_hash FROM users WHERE id = ?").get(admin.id) as AdminCredentialRow | undefined;
    if (!row || !verifyPassword(currentPassword, row.password_hash)) {
      return NextResponse.json({ error: "当前密码不正确" }, { status: 400 });
    }
  }

  try {
    if (wantsPasswordChange) {
      db().prepare("UPDATE users SET email = ?, name = ?, password_hash = ? WHERE id = ?")
        .run(email, name, hashPassword(newPassword), admin.id);
    } else {
      db().prepare("UPDATE users SET email = ?, name = ? WHERE id = ?")
        .run(email, name, admin.id);
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("UNIQUE")) {
      return NextResponse.json({ error: "该邮箱已被使用" }, { status: 400 });
    }
    throw error;
  }

  return NextResponse.json({
    ok: true,
    user: {
      id: admin.id,
      email,
      name,
      role: admin.role,
    },
  });
}
