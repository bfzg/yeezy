import type { Metadata } from "next";
import { ToastHost } from "@/components/ToastHost";
import { absoluteUrl, siteConfig } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: "YEZI | Minimal Apparel, Footwear & Accessories",
    template: "%s | YEZI",
  },
  description: siteConfig.description,
  keywords: [
    "YEZI",
    "minimal fashion",
    "black apparel",
    "technical outerwear",
    "slides",
    "footwear",
    "accessories",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: "YEZI | Minimal Apparel, Footwear & Accessories",
    description: siteConfig.description,
    url: absoluteUrl("/"),
    images: [
      {
        url: "/products/pk-01.png",
        width: 1200,
        height: 1200,
        alt: "YEZI black parka",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YEZI | Minimal Apparel, Footwear & Accessories",
    description: siteConfig.description,
    images: ["/products/pk-01.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ToastHost />
        {children}
      </body>
    </html>
  );
}
