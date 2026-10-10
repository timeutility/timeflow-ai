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
    const [participantADate, setParticipantADate] = useState("");
    const [participantAStartTime, setParticipantAStartTime] = useState("");
    const [participantAEndTime, setParticipantAEndTime] = useState("");
    const [participantBLocationId, setParticipantBLocationId] = useState(
        newYork.entity_id
    );
    const [participantBDate, setParticipantBDate] = useState("");
    const [participantBStartTime, setParticipantBStartTime] = useState("");
    const [participantBEndTime, setParticipantBEndTime] = useState("");
    const [meetingDurationMinutes, setMeetingDurationMinutes] = useState(30);
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
            <label htmlFor="participant-a-date">Local date</label>

            <input
                id="participant-a-date"
                type="date"
                value={participantADate}
                onChange={(event) => setParticipantADate(event.target.value)}
            />
            <label htmlFor="participant-a-start-time">
                Availability start time
            </label>

            <input
                id="participant-a-start-time"
                type="time"
                value={participantAStartTime}
                onChange={(event) => setParticipantAStartTime(event.target.value)}
            />
            <label htmlFor="participant-a-end-time">
                Availability end time
            </label>

            <input
                id="participant-a-end-time"
                type="time"
                value={participantAEndTime}
                onChange={(event) => setParticipantAEndTime(event.target.value)}
            />
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
            <label htmlFor="participant-b-date">Local date</label>

            <input
                id="participant-b-date"
                type="date"
                value={participantBDate}
                onChange={(event) => setParticipantBDate(event.target.value)}
            />
            <label htmlFor="participant-b-start-time">
                Availability start time
            </label>

            <input
                id="participant-b-start-time"
                type="time"
                value={participantBStartTime}
                onChange={(event) => setParticipantBStartTime(event.target.value)}
            />
            <label htmlFor="participant-b-end-time">
                Availability end time
            </label>

            <input
                id="participant-b-end-time"
                type="time"
                value={participantBEndTime}
                onChange={(event) => setParticipantBEndTime(event.target.value)}
            />
            <h3>Meeting Details</h3>

            <label htmlFor="meeting-duration">
                Meeting duration
            </label>

            <select
                id="meeting-duration"
                value={meetingDurationMinutes}
                onChange={(event) =>
                    setMeetingDurationMinutes(Number(event.target.value))
                }
            >
                <option value={30}>30 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
            </select>
        </section>
    );
}