export const siteConfig = {
  name: "YEZI",
  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  description:
    "YEZI is a minimal fashion shop for sculptural apparel, footwear, slides, and accessories with a quiet black-and-neutral design language.",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  contactInstagram: process.env.NEXT_PUBLIC_CONTACT_INSTAGRAM ?? "",
  contactWhatsApp: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP ?? "",
  contactTikTok: process.env.NEXT_PUBLIC_CONTACT_TIKTOK ?? "",
  contactTwitter: process.env.NEXT_PUBLIC_CONTACT_TWITTER ?? "",
  checkoutPaused: parsePublicBoolean(process.env.NEXT_PUBLIC_CHECKOUT_PAUSED, true),
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

function normalizeSiteUrl(value: string) {
  const trimmed = value.trim().replace(/\/+$/, "");
  return trimmed || "http://localhost:3000";
}

function parsePublicBoolean(value: string | undefined, fallback: boolean) {
  if (value === undefined || value.trim() === "") return fallback;
  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}
