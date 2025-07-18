import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alan Tom",
  description: "hello i am alan",
  openGraph: {
    title: "Alan Tom",
    description: "hello i am alan",
    url: "https://your-website.com",
    siteName: "Alan Tom Portfolio",
    images: [
      {
        url: "/images/cockatiel.webp",
        width: 800,
        height: 600,
        alt: "Alan Tom",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alan Tom",
    description: "hello i am alan",
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
