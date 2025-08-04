import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Alan Tom",
    template: "%s | Alan Tom",
  },
  description:
    "Computer Science junior at Syracuse University, leading CuseHacks hackathon and building innovative web applications and Discord bots.",
  keywords: [
    "Alan Tom",
    "Computer Science",
    "Syracuse University",
    "CuseHacks",
    "Web Developer",
    "Discord Bot",
    "React",
    "Next.js",
    "Python",
  ],
  authors: [{ name: "Alan Tom", url: "https://alantom.dev" }],
  creator: "Alan Tom",
  openGraph: {
    title: "Alan Tom",
    description: "Hello! my name is Alan Tom, welcome to my portfolio",
    url: "https://alantom.dev",
    siteName: "Alan's Portfolio",
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
    title: "Alan Tom",
    description: "Hello! my name is Alan Tom, welcome to my portfolio",
    images: ["/images/cockatiel.webp"],
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
    <html lang="en">
      <head>
        <link rel="icon" href="/images/cockatiel.webp" type="image/webp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Alan Tom",
              url: "https://alantom.dev",
              image: "https://alantom.dev/images/buttercup.jpg",
              sameAs: [
                "https://github.com/alantomw",
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
      <body className="antialiased">
        <main role="main" id="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
