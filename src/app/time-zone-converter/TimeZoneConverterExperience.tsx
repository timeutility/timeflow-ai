"use client";

import { useState } from "react";
import { melbourne, newYork } from "@/data/locations";
import {
    americaNewYorkTimezone,
    australiaMelbourneTimezone,
} from "@/data/timezones";
import { resolveLocalDateTime } from "@/lib/temporal/resolveLocalDateTime";
import { evaluateTemporalState } from "@/lib/temporal/evaluateTemporalState";
export default function TimeZoneConverterExperience() {
    const [sourceLocationId, setSourceLocationId] = useState(melbourne.entity_id);
    const [destinationLocationId, setDestinationLocationId] = useState(newYork.entity_id);
    const [localDate, setLocalDate] = useState("");
    const [localTime, setLocalTime] = useState("");
    const [conversionResult, setConversionResult] = useState<string | null>(null);
    const sourceLocation =
        sourceLocationId === melbourne.entity_id ? melbourne : newYork;
    const destinationLocation =
        destinationLocationId === melbourne.entity_id ? melbourne : newYork;
    const sourceTimezone =
        sourceLocation.timezone_entity_id === australiaMelbourneTimezone.entity_id
            ? australiaMelbourneTimezone
            : americaNewYorkTimezone;
    const destinationTimezone =
        destinationLocation.timezone_entity_id === australiaMelbourneTimezone.entity_id
            ? australiaMelbourneTimezone
            : americaNewYorkTimezone;
    function handleConvert() {
        if (!localDate || !localTime) {
            return;
        }

        const resolution = resolveLocalDateTime({
            local_date: localDate,
            local_time: localTime,
            iana_identifier: sourceTimezone.iana_identifier,
        });
        if (resolution.status !== "unique") {
            console.log(resolution);
            return;
        }
        const destinationState = evaluateTemporalState({
            entity_id: destinationLocation.entity_id,
            iana_identifier: destinationTimezone.iana_identifier,
            reference_instant: resolution.reference_instant,
        });
        setConversionResult(
            `${destinationLocation.canonical_name}: ${destinationState.local_datetime} (${destinationState.utc_offset})`,
        );
    }
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

            <button type="button" onClick={handleConvert}>
                Convert
            </button>

            {conversionResult && <p>{conversionResult}</p>}
        </section>
    );
}