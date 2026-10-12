"use client";

import { useRef, type CSSProperties } from "react";
import { gsap, prefersReducedMotion, useGsap } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { Mask } from "@/components/ui/Mask";
import { OrnateLink } from "@/components/ui/OrnateLink";
import { EventArtwork } from "@/components/decorations/EventArtwork";
import { OrnamentDivider } from "@/components/decorations/OrnamentDivider";

type RsvpProps = {
  heading: string;
  message: string;
  button: string;
  /** The reply the guest sends, already written out (names and date included) */
  replyText: string;
  /** Used in the subject line when replying by email */
  subject: string;
  url?: string;
  contact?: { whatsapp?: string; email?: string };
};

/** A form, the hosts' WhatsApp, their email — or, with none set, a WhatsApp chat the guest picks. */
function replyHref({ url, contact, replyText, subject }: Pick<RsvpProps, "url" | "contact" | "replyText" | "subject">) {
  if (url) return url;
  const text = encodeURIComponent(replyText);
  if (contact?.whatsapp) return `https://wa.me/${contact.whatsapp}?text=${text}`;
  if (contact?.email) return `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${text}`;
  return `https://wa.me/?text=${text}`;
}

const artPalette = {
  "--art": "#c27a3a",
  "--art-2": "#e8a33a",
  "--art-3": "#b08d45",
  "--leaf": "#8b9870",
} as CSSProperties;

/** The reply: one line of welcome and one button, like the response card tucked into an invitation. */
export function Rsvp({ heading, message, button, replyText, subject, url, contact }: RsvpProps) {
  const root = useRef<HTMLElement>(null);

  useGsap(() => {
    if (prefersReducedMotion()) return;
    gsap
      .timeline({ defaults: { ease: ease.cinematicGsap }, scrollTrigger: { trigger: root.current, start: "top 75%" } })
      .from("[data-r=art]", { autoAlpha: 0, y: 14, scale: 0.94, duration: 1.6 }, 0)
      .from("[data-r=heading]", { yPercent: 105, duration: 1.5 }, 0.2)
      .from("[data-r=message]", { autoAlpha: 0, y: 12, duration: 1.3 }, 0.5)
      .from("[data-r=button]", { autoAlpha: 0, y: 12, duration: 1.3 }, 0.8);
  }, root);

  const external = /^https?:/.test(replyHref({ url, contact, replyText, subject }));

  return (
    <section
      ref={root}
      id="rsvp"
      aria-labelledby="rsvp-heading"
      className="relative overflow-x-clip px-gutter pb-section text-center"
    >
      <div className="mx-auto max-w-[26rem]">
        <EventArtwork data-r="art" motif="rituals" className="mx-auto w-28 md:w-32" style={artPalette} />

        <h2 id="rsvp-heading" className="type-heading mt-4 uppercase tracking-[0.2em] text-maroon-500">
          <Mask>
            <span data-r="heading" className="block">
              {heading}
            </span>
          </Mask>
        </h2>

        <OrnamentDivider className="mx-auto mt-4 w-28 text-gold-500" />

        <p data-r="message" className="type-subheading mx-auto mt-5 max-w-[18rem] italic text-ink-soft md:max-w-none">
          {message}
        </p>

        <div data-r="button" className="mt-8">
          <OrnateLink
            variant="solid"
            href={replyHref({ url, contact, replyText, subject })}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {button}
          </OrnateLink>
        </div>
      </div>
    </section>
  );
}
