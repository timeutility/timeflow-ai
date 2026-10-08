"use client";

import { melbourne, newYork } from "@/data/locations";
import { supportedTimezones } from "@/data/timezones";

const supportedLocations = [melbourne, newYork];

export default function MeetingTimePlannerExperience() {
  return (
    <section>
      <h2>Meeting Planner</h2>

      <p>Supported meeting locations:</p>

      <ul>
        {supportedLocations.map((location) => {
          const timezone = supportedTimezones.find(
            (item) => item.entity_id === location.timezone_entity_id
          );

          return (
            <li key={location.entity_id}>
              {location.canonical_name} —{" "}
              {timezone?.iana_identifier ?? "Timezone unavailable"}
            </li>
          );
        })}
      </ul>
    </section>
  );
}