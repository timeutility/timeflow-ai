import { melbourne } from "@/data/locations";
import { australiaMelbourneTimezone } from "@/data/timezones";
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
    </main>
  );
}
