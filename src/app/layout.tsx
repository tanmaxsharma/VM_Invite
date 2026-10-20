import type { Metadata, Viewport } from "next";
import { wedding } from "@/data/wedding";
import {
  devanagariFont,
  displayFont,
  sansFont,
} from "@/styles/fonts";
import { Providers } from "@/components/providers/Providers";
import "@/styles/globals.css";

const { meta } = wedding;

const siteUrl = "https://mahvieenrose.vercel.app";
const ogImageUrl =
  "https://mahvieenrose.vercel.app/images/social/og-couple.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: meta.title,
  description: meta.description,

  applicationName: meta.siteName,

  alternates: {
    canonical: siteUrl,
  },

  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: meta.siteName,
    title: meta.title,
    description: meta.description,
    locale: "en_IN",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: meta.image.alt,
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: meta.title,
    description: meta.description,
    images: [
      {
        url: ogImageUrl,
        alt: meta.image.alt,
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#fbf7ee",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
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