import type { ComponentProps } from "react";

/**
 * Invitation-style link: small caps between gold diamonds over a hairline.
 * Matches the "Open Invitation" control.
 */
export function OrnateLink({ children, className = "", ...props }: ComponentProps<"a">) {
  return (
    <a
      {...props}
      className={`group inline-flex min-h-12 flex-col items-center justify-center px-4 text-maroon-500 ${className}`}
    >
      <span className="flex items-center gap-3">
        <span aria-hidden className="size-1.5 rotate-45 border border-gold-500 transition-colors duration-500 group-hover:bg-gold-500" />
        <span className="type-button">{children}</span>
        <span aria-hidden className="size-1.5 rotate-45 border border-gold-500 transition-colors duration-500 group-hover:bg-gold-500" />
      </span>
      <span
        aria-hidden
        className="mt-2.5 h-px w-full bg-linear-to-r from-transparent via-gold-500 to-transparent transition-transform duration-700 ease-cinematic group-hover:scale-x-110"
      />
    </a>
  );
}
