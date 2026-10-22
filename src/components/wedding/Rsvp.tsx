"use client";

import { useRef, type CSSProperties } from "react";
import { gsap, prefersReducedMotion, useGsap } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { useInViewOnce } from "@/lib/useInViewOnce";
import { whatsappUrl } from "@/lib/whatsapp";
import { Mask } from "@/components/ui/Mask";
import { OrnateLink } from "@/components/ui/OrnateLink";
import { EventArtwork } from "@/components/decorations/EventArtwork";
import { OrnamentDivider } from "@/components/decorations/OrnamentDivider";
import { TapHand } from "@/components/decorations/TapHand";

type RsvpProps = {
  heading: string;
  message: string;
  button: string;
  /** The reply the guest sends, already written out (names and date included) */
  replyText: string;
  /** Used in the subject line when replying by email */
  subject: string;
  url?: string;
  contact?: { name?: string; whatsapp?: string; email?: string };
};

/** A form, the hosts' WhatsApp, their email — or, with none set, a WhatsApp chat the guest picks. */
function replyHref({ url, contact, replyText, subject }: Pick<RsvpProps, "url" | "contact" | "replyText" | "subject">) {
  if (url) return url;
  if (contact?.whatsapp) return whatsappUrl(contact.whatsapp, replyText);
  if (contact?.email) return `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(replyText)}`;
  return whatsappUrl(undefined, replyText);
}

const artPalette = {
  "--art": "#c27a3a",
  "--art-2": "#e8a33a",
  "--art-3": "#b08d45",
  "--leaf": "#8b9870",
} as CSSProperties;

/** The reply: a line of welcome, a hand pointing the way, and one large button — like the response card tucked into an invitation. */
export function Rsvp({ heading, message, button, replyText, subject, url, contact }: RsvpProps) {
  const root = useRef<HTMLElement>(null);
  const action = useRef<HTMLDivElement>(null);
  const seen = useInViewOnce(action, 0.8);

  useGsap(() => {
    if (prefersReducedMotion()) return;
    gsap
      .timeline({ defaults: { ease: ease.cinematicGsap }, scrollTrigger: { trigger: root.current, start: "top 75%" } })
      .from("[data-r=art]", { autoAlpha: 0, y: 14, scale: 0.94, duration: 1.6 }, 0)
      .from("[data-r=heading]", { yPercent: 105, duration: 1.5 }, 0.2)
      .from("[data-r=message]", { autoAlpha: 0, y: 12, duration: 1.3 }, 0.5)
      .from("[data-r=hand]", { autoAlpha: 0, duration: 1.2 }, 0.8)
      .from("[data-r=button]", { autoAlpha: 0, y: 12, duration: 1.3 }, 0.8);
  }, root);

  const href = replyHref({ url, contact, replyText, subject });
  const external = /^https?:/.test(href);
  const viaWhatsApp = href.startsWith("https://wa.me/");

  return (
    <section
      ref={root}
      id="rsvp"
      aria-labelledby="rsvp-heading"
      className="relative overflow-x-clip px-gutter pt-[calc(var(--spacing-section)*0.8)] pb-section text-center"
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

        <p data-r="message" className="type-subheading mx-auto mt-5 max-w-[19rem] italic text-ink-soft md:max-w-[24rem]">
          {message}
        </p>

        <div ref={action} className="mt-6 flex flex-col items-center md:mt-7">
          {/* the hand points down at the button; its tapping starts once it has come into view */}
          <div data-r="hand">
            <TapHand direction="down" play={seen} className="w-9 md:w-10" />
          </div>

          <div data-r="button" className="mt-2">
            <OrnateLink
              variant="solid"
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              {...(viaWhatsApp ? { "aria-label": `${button} on WhatsApp (opens in a new tab)` } : {})}
            >
              {button}
            </OrnateLink>
          </div>

          {viaWhatsApp && (
            <p data-r="button" className="font-display mt-4 text-[1.125rem] font-medium italic text-ink-soft">
              Opens WhatsApp, with your reply ready to send
            </p>
          )}

          {/* who the replies go to, and the same number for anyone who would rather call */}
          {contact?.name && (
            <div data-r="button" className="mt-8">
              <OrnamentDivider className="mx-auto w-20 text-gold-500/80" />
              <p className="font-display mt-4 text-[1.375rem] font-medium text-maroon-500 md:text-[1.5rem]">{contact.name}</p>
              {contact.whatsapp && (
                <a
                  href={`tel:+${contact.whatsapp.replace(/\D/g, "")}`}
                  aria-label={`Call ${contact.name} on ${contact.whatsapp}`}
                  className="font-display mt-1 inline-flex min-h-11 items-center px-2 text-[1.125rem] font-medium tracking-[0.04em] text-gold-700 lining-nums underline decoration-gold-500/40 underline-offset-4 transition-colors duration-500 hover:text-maroon-500"
                >
                  {contact.whatsapp}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
