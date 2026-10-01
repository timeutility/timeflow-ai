"use client";

import { useState } from "react";
import { melbourne, newYork } from "@/data/locations";
import { supportedTimezones } from "@/data/timezones";
import LiveClock from "./LiveClock";
import TimeComparison from "./TimeComparison";
const supportedLocations = [melbourne, newYork];

export default function WorldClockExperience() {
const [selectedLocationId, setSelectedLocationId] = useState(
    melbourne.entity_id,
  );
const [addedLocationIds, setAddedLocationIds] = useState<string[]>([]);
const addedLocations = supportedLocations.filter((location) =>
  addedLocationIds.includes(location.entity_id),
);
const selectedLocation = supportedLocations.find(
  (location) => location.entity_id === selectedLocationId,
);
const addSelectedLocation = () => {
  if (!addedLocationIds.includes(selectedLocationId)) {
    setAddedLocationIds([...addedLocationIds, selectedLocationId]);
  }
};
const removeLocation = (locationId: string) => {
  setAddedLocationIds(
    addedLocationIds.filter((addedLocationId) => addedLocationId !== locationId),
  );
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
    <button type="button" onClick={() => removeLocation(location.entity_id)}>
  Remove Location
</button>
  </div>
);
})}
     {addedLocations.length === 2 && (
        <TimeComparison
          firstName={addedLocations[0].canonical_name}
          firstIanaIdentifier={
            supportedTimezones.find(
              (timezone) =>
                timezone.entity_id === addedLocations[0].timezone_entity_id,
            )!.iana_identifier
          }
          secondName={addedLocations[1].canonical_name}
          secondIanaIdentifier={
            supportedTimezones.find(
              (timezone) =>
                timezone.entity_id === addedLocations[1].timezone_entity_id,
            )!.iana_identifier
          }
        />
      )}
</div>
);
}