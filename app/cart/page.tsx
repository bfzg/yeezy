import type { Metadata } from "next";
import { StoreChrome } from "@/components/Chrome";
import { CartClient } from "@/components/CartClient";
import { getShippingCents } from "@/lib/config";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your cart and contact the studio for early purchase requests.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartPage() {
  return (
    <main className="shell">
      <StoreChrome cartCount={0} backHref="/" />
      <CartClient
        contactEmail={siteConfig.contactEmail}
        contactInstagram={siteConfig.contactInstagram}
        contactTikTok={siteConfig.contactTikTok}
        contactTwitter={siteConfig.contactTwitter}
        contactWhatsApp={siteConfig.contactWhatsApp}
        checkoutPaused={siteConfig.checkoutPaused}
        shippingCents={getShippingCents()}
      />
    </main>
  );
}
