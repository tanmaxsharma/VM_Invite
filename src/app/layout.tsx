import type { Metadata, Viewport } from "next";
import { wedding } from "@/data/wedding";
import { devanagariFont, displayFont, sansFont } from "@/styles/fonts";
import { Providers } from "@/components/providers/Providers";
import "@/styles/globals.css";

const { meta } = wedding;

// The link preview (WhatsApp, social) and the page's own title. `metadataBase` turns the paths below
// into absolute https URLs on the live site, which is what link previews need.
export const metadata: Metadata = {
  metadataBase: new URL(meta.siteUrl),
  title: meta.title,
  description: meta.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: meta.siteName,
    title: meta.title,
    description: meta.description,
    locale: "en_IN",
    images: [
      {
        url: meta.image.src,
        width: meta.image.width,
        height: meta.image.height,
        alt: meta.image.alt,
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: meta.title,
    description: meta.description,
    images: [{ url: meta.image.src, alt: meta.image.alt }],
  },
};

export const viewport: Viewport = {
  themeColor: "#fbf7ee",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${sansFont.variable} ${devanagariFont.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
