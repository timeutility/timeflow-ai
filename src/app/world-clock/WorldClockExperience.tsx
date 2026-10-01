"use client";

import { useState } from "react";
import { melbourne, newYork } from "@/data/locations";
import { supportedTimezones } from "@/data/timezones";
import LiveClock from "./LiveClock";
const supportedLocations = [melbourne, newYork];

export default function WorldClockExperience() {
     const [selectedLocationId, setSelectedLocationId] = useState(
    melbourne.entity_id,
  );
  const [addedLocationIds, setAddedLocationIds] = useState<string[]>([]);
const selectedLocation = supportedLocations.find(
  (location) => location.entity_id === selectedLocationId,
);
const addSelectedLocation = () => {
  if (!addedLocationIds.includes(selectedLocationId)) {
    setAddedLocationIds([...addedLocationIds, selectedLocationId]);
  }
  };
return (
  <div>
    <select
      value={selectedLocationId}
      onChange={(event) => setSelectedLocationId(event.target.value)}
    >
      {supportedLocations.map((location) => (
        <option key={location.entity_id} value={location.entity_id}>
          {location.canonical_name}
        </option>
      ))}
    </select>
    <button type="button" onClick={addSelectedLocation}>
  Add Location
</button>

    <p>Selected location: {selectedLocation?.canonical_name}</p>
    {addedLocationIds.map((locationId) => {
  const location = supportedLocations.find(
    (supportedLocation) => supportedLocation.entity_id === locationId,
  );

  const timezone = supportedTimezones.find(
  (supportedTimezone) =>
    supportedTimezone.entity_id === location?.timezone_entity_id,
);

  if (!location || !timezone) {
  return null;
}
return (
  <div key={locationId}>
    <h2>{location.canonical_name}</h2>
    <LiveClock
      entityId={location.entity_id}
      ianaIdentifier={timezone.iana_identifier}
    />
  </div>
);
})}
</div>
);
}