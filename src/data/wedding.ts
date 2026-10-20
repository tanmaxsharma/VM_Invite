import type { WeddingData } from "./types";

// Shown on the Reception card and above the map, so the two always read the same.
const receptionVenue = "Gyan Ganga College Campus";

export const wedding = {
  bride: {
    firstName: "Mahak",
    lastName: "Jain",
    grandparents: { lead: "Grand-Daughter of", names: ["Late Shri Sumer Chand Jain", "Late Smt. Lakshmi Jain"] },
    parents: { lead: "D/O", names: ["Mrs. Meena", "Mr. Vijay Jain"] },
  },
  groom: {
    firstName: "Vishesh",
    lastName: "Jain",
    grandparents: { lead: "Grandson of", names: ["Er. Shri Daya Chand Jain (D.C. Jain)", "Late Smt. Malti Jain"] },
    parents: { lead: "S/O", names: ["Mrs. Sapna", "Dr. Rajneet Jain"] },
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
  // The invitation wording, as approved: the mantra, then the lines around the couple's names.
  // Each name is followed by its grandparents and parents (from `groom` / `bride` above).
  hero: {
    mantra: "॥ णमो अरिहंताणं ॥",
    intro: [
      "Under the divine light of wisdom and tradition,",
      "With pure devotion, reverence, and joy,",
      "The Jain Family warmly invites you to witness and bless the sacred union of their beloved son—",
    ],
    connector: "With",
    closing: ["A sacred chapter written in love, honor, and tradition.", "Your presence will truly enrich our celebration."],
  },
  compliments: {
    heading: "With Best Compliments & Respectful Regards",
    entries: [
      { names: "Mrs. Shubhra & Mr. Shriprakash Jain", relation: "Bua Ji & Fufa Ji" },
      { names: "Mrs. Kumari & Mr. Rajneesh Bharill", relation: "Taiji & Tauji" },
      { names: "Mrs. Neetika & Dr. Nitin Jain", relation: "Chachi & Chacha" },
      { names: "Mrs. Sakhi & Mr. Ankit Jain", relation: "Sister & Brother-in-Law" },
    ],
  },
  saveTheDate: {
    instruction: "Tap below to reveal our wedding date",
    hint: "Tap each card to reveal",
    labels: { month: "Month", day: "Day", year: "Year" },
    completeMessage: "Today, we celebrate",
    continueLabel: "Scroll to continue",
    followedBy: "Followed by Grand Celebrations & Dinner",
    // The wedding itself: 7:00 PM onwards on the wedding day (as on the invitation). Google
    // Calendar needs an end, so the calendar entry keeps the previously approved 11:00 PM.
    calendar: { label: "Add to Calendar", start: "2026-11-15T19:00", end: "2026-11-15T23:00", eventName: "Wedding" },
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
      address: "Tilwara Ghat, Jabalpur, M.P., India",
      // (the place name inside this link is Google's own listing and is left exactly as copied)
      embedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3669.168937125594!2d79.87290677491534!3d23.12749947910037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3981b23559386f89%3A0xf81383f511230a67!2sGyan%20Ganga%20College%20Ground!5e0!3m2!1sen!2sin!4v1790755811690!5m2!1sen!2sin",
      // Google's place link for the same place ID as the embed above (…:0xf81383f511230a67)
      directionsUrl: "https://www.google.com/maps?cid=17875776434541365863",
    },
  },
  // RSVP opens WhatsApp with a ready-written reply to this number — the one place it is set. It is
  // printed as written; the link uses its digits (917024060333). The guest reads the message, fills
  // in the blanks and presses Send. To use a form instead, set `rsvp.url`.
  rsvp: {
    heading: "RSVP",
    message: "Please inform us if you'd like to join us by clicking on the tab.",
    button: "RSVP",
    contact: { name: "The Jain Family"},
  },
  closing: {
    heading: "With Love",
    hashtag: "#MahVieEnRose",
    // The couple's photograph (portrait). `focus` keeps the couple in frame inside the arch.
    photo: {
      src: "/images/coupleimage.png",
      alt: "Vishesh and Mahak dancing together in wedding attire",
      focus: "50% 30%",
    },
  },
  meta: {
    title: "Vishesh & Mahak | Wedding Invitation",
    description:
      "With love and blessings, we invite you to celebrate the wedding of Vishesh Jain and Mahak Jain on 15 November 2026 in Jabalpur.",
    siteUrl: "https://mahvieenrose.vercel.app",
    siteName: "Vishesh & Mahak",
    // A wide link-preview picture made from public/images/coupleimage.png (which is portrait and
    // would be cropped through the couple in a wide preview). The original is left untouched.
    image: {
      src: "/images/social/og-couple.jpg",
      alt: "Wedding invitation of Vishesh and Mahak — their photograph with the MahVieEnRose monogram, 15 November 2026, Jabalpur",
      width: 1200,
      height: 630,
    },
  },
} satisfies WeddingData;
