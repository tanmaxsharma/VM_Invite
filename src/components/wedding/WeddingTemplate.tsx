import type { Person, WeddingData } from "@/data/types";
import { clockTime, ordinalDate, weddingDateParts, zonedTime } from "@/lib/format";
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

  // "Add to Calendar": the wedding's start time on the wedding day, as one UTC instant.
  const { calendar: calendarData, ...saveTheDate } = data.saveTheDate;
  const fullCouple = couple.map(fullName).join(" & ");
  const calendar = {
    label: calendarData.label,
    title: `${fullCouple} — ${calendarData.eventName}`,
    description: `The wedding of ${fullCouple}.\n${dateLine}, ${clockTime(weddingDate, timeZone, calendarData.startTime)}`,
    start: zonedTime(weddingDate, timeZone, calendarData.startTime),
    uid: `wedding-${weddingDate}-${calendarData.startTime.replace(":", "")}@vm-invite`,
    fileName: `${firstNames.join("-")}-${calendarData.eventName}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  };

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

      <Schedule {...data.schedule} />

      <Locations {...data.locations} />

      <Rsvp
        {...data.rsvp}
        subject={`RSVP — ${coupleNames}`}
        replyText={`Namaste! We would be delighted to join the wedding celebrations of ${coupleNames} on ${dateLine}.

Name:
Number of guests:`}
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
