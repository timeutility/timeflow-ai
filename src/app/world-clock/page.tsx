import { melbourne } from "@/data/locations";
import { australiaMelbourneTimezone } from "@/data/timezones";
import { evaluateTemporalState } from "@/lib/temporal/evaluateTemporalState";

export default function WorldClockPage() {
  const temporalState = evaluateTemporalState({
    entity_id: melbourne.entity_id,
    iana_identifier: australiaMelbourneTimezone.iana_identifier,
    reference_instant: new Date(),
  });

  return (
    <main>
      <h1>World Clock</h1>
      <p>Time around the world</p>

      <h2>{melbourne.canonical_name}</h2>
      <p>{temporalState.local_datetime}</p>
    </main>
  );
}