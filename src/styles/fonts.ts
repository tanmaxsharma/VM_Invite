import { Cormorant_Garamond, Jost, Tiro_Devanagari_Sanskrit } from "next/font/google";

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

/** Only for the mantra at the top of the invitation (Devanagari) */
export const devanagariFont = Tiro_Devanagari_Sanskrit({
  variable: "--font-tiro-devanagari",
  subsets: ["devanagari"],
  weight: "400",
});
