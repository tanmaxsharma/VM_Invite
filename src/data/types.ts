/**
 * Content schema shared by every invitation template.
 * Templates read from this shape; they never hard-code couple-specific content.
 */

export type Person = {
  firstName: string;
  lastName?: string;
  /** e.g. "Son of Mrs. … & Mr. …" — shown under the name when provided */
  parents?: string;
};

export type ScheduleEvent = {
  /** Only as provided, e.g. "Evening". Omit when no time is known — none is shown. */
  time?: string;
  title: string;
  /** Must match a `locations.places[].name` to be listed under that place */
  venue: string;
  /** Link to the venue on a map. Leave empty until a real link exists; no directions link is shown without it. */
  mapsUrl?: string;
};

export type ScheduleDay = {
  /** Display date, "<day> <month>", e.g. "14 November" */
  date: string;
  /** In chronological order */
  events: ScheduleEvent[];
};

export type Place = {
  name: string;
  /** Leave empty until the real address is known */
  address?: string;
  /** Leave empty until a real link exists; "Get directions" only shows with one */
  mapsUrl?: string;
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
  /** Shown exactly as written on the closing page */
  hashtag: string;
  /** Background music, played only after the guest opens the invitation */
  music?: {
    /** Path under /public, e.g. "/audio/wedding.mp3" */
    src: string;
  };
  invitation: {
    /** Opening blessing, e.g. "Shri Ganeshaya Namah" */
    invocation?: string;
    /** Two-line heading; the second line is set in italics */
    heading: [string, string];
    /** Each item renders on its own line */
    message: string[];
  };
  saveTheDate: {
    /** Shown on the scratch surface */
    teaser: string;
    /** Instruction under the teaser */
    hint: string;
    /** Line above the countdown */
    countdownLabel: string;
    /** Replaces the countdown once the day arrives */
    completeMessage: string;
  };
  schedule: {
    heading: string;
    intro?: string;
    /** In chronological order */
    days: ScheduleDay[];
  };
  locations: {
    heading: string;
    intro?: string;
    /** In the order they should appear */
    places: Place[];
  };
  closing: {
    heading: string;
  };
  meta: {
    title: string;
    description: string;
  };
};
