"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminCategorySelect } from "@/components/AdminCategorySelect";
import { AdminImageManager, type AdminImageManagerHandle } from "@/components/AdminImageManager";
import type { ProductCategory } from "@/lib/categories";
import { showToast } from "@/lib/toast";

type DraftVariant = {
  id: number;
  size: string;
  price: string;
};

function emptyVariant(): DraftVariant {
  return { id: Date.now() + Math.random(), size: "", price: "" };
}

export function AdminTools({ categories }: { categories: ProductCategory[] }) {
  const router = useRouter();
  const imageManagerRef = useRef<AdminImageManagerHandle>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [variants, setVariants] = useState<DraftVariant[]>([emptyVariant()]);

  function addVariant() {
    setVariants((current) => [...current, emptyVariant()]);
  }

  function updateVariant(id: number, field: "size" | "price", value: string) {
    setVariants((current) => current.map((variant) => (
      variant.id === id ? { ...variant, [field]: value } : variant
    )));
  }

  function removeVariant(id: number) {
    setVariants((current) => {
      const next = current.filter((variant) => variant.id !== id);
      return next.length > 0 ? next : [emptyVariant()];
    });
  }

  async function createProduct(formData: FormData) {
    const payload = {
      ...Object.fromEntries(formData.entries()),
      variants: variants
        .map((variant) => ({ size: variant.size.trim(), price: variant.price.trim() }))
        .filter((variant) => variant.size)
    };
    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (response.ok) {
      formRef.current?.reset();
      imageManagerRef.current?.reset();
      setVariants([emptyVariant()]);
      showToast("商品已创建", "success");
      router.refresh();
    } else {
      showToast("商品创建失败", "error");
    }
  }

  return (
    <section className="admin-wide">
        <form ref={formRef} className="admin-form" action={createProduct}>
          <input name="sku" placeholder="SKU" required />
          <input name="name" placeholder="商品名称" required />
          <AdminCategorySelect categories={categories} defaultValue={categories[0]?.value ?? ""} />
          <label className="unit-field">
            <input name="price" placeholder="价格" required />
            <span>USD</span>
          </label>
          <label className="unit-field">
            <input name="stock" placeholder="库存" defaultValue="12" />
            <span>件</span>
          </label>
          <div className="variant-create-panel">
            <div className="variant-create-head">
              <span>规格</span>
            </div>
            <div className="variant-create-list">
              {variants.map((variant) => (
                <div className="variant-create-row" key={variant.id}>
                  <input
                    value={variant.size}
                    onChange={(event) => updateVariant(variant.id, "size", event.target.value)}
                    placeholder="规格名称，如 L / XL / XXL"
                  />
                  <label className="unit-field compact">
                    <input
                      value={variant.price}
                      onChange={(event) => updateVariant(variant.id, "price", event.target.value)}
                      placeholder="定价"
                    />
                    <span>USD</span>
                  </label>
                  <button type="button" onClick={() => removeVariant(variant.id)} aria-label="删除规格">删除</button>
                </div>
              ))}
            </div>
            <button className="variant-create-add" type="button" onClick={addVariant} aria-label="新增规格">+</button>
          </div>
          <AdminImageManager ref={imageManagerRef} initialImages={[]} />
          <textarea name="description" placeholder="描述" />
          <textarea name="material" placeholder="材质" />
          <textarea name="sizeChart" placeholder="尺码表" />
          <textarea name="careInstructions" placeholder="护理说明" />
          <textarea name="modelInfo" placeholder="模特信息" />
          <button className="submit-order">创建</button>
        </form>
    </section>
  );
}
