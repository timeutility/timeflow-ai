"use client";

import { useState } from "react";
import { melbourne, newYork } from "@/data/locations";
export default function TimeZoneConverterExperience() {
    const [sourceLocationId, setSourceLocationId] = useState(melbourne.entity_id);
    const [destinationLocationId, setDestinationLocationId] = useState(newYork.entity_id);
    const [localDate, setLocalDate] = useState("");
    const [localTime, setLocalTime] = useState("");
    return (
        <section>
            <div>
                <label htmlFor="source-location">From</label>
                <select
                    id="source-location"
                    value={sourceLocationId}
                    onChange={(event) => setSourceLocationId(event.target.value)}
                 >
                    <option value={melbourne.entity_id}>{melbourne.canonical_name}</option>
                    <option value={newYork.entity_id}>{newYork.canonical_name}</option>
                </select>
            </div>

            <div>
                <label htmlFor="local-date">Date</label>
                <input
                   id="local-date"
                   type="date"
                   value={localDate}
                   onChange={(event) => setLocalDate(event.target.value)}
                />
            </div>

            <div>
                <label htmlFor="local-time">Time</label>
                <input
                   id="local-time"
                   type="time"
                   value={localTime}
                   onChange={(event) => setLocalTime(event.target.value)}
                />
            </div>

            <div>
                <label htmlFor="destination-location">To</label>
                <select
                    id="destination-location"
                    value={destinationLocationId}
                    onChange={(event) => setDestinationLocationId(event.target.value)}
                >
                    <option value={newYork.entity_id}>{newYork.canonical_name}</option>
                    <option value={melbourne.entity_id}>{melbourne.canonical_name}</option>
                </select>
            </div>

            <button type="button">Convert</button>
        </section>
    );
}