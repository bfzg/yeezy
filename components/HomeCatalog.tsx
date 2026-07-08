"use client";

import { useState } from "react";
import { StoreChrome } from "@/components/Chrome";
import { HomeGrid } from "@/components/HomeGrid";
import type { ProductCategory } from "@/lib/categories";
import type { Product } from "@/lib/db";

export function HomeCatalog({
  products,
  cartCount,
  activeCategory,
  categories
}: {
  products: Product[];
  cartCount: number;
  activeCategory: string;
  categories: ProductCategory[];
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <main className="shell">
      <StoreChrome
        cartCount={cartCount}
        activeCategory={activeCategory}
        categories={categories}
        expanded={expanded}
        onPlusClick={() => setExpanded((current) => !current)}
      />
      <HomeGrid expanded={expanded} products={products} />
    </main>
  );
}
