/**
 * Content schema shared by every invitation template.
 * Templates read from this shape; they never hard-code couple-specific content.
 */

export type Parents = {
  /** e.g. "Son of" / "Daughter of" */
  lead: string;
  /** Shown joined with "&", in this order */
  names: [string, string];
};

export type Person = {
  firstName: string;
  lastName?: string;
  parents?: Parents;
};

/** An image shown at its natural proportions (never cropped). */
export type Artwork = {
  /** Path under /public */
  src: string;
  alt: string;
  /** Intrinsic pixel size, used for the layout ratio and optimisation */
  width: number;
  height: number;
};

export type Photo = {
  /** Path under /public */
  src: string;
  alt: string;
  /** CSS object-position, used to keep faces in frame, e.g. "50% 30%" */
  focus?: string;
};

/** Selects the artwork and palette of an event card */
export type EventMotif = "haldi" | "sangeet" | "reception" | "barat" | "rituals" | "afterparty";

export type ScheduleEvent = {
  /** Only as provided, e.g. "Evening". Omit when no time is known — none is shown. */
  time?: string;
  title: string;
  motif: EventMotif;
  venue: string;
};

export type ScheduleDay = {
  /** Display date, "<day> <month>", e.g. "14 November" */
  date: string;
  /** In chronological order */
  events: ScheduleEvent[];
};

export type MapLocation = {
  /** Venue shown above the map, e.g. "Gyan Ganga College Ground" */
  name: string;
  /** Small line above the venue name, e.g. "The Reception" */
  caption?: string;
  /** Optional line under the name */
  address?: string;
  /** Google Maps "Embed a map" src (https://www.google.com/maps/embed?pb=…). Empty → no map is shown. */
  embedUrl: string;
  /** Google Maps share link. Empty → no "Get directions" button. */
  directionsUrl?: string;
};

export type WeddingData = {
  bride: Person;
  groom: Person;
  /** Whose name is written first throughout the invitation */
  nameOrder: "groom-first" | "bride-first";
  /** Calendar date of the wedding, "YYYY-MM-DD" */
  weddingDate: string;
  /** IANA time zone the wedding takes place in; dates and the countdown use it */
  timeZone: string;
  /** Shown under the couple's names when provided */
  city?: string;
  /** Optional line after the city, e.g. the state */
  region?: string;
  /** The couple's own emblem — shown on the wax seal and, small, in the closing. Used exactly as supplied. */
  brand?: {
    logo: Artwork;
  };
  /** Background music, played only after the guest opens the invitation */
  music?: {
    /** Path under /public, e.g. "/audio/wedding.mp3" */
    src: string;
  };
  hero: {
    /** The short line above the couple's names */
    intro: string;
  };
  /** Traditional blessing hierarchy — the elders, then the son's parents */
  family: {
    heading: string;
    /** Introduces the living grandfather, e.g. "Seeking the blessings of" */
    blessingLead: string;
    grandfather: string;
    /** Introduces the grandmother who has passed, e.g. "and in loving memory of" */
    memoryLead: string;
    grandmother: string;
  };
  saveTheDate: {
    /** Under the heading, above the three scratch cards */
    instruction: string;
    /** Printed on the scratch surfaces */
    labels: { month: string; day: string; year: string };
    /** Replaces the countdown once the day arrives */
    completeMessage: string;
    /** Shown once the gate opens */
    continueLabel: string;
    /** The "Add to Calendar" button under the countdown (downloads an .ics file) */
    calendar: {
      label: string;
      /** When the wedding starts on `weddingDate`, 24-hour "HH:mm" in `timeZone`. No end time is written. */
      startTime: string;
      /** The event is titled "<couple> — <eventName>" */
      eventName: string;
    };
  };
  schedule: {
    heading: string;
    intro?: string;
    /** In chronological order */
    days: ScheduleDay[];
  };
  locations: {
    heading: string;
    /** The map shown in this section */
    map: MapLocation;
  };
  /** The reply to the hosts. Wire it up with `url`, or `contact`; with neither, guests choose a WhatsApp chat to send to. */
  rsvp: {
    heading: string;
    message: string;
    button: string;
    /** A form or link to open instead (takes priority) */
    url?: string;
    /** Where the reply message is sent */
    contact?: {
      /** International format without "+", e.g. "919876543210" */
      whatsapp?: string;
      email?: string;
    };
  };
  closing: {
    heading: string;
    /** Optional override; by default the wedding date is written out, e.g. "15th November 2026" */
    date?: string;
    /** Shown exactly as written */
    hashtag: string;
    photo: Photo;
  };
  meta: {
    title: string;
    description: string;
  };
};
