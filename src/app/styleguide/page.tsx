import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { OrnamentDivider } from "@/components/decorations/OrnamentDivider";
import { CornerOrnament } from "@/components/decorations/CornerOrnament";
import { Mandala } from "@/components/decorations/Mandala";
import { FloralSprig } from "@/components/decorations/FloralSprig";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false },
};

const swatches = [
  ["parchment", ["50", "100", "200", "300"]],
  ["gold", ["300", "500", "700"]],
  ["saffron", ["300", "500", "700"]],
  ["maroon", ["300", "500", "700"]],
  ["brown", ["300", "500", "700", "900"]],
] as const;

/** Dev-only reference for the design system. Not served in production. */
export default function StyleguidePage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="mx-auto max-w-content space-y-section px-gutter py-section">
      <section className="space-y-stack">
        <p className="type-meta text-gold-700">Colour</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {swatches.map(([name, steps]) => (
            <div key={name} className="space-y-2">
              {steps.map((step) => (
                <div
                  key={step}
                  className="flex h-12 items-end rounded-card px-3 pb-1.5 text-xs shadow-soft"
                  style={{
                    background: `var(--color-${name}-${step})`,
                    color: Number(step) >= 500 ? "var(--color-parchment-50)" : "var(--color-ink)",
                  }}
                >
                  {name}-{step}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-stack">
        <p className="type-meta text-gold-700">Typography</p>
        <p className="type-display text-maroon-700">Shubh Vivah</p>
        <p className="type-names text-maroon-500">Vishesh &amp; Mehak</p>
        <h2 className="type-heading">The Celebrations</h2>
        <p className="type-subheading text-ink-soft">Two families, one beginning</p>
        <p className="type-body max-w-prose text-ink-soft">
          With the blessings of our elders, we invite you to share in the joy of our wedding.
          Your presence will make these moments complete.
        </p>
        <p className="type-meta text-gold-700">Sunday · 15 November 2026</p>
        <div className="flex flex-wrap gap-4">
          <Button>Solid button</Button>
          <Button variant="outline">Outline button</Button>
        </div>
      </section>

      <section className="space-y-stack">
        <p className="type-meta text-gold-700">Decorations</p>
        <OrnamentDivider className="mx-auto w-60 text-gold-500" />
        <div className="grid grid-cols-2 items-center gap-8 sm:grid-cols-3">
          <Mandala className="mx-auto w-40 text-gold-500 animate-spin-slow" />
          <FloralSprig className="mx-auto h-40 text-brown-500" />
          <CornerOrnament className="mx-auto w-28 text-gold-500" />
        </div>
      </section>

      <section className="space-y-stack">
        <p className="type-meta text-gold-700">Surfaces</p>
        <div className="paper frame relative mx-auto max-w-md rounded-card px-8 py-16 text-center shadow-card">
          <CornerOrnament corner="top-left" className="absolute top-3 left-3 w-14 text-gold-500" />
          <CornerOrnament corner="top-right" className="absolute top-3 right-3 w-14 text-gold-500" />
          <CornerOrnament corner="bottom-left" className="absolute bottom-3 left-3 w-14 text-gold-500" />
          <CornerOrnament corner="bottom-right" className="absolute right-3 bottom-3 w-14 text-gold-500" />
          <p className="type-meta text-gold-700">Paper · frame · card shadow</p>
          <p className="type-heading mt-4 text-maroon-500">Mehendi</p>
          <OrnamentDivider className="mx-auto mt-4 w-40 text-gold-500" />
        </div>
        <div className="paper frame mx-auto aspect-[3/4] w-48 rounded-arch shadow-card" />
      </section>
    </main>
  );
}
