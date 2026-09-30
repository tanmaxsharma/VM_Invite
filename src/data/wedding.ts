import type { WeddingData } from "./types";

export const wedding = {
  bride: { firstName: "Mehak", lastName: "Jain" },
  groom: { firstName: "Vishesh", lastName: "Jain" },
  nameOrder: "groom-first",
  weddingDate: "2026-11-15",
  timeZone: "Asia/Kolkata",
  // city: "…", — add the city to show it under the couple's names
  hashtag: "#VisheshlovesMehak",
  // Add the licensed track at public/audio/wedding.mp3. If it is missing,
  // the music control simply stays hidden.
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
  },
  closing: {
    heading: "With Love",
  },
  meta: {
    title: "Vishesh & Mehak — Wedding Invitation",
    description: "You are warmly invited to celebrate the wedding of Vishesh & Mehak.",
  },
} satisfies WeddingData;
