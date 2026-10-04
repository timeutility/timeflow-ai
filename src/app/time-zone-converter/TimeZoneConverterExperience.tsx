"use client";
import { melbourne, newYork } from "@/data/locations";
export default function TimeZoneConverterExperience() {
    return (
        <section>
            <div>
                <label htmlFor="source-location">From</label>
                <select id="source-location">
                    <option value={melbourne.entity_id}>{melbourne.canonical_name}</option>
                    <option value={newYork.entity_id}>{newYork.canonical_name}</option>
                </select>
            </div>

            <div>
                <label htmlFor="local-date">Date</label>
                <input id="local-date" type="date" />
            </div>

            <div>
                <label htmlFor="local-time">Time</label>
                <input id="local-time" type="time" />
            </div>

            <div>
                <label htmlFor="destination-location">To</label>
                <select id="destination-location">
                    <option value={newYork.entity_id}>{newYork.canonical_name}</option>
                    <option value={melbourne.entity_id}>{melbourne.canonical_name}</option>
                </select>
            </div>

            <button type="button">Convert</button>
        </section>
    );
}