import type { Person, WeddingData } from "@/data/types";
import { ordinalDate, weddingDateParts, zonedTime } from "@/lib/format";
import { InvitationExperience } from "./InvitationExperience";
import { Invitation } from "./Invitation";
import { SaveTheDate } from "./SaveTheDate";
import { Schedule } from "./Schedule";
import { Locations, type LocationEntry } from "./Locations";
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
  const role = (p: Person) => (p === data.groom ? "The Groom" : "The Bride");

  // Each place lists the celebrations the schedule holds there.
  const places: LocationEntry[] = data.locations.places.map((p) => ({
    ...p,
    occasions: data.schedule.days.flatMap((day) =>
      day.events.filter((e) => e.venue === p.name).map((e) => ({ title: e.title, date: day.date })),
    ),
  }));

  return (
    <main>
      <InvitationExperience
        names={[fullName(couple[0]), fullName(couple[1])]}
        shortNames={firstNames}
        place={place}
        musicSrc={data.music?.src}
      />

      <Invitation
        {...data.invitation}
        families={[
          { role: role(couple[0]), name: fullName(couple[0]), parents: couple[0].parents },
          { role: role(couple[1]), name: fullName(couple[1]), parents: couple[1].parents },
        ]}
        place={place}
      />

      <SaveTheDate
        {...data.saveTheDate}
        couple={firstNames.join(" & ")}
        date={weddingDateParts(weddingDate, timeZone)}
        target={zonedTime(weddingDate, timeZone)}
      />

      <Schedule {...data.schedule} />

      <Locations {...data.locations} places={places} />

      <Closing
        heading={data.closing.heading}
        names={firstNames}
        date={data.closing.date ?? ordinalDate(weddingDate, timeZone)}
        hashtag={data.closing.hashtag}
        photo={data.closing.photo}
      />
    </main>
  );
}
