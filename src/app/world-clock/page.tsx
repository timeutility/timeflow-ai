import { melbourne, newYork } from "@/data/locations";
import {
  australiaMelbourneTimezone,
  americaNewYorkTimezone,
} from "@/data/timezones";

import TimeComparison from "./TimeComparison";
import WorldClockExperience from "./WorldClockExperience";

export default function WorldClockPage() {
  return (
    <main>
      <h1>World Clock</h1>
      <p>Time around the world</p>

      <WorldClockExperience />

       <TimeComparison
        firstName={melbourne.canonical_name}
        firstIanaIdentifier={australiaMelbourneTimezone.iana_identifier}
        secondName={newYork.canonical_name}
        secondIanaIdentifier={americaNewYorkTimezone.iana_identifier}
      />
    </main>
  );
}