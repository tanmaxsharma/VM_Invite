import type { ComponentProps } from "react";

type OrnateLinkProps = ComponentProps<"a"> & {
  /** "line": small caps over a gold hairline. "solid": a wine plate with a gold edge, for the one main action. */
  variant?: "line" | "solid";
};

/**
 * Invitation-style link: small caps between gold diamonds.
 * Matches the "Open Invitation" control.
 */
export function OrnateLink({ children, className = "", variant = "line", ...props }: OrnateLinkProps) {
  const diamond =
    "size-1.5 rotate-45 border transition-colors duration-500";

  if (variant === "solid") {
    return (
      <a
        {...props}
        className={`group inline-flex min-h-12 items-center justify-center gap-3.5 rounded-[2px] border border-gold-500 bg-maroon-500 px-9 text-parchment-50 shadow-soft outline-1 -outline-offset-4 outline-gold-300/40 transition-[background-color,box-shadow] duration-500 hover:bg-maroon-700 hover:shadow-gold ${className}`}
      >
        <span aria-hidden className={`${diamond} border-gold-300 group-hover:bg-gold-300`} />
        <span className="type-button">{children}</span>
        <span aria-hidden className={`${diamond} border-gold-300 group-hover:bg-gold-300`} />
      </a>
    );
  }

  return (
    <a
      {...props}
      className={`group inline-flex min-h-12 flex-col items-center justify-center px-4 text-maroon-500 ${className}`}
    >
      <span className="flex items-center gap-3">
        <span aria-hidden className={`${diamond} border-gold-500 group-hover:bg-gold-500`} />
        <span className="type-button">{children}</span>
        <span aria-hidden className={`${diamond} border-gold-500 group-hover:bg-gold-500`} />
      </span>
      <span
        aria-hidden
        className="mt-2.5 h-px w-full bg-linear-to-r from-transparent via-gold-500 to-transparent transition-transform duration-700 ease-cinematic group-hover:scale-x-110"
      />
    </a>
  );
}
