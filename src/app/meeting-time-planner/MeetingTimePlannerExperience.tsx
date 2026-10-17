"use client";

import { useState } from "react";
import { melbourne, newYork } from "@/data/locations";
import { supportedTimezones } from "@/data/timezones";
import { resolveAvailabilityInterval } from "@/lib/temporal/resolveAvailabilityInterval";
import { evaluateMeetingWindow } from "@/lib/temporal/evaluateMeetingWindow";

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
    const [meetingDurationMinutes, setMeetingDurationMinutes] =
        useState<30 | 60 | 90>(30);
    const participantALocation = supportedLocations.find(
        (location) => location.entity_id === participantALocationId
    );

    const participantBLocation = supportedLocations.find(
        (location) => location.entity_id === participantBLocationId
    );
    const participantATimezone = getTimezoneForLocation(participantALocationId);
    const participantBTimezone = getTimezoneForLocation(participantBLocationId);
    const [meetingResultMessage, setMeetingResultMessage] = useState("");
    const [meetingResult, setMeetingResult] = useState<{
        start: Date;
        end: Date;
    } | null>(null);

    function handleFindMeeting() {
        setMeetingResult(null);

        if (
            !participantADate ||
            !participantAStartTime ||
            !participantAEndTime ||
            !participantBDate ||
            !participantBStartTime ||
            !participantBEndTime
        ) {
            setMeetingResultMessage(
                "Please enter a date, start time, and end time for both participants."
            );
            return;
        }

        if (!participantATimezone) {
            setMeetingResultMessage("Participant A's timezone is unavailable.");
            return;
        }

        const participantAAvailability = resolveAvailabilityInterval({
            local_date: participantADate,
            start_time: participantAStartTime,
            end_time: participantAEndTime,
            iana_identifier: participantATimezone.iana_identifier,
        });

        if (participantAAvailability.status !== "valid") {
            setMeetingResultMessage(
                `Participant A availability error: ${participantAAvailability.status}`
            );
            return;
        }

        if (!participantBTimezone) {
            setMeetingResultMessage("Participant B's timezone is unavailable.");
            return;
        }

        const participantBAvailability = resolveAvailabilityInterval({
            local_date: participantBDate,
            start_time: participantBStartTime,
            end_time: participantBEndTime,
            iana_identifier: participantBTimezone.iana_identifier,
        });
        if (participantBAvailability.status !== "valid") {
            setMeetingResultMessage(
                `Participant B availability error: ${participantBAvailability.status}`
            );
            return;
        }

        const meetingWindow = evaluateMeetingWindow({
            participant_a_start: participantAAvailability.start_instant,
            participant_a_end: participantAAvailability.end_instant,
            participant_b_start: participantBAvailability.start_instant,
            participant_b_end: participantBAvailability.end_instant,
            duration_minutes: meetingDurationMinutes,
        });

        if (meetingWindow.status === "no_overlap") {
            setMeetingResultMessage(
                "No meeting time is available within both participants' selected availability."
            );
            return;
        }

        setMeetingResult({
            start: meetingWindow.meeting_start,
            end: meetingWindow.meeting_end,
        });
        setMeetingResultMessage("Meeting available!");
    }
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
                    setMeetingDurationMinutes(
                        Number(event.target.value) as 30 | 60 | 90
                    )
                }
            >
                <option value={30}>30 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
            </select>
            <button type="button" onClick={handleFindMeeting}>
                Find Meeting Time
            </button>
            {meetingResultMessage && (
                <section aria-labelledby="meeting-result-heading">
                    <h3 id="meeting-result-heading">Meeting Result</h3>
                    <p role="status">{meetingResultMessage}</p>
                    {meetingResult && participantATimezone && (
                        <div>
                            <h4>
                                Participant A — {participantALocation?.canonical_name ?? "Unknown location"}
                            </h4>
                            <p>
                                {new Intl.DateTimeFormat("en-AU", {
                                    timeZone: participantATimezone.iana_identifier,
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                }).format(meetingResult.start)}
                                {" to "}
                                {new Intl.DateTimeFormat("en-AU", {
                                    timeZone: participantATimezone.iana_identifier,
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                }).format(meetingResult.end)}
                            </p>
                        </div>
                    )}
                    {meetingResult && participantBTimezone && (

                        <div>
                            <h4>
                                Participant B — {participantBLocation?.canonical_name ?? "Unknown location"}
                            </h4>
                            <p>
                                {new Intl.DateTimeFormat("en-AU", {
                                    timeZone: participantBTimezone.iana_identifier,
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                }).format(meetingResult.start)}
                                {" to "}
                                {new Intl.DateTimeFormat("en-AU", {
                                    timeZone: participantBTimezone.iana_identifier,
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                }).format(meetingResult.end)}
                            </p>
                        </div>
                    )}
                </section>
            )}
        </section>
    );
}
