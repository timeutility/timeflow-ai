"use client";

import { useState } from "react";
import { calculateTimeDifference } from "@/lib/temporal/calculateTimeDifference";

const timezones = [
    { label: "Melbourne", value: "Australia/Melbourne" },
    { label: "New York", value: "America/New_York" },
];

export default function TimeDifferenceCalculatorExperience() {
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [startTimezone, setStartTimezone] = useState(
        "Australia/Melbourne",
    );

    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");
    const [endTimezone, setEndTimezone] = useState(
        "America/New_York",
    );

    const [result, setResult] = useState<string | null>(null);

    function handleCalculate() {
        if (!startDate || !startTime || !endDate || !endTime) {
            setResult("Please enter both dates and both times.");
            return;
        }

        const calculation = calculateTimeDifference({
            start: {
                local_date: startDate,
                local_time: startTime,
                iana_identifier: startTimezone,
            },
            end: {
                local_date: endDate,
                local_time: endTime,
                iana_identifier: endTimezone,
            },
        });

        if (calculation.status === "invalid") {
            const field =
                calculation.field === "start" ? "start" : "end";

            const message =
                calculation.reason === "ambiguous"
                    ? `The ${field} time occurs twice because of a daylight-saving transition. Please choose another time.`
                    : `The ${field} time does not exist because of a daylight-saving transition. Please choose another time.`;

            setResult(message);
            return;
        }

        const { days, hours, minutes, seconds } =
            calculation.duration;

        const orderMessage =
            calculation.order === "equal"
                ? "Both dates and times represent the same instant."
                : calculation.order === "before"
                    ? "The start instant is before the end instant."
                    : "The start instant is after the end instant.";

        setResult(
            `${orderMessage} Elapsed duration: ` +
            `${days} ${days === 1 ? "day" : "days"}, ` +
            `${hours} ${hours === 1 ? "hour" : "hours"}, ` +
            `${minutes} ${minutes === 1 ? "minute" : "minutes"}, ` +
            `${seconds} ${seconds === 1 ? "second" : "seconds"}.`
        );
        }

    return (
        <section>
            <h2>Start date and time</h2>

            <div>
                <label htmlFor="difference-start-date">Start date</label>
                <input
                    id="difference-start-date"
                    type="date"
                    value={startDate}
                    onChange={(event) => {
                        setStartDate(event.target.value);
                        setResult(null);
                    }}
                />
            </div>

            <div>
                <label htmlFor="difference-start-time">Start time</label>
                <input
                    id="difference-start-time"
                    type="time"
                    step="1"
                    value={startTime}
                    onChange={(event) => {
                        setStartTime(event.target.value);
                        setResult(null);
                    }}
                />
            </div>

            <div>
                <label htmlFor="difference-start-timezone">
                    Start time zone
                </label>
                <select
                    id="difference-start-timezone"
                    value={startTimezone}
                    onChange={(event) => {
                        setStartTimezone(event.target.value);
                        setResult(null);
                    }}
                >
                    {timezones.map((timezone) => (
                        <option key={timezone.value} value={timezone.value}>
                            {timezone.label}
                        </option>
                    ))}
                </select>
            </div>

            <h2>End date and time</h2>

            <div>
                <label htmlFor="difference-end-date">End date</label>
                <input
                    id="difference-end-date"
                    type="date"
                    value={endDate}
                    onChange={(event) => {
                        setEndDate(event.target.value);
                        setResult(null);
                    }}
                />
            </div>

            <div>
                <label htmlFor="difference-end-time">End time</label>
                <input
                    id="difference-end-time"
                    type="time"
                    step="1"
                    value={endTime}
                    onChange={(event) => {
                        setEndTime(event.target.value);
                        setResult(null);
                    }}
                />
            </div>

            <div>
                <label htmlFor="difference-end-timezone">
                    End time zone
                </label>
                <select
                    id="difference-end-timezone"
                    value={endTimezone}
                    onChange={(event) => {
                        setEndTimezone(event.target.value);
                        setResult(null);
                    }}
                >
                    {timezones.map((timezone) => (
                        <option key={timezone.value} value={timezone.value}>
                            {timezone.label}
                        </option>
                    ))}
                </select>
            </div>

            <button type="button" onClick={handleCalculate}>
                Calculate time difference
            </button>

            {result !== null && (
                <p role="status" aria-live="polite">
                    {result}
                </p>
            )}
        </section>
    );
}