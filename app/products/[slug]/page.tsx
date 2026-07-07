import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/AddToCart";
import { StoreChrome } from "@/components/Chrome";
import { Gallery } from "@/components/Gallery";
import { formatMoney, getCart, getProductBySlug, getSessionId } from "@/lib/db";
import { absoluteUrl } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return {
      title: "Product Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${product.name} ${product.category}`;
  const description = product.description || `Shop ${product.name} from YEZI.`;
  const canonical = `/products/${product.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      title: `${title} | YEZI`,
      description,
      url: absoluteUrl(canonical),
      images: product.gallery.map((image) => ({
        url: image,
        width: 1200,
        height: 1200,
        alt: product.name,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | YEZI`,
      description,
      images: product.gallery,
    },
  };
}

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const sessionId = await getSessionId();
  const cart = getCart(sessionId);
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    image: product.gallery.map((image) => absoluteUrl(image)),
    description: product.description,
    category: product.category,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: (product.priceCents / 100).toFixed(2),
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: absoluteUrl(`/products/${product.slug}`),
    },
  };

  return (
    <main className="shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <StoreChrome cartCount={cartCount} backHref="/" />
      <section className="detail-stage">
        <Gallery images={product.gallery} name={product.name} />
        <div className="product-panel">
          <div>{product.name}</div>
          <div>{formatMoney(product.priceCents)}</div>
          <AddToCart
            product={{
              id: product.id,
              sku: product.sku,
              slug: product.slug,
              name: product.name,
              image: product.image,
              priceCents: product.priceCents
            }}
            variants={product.variants}
          />
          <div className="product-details-copy">
            <p>{product.material}</p>
            <p>{product.sizeChart}</p>
            <p>{product.careInstructions}</p>
            <p>{product.modelInfo}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
