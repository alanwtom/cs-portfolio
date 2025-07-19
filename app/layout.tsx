import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alan Tom",
  description: "jobmaxxing",
  openGraph: {
    title: "Alan Tom",
    description: "jobmaxxing",
    url: "https://alantom.dev",
    siteName: "Alan Tom",
    images: [
      {
        url: "/images/cockatiel.webp",
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
    title: "jobmaxxing",
    description: "Alan Tom's Portfolio",

    images: ["/images/cockatiel.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/cockatiel.webp" type="image/webp" />
      </head>
      <body>{children}</body>
    </html>
  );
}
