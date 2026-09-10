import type { Metadata } from "next";
import type { ReactNode } from "react";
// Inter, as a VARIABLE font — that part is load-bearing. The site sets
// body copy at weight 460, which is a real position on Inter's weight
// axis and not one of the static cuts. Pin this to fixed weights and
// every line on the page silently snaps to 500.
import { Inter } from "next/font/google";
import { ASSET_VERSION } from "../lib/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Alan Tom",
    template: "%s | Alan Tom",
  },
  description: "CS @ SU, building FWRD",
  keywords: [
    "Alan Tom",
    "Computer Science",
    "Syracuse University",
    "CuseHacks",
    "Developer",
    "code",
    "lead",
    "portfolio",
    "Python",
  ],
  authors: [{ name: "Alan Tom", url: "https://alantom.dev" }],
  creator: "Alan Tom",
  metadataBase: new URL("https://alantom.dev"),
  openGraph: {
    title: "Alan Tom",
    description: "CS @ SU, building FWRD",
    url: "https://alantom.dev",
    siteName: "Alan's Portfolio",
    images: [
      {
        url: `/images/buttercup_og.png?v=${ASSET_VERSION}`,
        width: 1200,
        height: 630,
        alt: "Alan Tom's Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alan Tom",
    description: "CS @ SU, building FWRD",
    images: [`/images/buttercup_og.png?v=${ASSET_VERSION}`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href={`/images/cockatiel.webp?v=${ASSET_VERSION}`} type="image/webp" />
        {/* Light only — tell the browser, so form controls, scrollbars and
            the mobile URL bar don't render themselves dark around a page
            that has no dark mode. */}
        <meta name="color-scheme" content="light" />
        <meta name="theme-color" content="#fdfdfc" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Alan Tom",
              url: "https://alantom.dev",
              image: `https://alantom.dev/images/buttercup_og.png?v=${ASSET_VERSION}`,
              sameAs: [
                "https://github.com/alanwtom",
                "https://linkedin.com/in/alan-tom/",
              ],
              jobTitle: "Computer Science Student",
              worksFor: {
                "@type": "Organization",
                name: "Syracuse University",
              },
              alumniOf: {
                "@type": "Organization",
                name: "Syracuse University",
              },
            }),
          }}
        />
      </head>
      {/* The page supplies its own <main>. This used to wrap children in a
          second one that carried the same id, so the skip link and every
          screen reader saw two "main" landmarks with a duplicate id. */}
      <body className="font-sans">{children}</body>
    </html>
  );
}
