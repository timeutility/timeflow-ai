"use client";

import { useState } from "react";
import { melbourne, newYork } from "@/data/locations";

const supportedLocations = [melbourne, newYork];

export default function WorldClockExperience() {
     const [selectedLocationId, setSelectedLocationId] = useState(
    melbourne.entity_id,
  );
const selectedLocation = supportedLocations.find(
  (location) => location.entity_id === selectedLocationId,
);
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

    <p>Selected location: {selectedLocation?.canonical_name}</p>
  </div>
);
}