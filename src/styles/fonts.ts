import { Cormorant_Garamond, Jost } from "next/font/google";

export const displayFont = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

export const sansFont = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});
