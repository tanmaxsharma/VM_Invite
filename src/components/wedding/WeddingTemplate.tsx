import type { Person, WeddingData } from "@/data/types";
import { eventDateLabel, eventTimeLabel, ordinalDate, weddingDateParts, zonedTime } from "@/lib/format";
import { calendarAction } from "@/lib/calendar";
import { InvitationExperience } from "./InvitationExperience";
import { Blessings } from "./Blessings";
import { SaveTheDate } from "./SaveTheDate";
import { Schedule } from "./Schedule";
import { Locations } from "./Locations";
import { Rsvp } from "./Rsvp";
import type { HeroPerson } from "./Hero";
import { Closing } from "./Closing";

const fullName = (p: Person) => [p.firstName, p.lastName].filter(Boolean).join(" ");

/**
 * Composition root for this invitation template (Server Component).
 * Formats data on the server and hands each section only the plain
 * values it needs.
 */
export function WeddingTemplate({ data }: { data: WeddingData }) {
  const { weddingDate, timeZone } = data;
  const couple: [Person, Person] =
    data.nameOrder === "groom-first" ? [data.groom, data.bride] : [data.bride, data.groom];
  const firstNames: [string, string] = [couple[0].firstName, couple[1].firstName];
  const place = [data.city, data.region].filter(Boolean).join(", ") || undefined;
  const dateLine = data.closing.date ?? ordinalDate(weddingDate, timeZone);
  const coupleNames = `${firstNames[0]} & ${firstNames[1]}`;

  // Calendar entries, built in the wedding's time zone. Each event's entry uses its `calendar` timing
  // where it has one, otherwise the same start and end its card prints. The cards always print
  // `start` / `end`, whatever the calendar entry says.
  const { calendar: main, ...saveTheDate } = data.saveTheDate;
  const fullCouple = couple.map(fullName).join(" & ");
  const coupleAnd = couple.map(fullName).join(" and ");
  const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const calendarIds = (name: string, start: string) => ({
    uid: `${slug(name)}-${start.replace(/[-:]/g, "")}@vm-invite`,
    fileName: `${firstNames.map(slug).join("-")}-${slug(name)}`,
  });
  const weddingTitle = `${fullCouple} ${main.eventName}`;

  const calendar = calendarAction({
    label: main.label,
    subject: "the wedding",
    ...calendarIds(main.eventName, main.start),
    title: weddingTitle,
    description: `Wedding celebration of ${coupleAnd}.`,
    // the wedding venue shown on the map, not any one event's location
    location: data.locations.map.name,
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

  // The message a guest sends to RSVP: written out for them, with blanks to fill in.
  const day = weddingDateParts(weddingDate, timeZone);
  const replyText = [
    `Hello, I would like to RSVP for the wedding of ${coupleAnd} on ${day.day} ${day.month} ${day.year}. Please find my response below.`,
    "Name:",
    "Number of guests attending:",
    "Events attending:",
    "Dietary preferences (if any):",
    "Thank you.",
  ].join("\n");

  const people = couple.map((p) => ({
    name: fullName(p),
    lead: p.parents?.lead,
    parents: p.parents?.names.join(" & "),
  })) as [HeroPerson, HeroPerson];

  return (
    <main>
      <InvitationExperience
        intro={data.hero.intro}
        people={people}
        shortNames={firstNames}
        place={place}
        logo={data.brand?.logo}
        musicSrc={data.music?.src}
      />

      <SaveTheDate
        {...saveTheDate}
        couple={fullCouple}
        date={weddingDateParts(weddingDate, timeZone)}
        dateLine={dateLine}
        target={zonedTime(weddingDate, timeZone)}
        calendar={calendar}
      />

      {data.groom.parents && <Blessings {...data.family} parents={data.groom.parents} />}

      <Schedule heading={data.schedule.heading} intro={data.schedule.intro} events={events} />

      <Locations {...data.locations} />

      <Rsvp {...data.rsvp} subject={`RSVP — ${coupleNames}`} replyText={replyText} />

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
