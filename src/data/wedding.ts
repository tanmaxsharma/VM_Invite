import type { WeddingData } from "./types";

export const wedding = {
  bride: { firstName: "Mahak", lastName: "Jain" },
  groom: { firstName: "Vishesh", lastName: "Jain" },
  nameOrder: "groom-first",
  weddingDate: "2026-11-15",
  timeZone: "Asia/Kolkata",
  // city: "…", — add the city to show it under the couple's names
  // TEMPORARY: public/audio/wedding.mp3 is "Wedding Piano" by PaulYudin
  // (Pixabay Content License). Replace the file to change the music; if it is
  // ever missing, the music control simply stays hidden.
  music: { src: "/audio/wedding.mp3" },
  invitation: {
    invocation: "Shri Ganeshaya Namah",
    heading: ["Two families,", "one beginning"],
    message: [
      "With the blessings of our elders,",
      "we invite you to share in the joy of our wedding.",
      "Your presence will make these moments complete.",
    ],
  },
  saveTheDate: {
    teaser: "Something beautiful awaits",
    hint: "Scratch to reveal",
    countdownLabel: "Until we begin forever",
    completeMessage: "Today, we celebrate",
  },
  // Add `mapsUrl` to an event once the real location link is known.
  schedule: {
    heading: "Wedding Celebrations",
    intro: "Three days of rituals, celebrations and togetherness",
    days: [
      {
        date: "14 November",
        events: [
          { time: "Afternoon", title: "Haldi", venue: "Home" },
          { time: "Evening", title: "Sangeet", venue: "Welcome Hotel by ITC" },
        ],
      },
      {
        date: "15 November",
        events: [
          { title: "Reception", venue: "Gyan Ganga College Ground" },
          { time: "Midnight", title: "Barat", venue: "Welcome Hotel by ITC" },
        ],
      },
      {
        date: "16 November",
        events: [
          { time: "Afternoon", title: "Rituals", venue: "Home" },
          { time: "Evening", title: "Afterparty", venue: "Farmhouse" },
        ],
      },
    ],
  },
  // Names must match the schedule's `venue` values. Add `address` / `mapsUrl`
  // once the real details are known — nothing is shown for them until then.
  locations: {
    heading: "Where We Celebrate",
    intro: "With our loved ones, across the places that make these celebrations special.",
    places: [
      { name: "Home" },
      { name: "Welcome Hotel by ITC" },
      { name: "Gyan Ganga College Ground" },
      { name: "Farmhouse" },
    ],
    // The map shown in this section.
    //   embedUrl:      Google Maps → Share → "Embed a map" → the iframe's src
    //   directionsUrl: Google Maps → Share → "Copy link" (the button only shows once set)
    map: {
      name: "Gyan Ganga College Ground",
      embedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3669.168937125594!2d79.87290677491534!3d23.12749947910037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3981b23559386f89%3A0xf81383f511230a67!2sGyan%20Ganga%20College%20Ground!5e0!3m2!1sen!2sin!4v1790755811690!5m2!1sen!2sin",
      directionsUrl: "",
    },
  },
  closing: {
    heading: "With Love",
    hashtag: "#MahVieEnRose",
    // TEMPORARY: public/images/couple-placeholder.jpg is a stock photo by
    // "shades by 43" (Unsplash License). Replace it with the couple's own
    // photograph (portrait, ideally 4:5), then update `alt` and `focus`.
    photo: {
      src: "/images/couple-placeholder.jpg",
      alt: "A bride and groom in wedding attire beneath a canopy of flowers (placeholder photograph)",
      focus: "50% 30%",
    },
  },
  meta: {
    title: "Vishesh & Mahak — Wedding Invitation",
    description: "Together with their families, Vishesh & Mahak warmly invite you to celebrate their wedding.",
  },
} satisfies WeddingData;
