"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminProductCategory } from "@/lib/categories";
import { showToast } from "@/lib/toast";

export function AdminCategoryManager({ categories }: { categories: AdminProductCategory[] }) {
  const router = useRouter();
  const [categoryName, setCategoryName] = useState("");
  const [creating, setCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function createCategory() {
    const label = categoryName.trim();
    if (!label || creating) return;
    setCreating(true);
    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label })
    });
    setCreating(false);

    if (response.ok) {
      setCategoryName("");
      showToast("分类已创建", "success");
      router.refresh();
      inputRef.current?.focus();
      return;
    }

    const payload = await response.json();
    showToast(payload.error ?? "分类创建失败", "error");
  }

  async function deleteCategory(category: AdminProductCategory, mode: "unassign" | "delete-products") {
    if (mode === "delete-products") {
      const first = confirm(`删除分类「${category.label}」并删除分类下 ${category.productCount} 个商品？`);
      if (!first) return;
      const second = confirm("这个操作会删除没有订单的商品；有历史订单的商品会归档隐藏。确认继续？");
      if (!second) return;
    } else {
      const ok = confirm(`仅删除分类「${category.label}」？分类下商品会变为未分类，只能从 NEW 全部商品中看到。`);
      if (!ok) return;
    }

    const params = new URLSearchParams({ value: category.value, mode });
    const response = await fetch(`/api/admin/categories?${params.toString()}`, { method: "DELETE" });
    if (response.ok) {
      showToast(mode === "delete-products" ? "分类和商品已处理" : "分类已删除", "success");
      router.refresh();
      return;
    }

    const payload = await response.json();
    showToast(payload.error ?? "分类删除失败", "error");
  }

  return (
    <section className="admin-wide">
      <h2 className="section-title spaced">新增分类</h2>
      <div className="category-create-inline">
        <input
          aria-label="新增分类"
          disabled={creating}
          onChange={(event) => setCategoryName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            createCategory();
          }}
          placeholder="输入分类名称后回车"
          ref={inputRef}
          value={categoryName}
        />
      </div>
      <h2 className="section-title spaced">分类列表</h2>
      <div className="data-list">
        {categories.map((category) => (
          <div className="category-admin-row" key={category.value}>
            <span>
              <strong>{category.label}</strong>
              <em>{category.productCount} 个商品</em>
            </span>
            <button className="admin-action-button" onClick={() => deleteCategory(category, "unassign")} type="button">
              仅删除分类
            </button>
            <button className="admin-action-button danger" onClick={() => deleteCategory(category, "delete-products")} type="button">
              删除分类及商品
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
