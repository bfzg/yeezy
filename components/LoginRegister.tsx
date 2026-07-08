"use client";

import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";

export function LoginRegister() {
  const router = useRouter();

  async function submit(formData: FormData) {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });
    const payload = await response.json();
    if (!response.ok) {
      showToast(payload.error ?? "请求失败", "error");
      return;
    }
    showToast("登录成功", "success");
    router.push(payload.user?.role === "admin" ? "/admin" : "/");
    router.refresh();
  }

  return (
    <section className="auth-panel">
      <form action={submit} className="admin-form">
        <input name="email" type="email" placeholder="EMAIL" required />
        <input name="password" type="password" placeholder="PASSWORD" required />
        <button className="submit-order">LOGIN</button>
      </form>
    </section>
  );
}
