import type { Metadata, Viewport } from "next";
import { wedding } from "@/data/wedding";
import { displayFont, sansFont } from "@/styles/fonts";
import { Providers } from "@/components/providers/Providers";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: wedding.meta.title,
  description: wedding.meta.description,
};

export const viewport: Viewport = {
  themeColor: "#fbf7ee",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${sansFont.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
