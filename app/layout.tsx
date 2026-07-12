import type { Metadata } from "next";
import Script from "next/script";
import { ToastHost } from "@/components/ToastHost";
import { absoluteUrl, siteConfig, siteTitle } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: siteTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    siteConfig.name,
    "collectible plush",
    "plush dolls",
    "military models",
    "tank models",
    "aircraft miniatures",
    "hobby collectibles",
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteTitle,
    description: siteConfig.description,
    url: absoluteUrl("/"),
    images: [
      {
        url: "/products/pk-01.png",
        width: 1200,
        height: 1200,
        alt: `${siteConfig.name} product`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
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

const googleAnalyticsId = parseGoogleAnalyticsId(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID);

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {googleAnalyticsId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleAnalyticsId)}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAnalyticsId}');
              `}
            </Script>
          </>
        ) : null}
        <ToastHost />
        {children}
      </body>
    </html>
  );
}

function parseGoogleAnalyticsId(value: string | undefined) {
  const id = value?.trim() ?? "";
  return /^G-[A-Z0-9]+$/i.test(id) ? id : "";
}
