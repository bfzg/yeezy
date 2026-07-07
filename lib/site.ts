export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "DropMini",
  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION
    ?? "DropMini is a global shop for collectible plush dolls, military tank models, aircraft miniatures, and display-ready hobby pieces.",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  contactInstagram: process.env.NEXT_PUBLIC_CONTACT_INSTAGRAM ?? "",
  contactWhatsApp: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP ?? "",
  contactTikTok: process.env.NEXT_PUBLIC_CONTACT_TIKTOK ?? "",
  contactTwitter: process.env.NEXT_PUBLIC_CONTACT_TWITTER ?? "",
  checkoutPaused: parsePublicBoolean(process.env.NEXT_PUBLIC_CHECKOUT_PAUSED, true),
};

export const siteTitle = `${siteConfig.name} | Collectible Plush & Mini Models`;

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
