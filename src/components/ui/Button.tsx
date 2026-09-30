import type { ComponentProps } from "react";

type Variant = "solid" | "outline";

const base =
  "type-button inline-flex min-h-12 items-center justify-center gap-3 rounded-pill px-8 transition-[background-color,color,border-color,box-shadow] duration-500 ease-cinematic";

const variants: Record<Variant, string> = {
  solid:
    "bg-maroon-500 text-parchment-50 shadow-soft hover:bg-maroon-700 hover:shadow-gold",
  outline:
    "border border-gold-500 text-maroon-500 hover:border-maroon-500 hover:bg-maroon-500 hover:text-parchment-50",
};

type ButtonProps = { variant?: Variant } & (
  | ({ href: string } & ComponentProps<"a">)
  | ({ href?: undefined } & ComponentProps<"button">)
);

/** Renders an `<a>` when `href` is given, otherwise a `<button>`. */
export function Button({ variant = "solid", className = "", ...props }: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (props.href !== undefined) {
    return <a className={classes} {...(props as ComponentProps<"a">)} />;
  }
  return <button type="button" className={classes} {...(props as ComponentProps<"button">)} />;
}
