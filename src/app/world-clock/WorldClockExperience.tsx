"use client";

import { useState } from "react";
import { melbourne, newYork } from "@/data/locations";

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

  return <p key={locationId}>Added: {location?.canonical_name}</p>;
})}
  </div>
);
}