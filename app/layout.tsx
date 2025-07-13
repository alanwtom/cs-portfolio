import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alan Tom",
  description: "my portfolio",
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
