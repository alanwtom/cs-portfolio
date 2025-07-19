import type { Metadata } from "next";
import React from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Alan Tom - Computer Science Student & Developer",
    template: "%s | Alan Tom"
  },
  description: "Computer Science junior at Syracuse University, leading CuseHacks hackathon and building innovative web applications and Discord bots.",
  keywords: [
    "Alan Tom",
    "Computer Science",
    "Syracuse University",
    "CuseHacks",
    "Web Developer",
    "Discord Bot",
    "React",
    "Next.js",
    "Python"
  ],
  authors: [{ name: "Alan Tom", url: "https://alantom.dev" }],
  creator: "Alan Tom",
  openGraph: {
    title: "Alan Tom - Computer Science Student & Developer",
    description: "Computer Science junior at Syracuse University, leading CuseHacks hackathon and building innovative web applications and Discord bots.",
    url: "https://alantom.dev",
    siteName: "Alan Tom Portfolio",
    images: [
      {
        url: "/images/cockatiel.webp",
        width: 1200,
        height: 630,
        alt: "Alan Tom's Portfolio - Computer Science Student and Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alan Tom - Computer Science Student & Developer",
    description: "Computer Science junior at Syracuse University, leading CuseHacks hackathon and building innovative applications.",
    images: ["/images/cockatiel.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">
        <main role="main" id="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
