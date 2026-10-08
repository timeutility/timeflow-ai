"use client";

import { useState } from "react";
import { melbourne, newYork } from "@/data/locations";
import { supportedTimezones } from "@/data/timezones";

const supportedLocations = [melbourne, newYork];

function getTimezoneForLocation(locationId: string) {
  const location = supportedLocations.find(
    (item) => item.entity_id === locationId
  );

  return supportedTimezones.find(
    (timezone) => timezone.entity_id === location?.timezone_entity_id
  );
}

export default function MeetingTimePlannerExperience() {
  const [participantALocationId, setParticipantALocationId] = useState(
    melbourne.entity_id
  );

  const [participantBLocationId, setParticipantBLocationId] = useState(
    newYork.entity_id
  );

  const participantATimezone = getTimezoneForLocation(participantALocationId);
  const participantBTimezone = getTimezoneForLocation(participantBLocationId);

  return (
    <section>
      <h2>Meeting Planner</h2>

      <h3>Participant A</h3>

      <label htmlFor="participant-a-location">Location</label>

      <select
        id="participant-a-location"
        value={participantALocationId}
        onChange={(event) => setParticipantALocationId(event.target.value)}
      >
        {supportedLocations.map((location) => (
          <option key={location.entity_id} value={location.entity_id}>
            {location.canonical_name}
          </option>
        ))}
      </select>

      <p>
        Timezone:{" "}
        {participantATimezone?.iana_identifier ?? "Timezone unavailable"}
      </p>

      <h3>Participant B</h3>

      <label htmlFor="participant-b-location">Location</label>

      <select
        id="participant-b-location"
        value={participantBLocationId}
        onChange={(event) => setParticipantBLocationId(event.target.value)}
      >
        {supportedLocations.map((location) => (
          <option key={location.entity_id} value={location.entity_id}>
            {location.canonical_name}
          </option>
        ))}
      </select>

      <p>
        Timezone:{" "}
        {participantBTimezone?.iana_identifier ?? "Timezone unavailable"}
      </p>
    </section>
  );
}