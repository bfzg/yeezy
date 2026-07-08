import type { Metadata } from "next";
import { HomeCatalog } from "@/components/HomeCatalog";
import { getCart, getProductCategories, getProducts, getSessionId } from "@/lib/db";
import { absoluteUrl, siteConfig } from "@/lib/site";

const categoryMeta: Record<string, { title: string; description: string }> = {
  new: {
    title: "All Products",
    description: "Shop all collectible plush dolls, mini models, and hobby display pieces.",
  },
  mens: {
    title: "Mens",
    description: "Explore curated mini collectibles, display pieces, and hobby items.",
  },
  womens: {
    title: "Womens",
    description: "Explore soft plush, collectible figures, and gift-ready miniatures.",
  },
  footwear: {
    title: "Footwear",
    description: "Shop detailed model pieces and compact collectibles for display.",
  },
  accessories: {
    title: "Accessories",
    description: "Shop small accessories, display items, and collector-friendly pieces.",
  },
  slides: {
    title: "Slides",
    description: "Shop compact hobby pieces, plush characters, and mini display favorites.",
  },
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const category = params.category ?? "new";
  const dynamicCategory = getProductCategories().find((item) => item.value === category);
  const copy = dynamicCategory
    ? { title: dynamicCategory.label, description: siteConfig.description }
    : categoryMeta[category] ?? categoryMeta.new;
  const canonical = category === "new" || category === "all" ? "/" : `/?category=${category}`;
  const pageTitle = `${copy.title} | ${siteConfig.name}`;

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: pageTitle,
      description: copy.description,
      url: absoluteUrl(canonical),
      images: ["/products/pk-01.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: copy.description,
      images: ["/products/pk-01.png"],
    },
  };
}

export default async function Home({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = await searchParams;
  const sessionId = await getSessionId();
  const cart = getCart(sessionId);
  const products = getProducts(params.category);
  const categories = getProductCategories();
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: siteConfig.name,
    description: siteConfig.description,
    url: absoluteUrl(params.category ? `/?category=${params.category}` : "/"),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: product.name,
          image: absoluteUrl(product.image),
          description: product.description,
          sku: product.sku,
          url: absoluteUrl(`/products/${product.slug}`),
          offers: {
            "@type": "Offer",
            priceCurrency: "USD",
            price: (product.priceCents / 100).toFixed(2),
            availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          },
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <HomeCatalog activeCategory={params.category ?? "new"} cartCount={cartCount} categories={categories} products={products} />
    </>
  );
}
