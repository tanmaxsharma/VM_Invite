import type { Person, WeddingData } from "@/data/types";
import {
  eventDateLabel,
  eventTimeLabel,
  ordinalDate,
  weddingDateParts,
  zonedTime,
} from "@/lib/format";
import { calendarAction } from "@/lib/calendar";
import { InvitationExperience } from "./InvitationExperience";
import { Compliments } from "./Compliments";
import { SaveTheDate } from "./SaveTheDate";
import { Schedule } from "./Schedule";
import { Locations } from "./Locations";
import { Rsvp } from "./Rsvp";
import type { HeroPerson } from "./Hero";
import { Closing } from "./Closing";

const fullName = (p: Person) =>
  [p.firstName, p.lastName].filter(Boolean).join(" ");

/**
 * Composition root for this invitation template (Server Component).
 * Formats data on the server and hands each section only the plain
 * values it needs.
 */
export function WeddingTemplate({ data }: { data: WeddingData }) {
  const { weddingDate, timeZone } = data;
  const couple: [Person, Person] =
    data.nameOrder === "groom-first"
      ? [data.groom, data.bride]
      : [data.bride, data.groom];
  const firstNames: [string, string] = [
    couple[0].firstName,
    couple[1].firstName,
  ];
  const place =
    [data.city, data.region].filter(Boolean).join(", ") || undefined;
  const dateLine = data.closing.date ?? ordinalDate(weddingDate, timeZone);
  const coupleNames = `${firstNames[0]} & ${firstNames[1]}`;

  // Calendar entries, built in the wedding's time zone. Each event's entry uses its `calendar` timing
  // where it has one, otherwise the same start and end its card prints. The cards always print
  // `start` / `end`, whatever the calendar entry says.
  const { calendar: main, ...saveTheDate } = data.saveTheDate;
  const fullCouple = couple.map(fullName).join(" & ");
  const coupleAnd = couple.map(fullName).join(" and ");
  const slug = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  const calendarIds = (name: string, start: string) => ({
    uid: `${slug(name)}-${start.replace(/[-:]/g, "")}@vm-invite`,
    fileName: `${firstNames.map(slug).join("-")}-${slug(name)}`,
  });
  const weddingTitle = `${fullCouple} ${main.eventName}`;

  const { map } = data.locations;
  const calendar = calendarAction({
    label: main.label,
    subject: "the wedding",
    ...calendarIds(main.eventName, main.start),
    title: weddingTitle,
    description: [
      `Wedding celebration of ${coupleAnd}.`,
      saveTheDate.followedBy && `${saveTheDate.followedBy}.`,
    ]
      .filter(Boolean)
      .join(" "),
    // the wedding venue shown on the map, with its address — not any one event's location
    location: [map.name, map.address].filter(Boolean).join(", "),
    start: main.start,
    end: main.end,
    timeZone,
  });

  const events = data.schedule.events.map((e) => {
    const when = e.calendar ?? e;
    return {
      title: e.title,
      motif: e.motif,
      venue: e.venue,
      date: eventDateLabel(e.start, e.end, timeZone),
      time: eventTimeLabel(e.start, e.end, timeZone),
      calendar: calendarAction({
        label: main.label,
        subject: e.title,
        ...calendarIds(e.title, when.start),
        title: `${e.title} — ${weddingTitle}`,
        description: `${e.title}, part of the wedding celebrations of ${coupleAnd}.`,
        location: e.venue,
        start: when.start,
        end: when.end,
        timeZone,
      }),
    };
  });

  const day = weddingDateParts(weddingDate, timeZone);

  // The message a guest sends to RSVP: written out for them in plain text, with a blank line between
  // paragraphs. They add their name and how many are coming, then press Send. Each label ends in a
  // space, so what they type doesn't run into it.
  const replyText = [
    "Congratulations to Vishesh & Mahak!",
    "",
    "We are delighted to join the wedding celebrations and extend our heartfelt wishes to the couple.",
    "",
    "With best wishes,",
    "From: ",
  ].join("\n");

  // The invitation card: each first name, then its grandparents and parents.
  const people = couple.map((p) => ({
    name: p.firstName,
    lines: [p.grandparents, p.parents]
      .filter((f) => f !== undefined)
      .map((f) => ({ lead: f.lead, names: f.names.join(" & ") })),
  })) as [HeroPerson, HeroPerson];

  return (
    <main>
      <InvitationExperience
        hero={{
          ...data.hero,
          people,
          fullNames: [fullName(couple[0]), fullName(couple[1])],
          place,
        }}
        shortNames={firstNames}
        logo={data.brand?.logo}
        musicSrc={data.music?.src}
      />

      <SaveTheDate
        {...saveTheDate}
        couple={fullCouple}
        date={day}
        time={eventTimeLabel(main.start, undefined, timeZone)}
        target={zonedTime(weddingDate, timeZone)}
        calendar={calendar}
      />

      <Schedule
        heading={data.schedule.heading}
        intro={data.schedule.intro}
        events={events}
      />

      <Locations {...data.locations} />

      <Compliments {...data.compliments} />

      <Rsvp
        {...data.rsvp}
        subject={`RSVP — ${coupleNames}`}
        replyText={replyText}
      />

      <Closing
        heading={data.closing.heading}
        names={firstNames}
        date={dateLine}
        hashtag={data.closing.hashtag}
        photo={data.closing.photo}
        logo={data.brand?.logo}
      />
    </main>
  );
}
