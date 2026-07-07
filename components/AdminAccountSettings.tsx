"use client";

import { useState } from "react";
import { showToast } from "@/lib/toast";

type AdminAccount = {
  email: string;
  name: string;
};

export function AdminAccountSettings({ admin }: { admin: AdminAccount }) {
  const [email, setEmail] = useState(admin.email);
  const [name, setName] = useState(admin.name);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const response = await fetch("/api/admin/account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name,
        currentPassword,
        newPassword,
        confirmPassword,
      }),
    });
    const payload = await response.json();
    setSaving(false);
    if (!response.ok) {
      showToast(payload.error ?? "保存管理员设置失败", "error");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showToast("管理员设置已保存", "success");
  }

  return (
    <section className="settings-content">
      <div className="settings-card-head">
        <div>
          <h2>管理员设置</h2>
          <p>修改后台登录邮箱、名称和密码</p>
        </div>
      </div>
      <div className="admin-form settings-form">
        <label className="setting-field">
          <span>管理员邮箱</span>
          <input
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@example.com"
            type="email"
            value={email}
          />
        </label>
        <label className="setting-field">
          <span>管理员名称</span>
          <input
            onChange={(event) => setName(event.target.value)}
            placeholder="YEZI ADMIN"
            value={name}
          />
        </label>
        <label className="setting-field">
          <span>当前密码</span>
          <input
            autoComplete="current-password"
            onChange={(event) => setCurrentPassword(event.target.value)}
            placeholder="修改密码时填写"
            type="password"
            value={currentPassword}
          />
        </label>
        <label className="setting-field">
          <span>新密码</span>
          <input
            autoComplete="new-password"
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="至少 6 位"
            type="password"
            value={newPassword}
          />
        </label>
        <label className="setting-field">
          <span>确认新密码</span>
          <input
            autoComplete="new-password"
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="再次输入新密码"
            type="password"
            value={confirmPassword}
          />
        </label>
      </div>
      <div className="admin-actions">
        <button
          className="admin-action-button primary"
          disabled={saving}
          onClick={save}
          type="button"
        >
          {saving ? "保存中..." : "保存管理员设置"}
        </button>
      </div>
    </section>
  );
}
