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

/**
 * One celebration. The date and time printed on its card are generated from `start` and `end`.
 * Its calendar entry uses the same times unless `calendar` says otherwise.
 */
export type ScheduleEvent = {
  title: string;
  motif: EventMotif;
  /** Shown on the card and used as the calendar location */
  venue: string;
  /** Local start in the wedding's `timeZone`, "YYYY-MM-DDTHH:mm" */
  start: string;
  /**
   * Local end in the same form (it may fall on the next day, e.g. past midnight).
   * Leave it out when the event is open-ended ("onwards"): no end time is invented.
   */
  end?: string;
  /**
   * The times saved to a guest's calendar, when they differ from what the card prints.
   * Same form as `start` / `end`; with no `end`, the calendar entry has a start only.
   * Leave it out and the calendar uses `start` and `end`.
   */
  calendar?: { start: string; end?: string };
};

export type MapLocation = {
  /** Venue shown above the map, e.g. "Gyan Ganga College Campus" */
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
    /** Under the heading, above the three cards */
    instruction: string;
    /** Beside the tapping hand that appears under the cards, e.g. "Tap each card to reveal" */
    hint: string;
    /** Printed on the covers of the cards */
    labels: { month: string; day: string; year: string };
    /** Replaces the countdown once the day arrives */
    completeMessage: string;
    /** Shown once the gate opens */
    continueLabel: string;
    /**
     * The main "Add to Calendar" button under the countdown. It opens Google Calendar with the event
     * filled in (and offers an .ics file for Apple and Outlook). The location is the wedding venue
     * shown in `locations`.
     */
    calendar: {
      label: string;
      /** Local start in `timeZone`, "YYYY-MM-DDTHH:mm" */
      start: string;
      /** Local end, same form. Leave out if unknown; Google's link then isn't offered, only the .ics file. */
      end?: string;
      /** The event is titled "<couple> <eventName>", e.g. "Vishesh Jain & Mahak Jain Wedding" */
      eventName: string;
    };
  };
  schedule: {
    heading: string;
    intro?: string;
    /** In chronological order — the cards appear in this order */
    events: ScheduleEvent[];
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
