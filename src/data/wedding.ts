import type { WeddingData } from "./types";

// Shown on the Reception card and above the map, so the two always read the same.
const receptionVenue = "Gyan Ganga College Campus";

export const wedding = {
  bride: {
    firstName: "Mahak",
    lastName: "Jain",
    parents: { lead: "Daughter of", names: ["Smt. Meena Jain", "Shri Vijay Jain"] },
  },
  groom: {
    firstName: "Vishesh",
    lastName: "Jain",
    parents: { lead: "Son of", names: ["Smt. Sapna Jain", "Dr. Rajneet Jain"] },
  },
  nameOrder: "groom-first",
  weddingDate: "2026-11-15",
  timeZone: "Asia/Kolkata",
  // city: "…", — add the city to show it under the couple's names
  // TEMPORARY: public/audio/wedding.mp3 is "Wedding Piano" by PaulYudin
  // (Pixabay Content License). Replace the file to change the music; if it is
  // ever missing, the music control simply stays hidden.
  music: { src: "/audio/wedding.mp3" },
  // The couple's emblem, used exactly as supplied (transparent PNG). It is a supplied
  // brand asset — its lettering ("MahVieEnRose") is not the wedding data above.
  brand: {
    logo: {
      src: "/images/brand/mahvieenrose.png",
      alt: "Vishesh and Mahak monogram with a gold rose",
      width: 1536,
      height: 703,
    },
  },
  hero: {
    intro: "With the blessings of our families",
  },
  family: {
    heading: "With the Blessings of Our Elders",
    blessingLead: "Seeking the blessings of",
    grandfather: "Shri Daya Chand Jain",
    memoryLead: "and in loving memory of",
    grandmother: "Late Smt. Malti Jain",
  },
  saveTheDate: {
    instruction: "Tap below to reveal our wedding date",
    hint: "Tap each card to reveal",
    labels: { month: "Month", day: "Day", year: "Year" },
    completeMessage: "Today, we celebrate",
    continueLabel: "Scroll to continue",
    // The wedding itself, 6:00–11:00 PM IST on the wedding day.
    calendar: { label: "Add to Calendar", start: "2026-11-15T18:00", end: "2026-11-15T23:00", eventName: "Wedding" },
  },
  // Every time is IST (`timeZone` above). `start` / `end` are what each card prints; an event with
  // no `end` is open-ended there. `calendar`, where present, is what is saved to a guest's calendar
  // instead — it never changes the card. Events without it use `start` / `end` for both. An event
  // with no calendar end (Barat) is saved with a start only; none is invented.
  schedule: {
    heading: "Wedding Celebrations",
    intro: "Three days of rituals, celebrations and togetherness",
    events: [
      {
        title: "Haldi", motif: "haldi", venue: "Home", start: "2026-11-14T12:00",
        calendar: { start: "2026-11-14T12:00", end: "2026-11-14T16:00" },
      },
      { title: "Sangeet", motif: "sangeet", venue: "Welcome Hotel by ITC", start: "2026-11-14T20:00", end: "2026-11-14T23:00" },
      {
        title: "Reception", motif: "reception", venue: receptionVenue, start: "2026-11-15T19:00", end: "2026-11-15T23:00",
        // runs past midnight: it ends on the 16th
        calendar: { start: "2026-11-15T23:00", end: "2026-11-16T01:00" },
      },
      {
        title: "Barat", motif: "barat", venue: "Welcome Hotel by ITC", start: "2026-11-15T23:00",
        // one overnight event: midnight moves the date to the 16th, it ends 12:30 AM there
        calendar: { start: "2026-11-15T23:00", end: "2026-11-16T00:30" },
      },
      { title: "Rituals", motif: "rituals", venue: "Home", start: "2026-11-16T13:00", end: "2026-11-16T16:00" },
      {
        title: "Afterparty", motif: "afterparty", venue: "Riverside Burrows", start: "2026-11-16T20:00",
        // runs past midnight: it ends on the 17th
        calendar: { start: "2026-11-16T20:00", end: "2026-11-17T00:00" },
      },
    ],
  },
  locations: {
    heading: "Where We Celebrate",
    // The map shown in this section.
    //   embedUrl:      Google Maps → Share → "Embed a map" → the iframe's src
    //   directionsUrl: Google Maps → Share → "Copy link" (the button only shows once set)
    map: {
      caption: "The Reception",
      name: receptionVenue,
      // (the place name inside this link is Google's own listing and is left exactly as copied)
      embedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3669.168937125594!2d79.87290677491534!3d23.12749947910037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3981b23559386f89%3A0xf81383f511230a67!2sGyan%20Ganga%20College%20Ground!5e0!3m2!1sen!2sin!4v1790755811690!5m2!1sen!2sin",
      // Google's place link for the same place ID as the embed above (…:0xf81383f511230a67)
      directionsUrl: "https://www.google.com/maps?cid=17875776434541365863",
    },
  },
  // RSVP opens WhatsApp with a ready-written reply to this number (international format, digits
  // only). The guest reads it, fills in the blanks and presses Send. To use a form instead, set
  // `rsvp.url`; to use email, replace `whatsapp` with `email`.
  rsvp: {
    heading: "RSVP",
    message: "Please inform us if you'd like to join us by clicking on the tab.",
    button: "RSVP",
    contact: { whatsapp: "919770900400" },
  },
  closing: {
    heading: "With Love",
    hashtag: "#MahVieEnRose",
    // "shades by 43" (Unsplash License). Replace it with the couple's own
    // photograph (portrait, ideally 4:5), then update `alt` and `focus`.
    photo: {
      src: "/images/coupleimage.png",
      alt: "A bride and groom in wedding attire beneath a canopy of flowers (placeholder photograph)",
      focus: "50% 30%",
    },
  },
  meta: {
    title: "Vishesh & Mahak — Wedding Invitation",
    description: "With the blessings of their families, Vishesh & Mahak warmly invite you to celebrate their wedding.",
  },
} satisfies WeddingData;
