import type { ComponentProps } from "react";

type OrnateLinkProps = ComponentProps<"a"> & {
  /**
   * "line": small caps over a gold hairline.
   * "solid": a large wine plate with a gold edge and an inner hairline, for the one main action.
   */
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
    // The inner hairline is a pseudo-element (not an outline) so the keyboard focus ring still shows.
    return (
      <a
        {...props}
        className={`group relative inline-flex min-h-14 min-w-[14rem] items-center justify-center gap-4 rounded-[2px] border border-gold-500 bg-maroon-500 px-12 text-parchment-50 shadow-soft transition-[background-color,box-shadow,transform] duration-300 before:pointer-events-none before:absolute before:inset-[4px] before:border before:border-gold-300/45 before:transition-colors before:duration-500 hover:bg-maroon-700 hover:shadow-gold hover:before:border-gold-300/80 active:scale-[0.98] active:bg-[color-mix(in_oklab,var(--color-maroon-700)_85%,black)] ${className}`}
      >
        <span aria-hidden className="size-2 rotate-45 border border-gold-300 transition-colors duration-500 group-hover:bg-gold-300" />
        <span className="type-button text-[0.9375rem]! tracking-[0.24em]!">{children}</span>
        <span aria-hidden className="size-2 rotate-45 border border-gold-300 transition-colors duration-500 group-hover:bg-gold-300" />
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
