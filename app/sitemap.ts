import type { MetadataRoute } from "next";
import { productCategories } from "@/lib/categories";
import { getProducts } from "@/lib/db";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const categoryUrls = productCategories.map((category) => ({
    url: absoluteUrl(category.value === "new" ? "/" : `/?category=${category.value}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: category.value === "new" ? 1 : 0.8,
  }));
  const productUrls = getProducts().map((product) => ({
    url: absoluteUrl(`/products/${product.slug}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...categoryUrls, ...productUrls];
}
