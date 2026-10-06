const UNITS = 48; // enough to span 1700px; the container clips the rest
const LEAF = "M0 0c3-7 3-15 0-22-3 7-3 15 0 22z";

/**
 * A bandhanwar / toran: a scalloped cord with alternating marigold strings and
 * mango leaves. Built from small fixed-size units so it spans any width without
 * stretching; the parent clips the overflow.
 */
export function Toran({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`flex overflow-hidden ${className}`}>
      {Array.from({ length: UNITS }, (_, i) => {
        const beads = i % 4 === 0 ? 5 : 3;
        return (
          <svg key={i} viewBox="0 0 34 64" className="h-full w-auto shrink-0 overflow-visible">
            <path d="M0 3Q17 12 34 3" fill="none" stroke="var(--color-gold-500)" strokeWidth={1.2} />
            {i % 2 === 0 ? (
              <g>
                {Array.from({ length: beads }, (_, b) => (
                  <circle
                    key={b}
                    cx={17}
                    cy={13 + b * 9}
                    r={5 - b * 0.35}
                    fill={b % 2 ? "var(--color-saffron-300)" : "var(--color-saffron-500)"}
                  />
                ))}
                <circle cx={17} cy={13 + beads * 9 - 3} r={1.4} fill="var(--color-gold-500)" />
              </g>
            ) : (
              <g transform="translate(17 9)">
                {/* the leaf path points up; flip it so it hangs from the cord */}
                <path d={LEAF} transform="scale(1 -1)" fill="#8b9870" opacity={0.9} />
                <circle r={2.2} fill="var(--color-maroon-300)" />
              </g>
            )}
          </svg>
        );
      })}
    </div>
  );
}
