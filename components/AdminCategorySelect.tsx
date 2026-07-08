"use client";

import { useMemo, useState } from "react";
import type { ProductCategory } from "@/lib/categories";

export function AdminCategorySelect({
  categories,
  defaultValue = "",
  exclude = []
}: {
  categories: ProductCategory[];
  defaultValue?: string;
  exclude?: string[];
}) {
  const excludeKey = exclude.join("\n");
  const options = useMemo(
    () => {
      const excluded = new Set(excludeKey ? excludeKey.split("\n") : []);
      return categories.filter((category) => !excluded.has(category.value));
    },
    [categories, excludeKey]
  );
  const safeDefault = options.some((category) => category.value === defaultValue) ? defaultValue : "";
  const [value, setValue] = useState(safeDefault);
  const [open, setOpen] = useState(false);
  const selected = options.find((category) => category.value === value);

  return (
    <div className="custom-select">
      <input name="category" type="hidden" value={value} />
      <button className="custom-select-trigger" onClick={() => setOpen((current) => !current)} type="button">
        <span>{selected?.label ?? "未分类"}</span>
        <span aria-hidden>⌄</span>
      </button>
      {open ? (
        <div className="custom-select-menu">
          {options.map((category) => (
            <button
              className={category.value === value ? "active" : ""}
              key={category.value}
              onClick={() => {
                setValue(category.value);
                setOpen(false);
              }}
              type="button"
            >
              {category.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
