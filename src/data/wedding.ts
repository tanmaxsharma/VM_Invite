import type { WeddingData } from "./types";

export const wedding = {
  bride: {
    firstName: "Mehak",
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
      alt: "Vishesh and Mehak monogram with a gold rose",
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
    instruction: "Scratch below to reveal our wedding date",
    labels: { month: "Month", day: "Day", year: "Year" },
    completeMessage: "Today, we celebrate",
    continueLabel: "Scroll to continue",
    // 7:00 PM IST on the wedding day. Only a start time is given, so the .ics file has no end time.
    calendar: { label: "Add to Calendar", startTime: "19:00", eventName: "Wedding" },
  },
  schedule: {
    heading: "Wedding Celebrations",
    intro: "Three days of rituals, celebrations and togetherness",
    days: [
      {
        date: "14 November",
        events: [
          { time: "Afternoon", title: "Haldi", motif: "haldi", venue: "Home" },
          { time: "Evening", title: "Sangeet", motif: "sangeet", venue: "Welcome Hotel by ITC" },
        ],
      },
      {
        date: "15 November",
        events: [
          { title: "Reception", motif: "reception", venue: "Gyan Ganga College Ground" },
          { time: "Midnight", title: "Barat", motif: "barat", venue: "Welcome Hotel by ITC" },
        ],
      },
      {
        date: "16 November",
        events: [
          { time: "Afternoon", title: "Rituals", motif: "rituals", venue: "Home" },
          { time: "Evening", title: "Afterparty", motif: "afterparty", venue: "Farmhouse" },
        ],
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
      name: "Gyan Ganga College Ground",
      embedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3669.168937125594!2d79.87290677491534!3d23.12749947910037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3981b23559386f89%3A0xf81383f511230a67!2sGyan%20Ganga%20College%20Ground!5e0!3m2!1sen!2sin!4v1790755811690!5m2!1sen!2sin",
      // Google's place link for the same place ID as the embed above (…:0xf81383f511230a67)
      directionsUrl: "https://www.google.com/maps?cid=17875776434541365863",
    },
  },
  // RSVP opens a ready-written reply. Set `rsvp.contact.whatsapp` (e.g. "919876543210") or
  // `rsvp.contact.email` to send it straight to the hosts, or `rsvp.url` to open a form instead.
  rsvp: {
    heading: "RSVP",
    message: "We would be delighted to celebrate with you.",
    button: "RSVP",
  },
  closing: {
    heading: "With Love",
    hashtag: "#VisheshlovesMehak",
    // TEMPORARY: public/images/couple-placeholder.jpg is a stock photo by
    // "shades by 43" (Unsplash License). Replace it with the couple's own
    // photograph (portrait, ideally 4:5), then update `alt` and `focus`.
    photo: {
      src: "/images/coupleimage.png",
      alt: "A bride and groom in wedding attire beneath a canopy of flowers (placeholder photograph)",
      focus: "50% 30%",
    },
  },
  meta: {
    title: "Vishesh & Mehak — Wedding Invitation",
    description: "With the blessings of their families, Vishesh & Mehak warmly invite you to celebrate their wedding.",
  },
} satisfies WeddingData;
