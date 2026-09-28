import { melbourne, newYork } from "@/data/locations";
import {
  australiaMelbourneTimezone,
  americaNewYorkTimezone,
} from "@/data/timezones";
import LiveClock from "./LiveClock";
export default function WorldClockPage() {
  return (
    <main>
      <h1>World Clock</h1>
      <p>Time around the world</p>

      <h2>{melbourne.canonical_name}</h2>
      <LiveClock
        entityId={melbourne.entity_id}
        ianaIdentifier={australiaMelbourneTimezone.iana_identifier}
      />

      <h2>{newYork.canonical_name}</h2>
      <LiveClock
        entityId={newYork.entity_id}
        ianaIdentifier={americaNewYorkTimezone.iana_identifier}
      />
    </main>
  );
}