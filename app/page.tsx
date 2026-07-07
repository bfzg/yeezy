import type { Metadata } from "next";
import { HomeCatalog } from "@/components/HomeCatalog";
import { getCart, getProducts, getSessionId } from "@/lib/db";
import { absoluteUrl, siteConfig } from "@/lib/site";

const categoryMeta: Record<string, { title: string; description: string }> = {
  new: {
    title: "New Arrivals",
    description: "Shop the latest YEZI apparel, footwear, slides, and accessories.",
  },
  mens: {
    title: "Mens",
    description: "Explore YEZI menswear: technical outerwear, jackets, denim, and everyday uniform pieces.",
  },
  womens: {
    title: "Womens",
    description: "Explore YEZI womenswear: quiet outerwear, sculptural layers, and neutral wardrobe pieces.",
  },
  footwear: {
    title: "Footwear",
    description: "Shop YEZI footwear, including minimal boots and sculptural everyday silhouettes.",
  },
  accessories: {
    title: "Accessories",
    description: "Shop YEZI accessories, bags, and eyewear in a restrained black-and-neutral palette.",
  },
  slides: {
    title: "Slides",
    description: "Shop YEZI slides with soft curves, thick soles, and minimal everyday styling.",
  },
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const category = params.category ?? "new";
  const copy = categoryMeta[category] ?? categoryMeta.new;
  const canonical = category === "new" ? "/" : `/?category=${category}`;

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${copy.title} | YEZI`,
      description: copy.description,
      url: absoluteUrl(canonical),
      images: ["/products/pk-01.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${copy.title} | YEZI`,
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
      <HomeCatalog activeCategory={params.category ?? "new"} cartCount={cartCount} products={products} />
    </>
  );
}
