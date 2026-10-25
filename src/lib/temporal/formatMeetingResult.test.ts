import { describe, expect, it } from "vitest";
import { formatMeetingResult } from "./formatMeetingResult";

describe("formatMeetingResult", () => {
    it("displays the date once for a same-day meeting in Melbourne", () => {
        const result = formatMeetingResult({
            start: new Date("2026-10-14T22:00:00Z"),
            end: new Date("2026-10-14T22:30:00Z"),
            timeZone: "Australia/Melbourne",
        });

        expect(result).toBe(
            "Thursday 15 October 2026 — 9:00 am to 9:30 am"
        );
    });

    it("displays both dates when a meeting crosses midnight in Melbourne", () => {
        const result = formatMeetingResult({
            start: new Date("2026-10-15T12:30:00Z"),
            end: new Date("2026-10-15T13:30:00Z"),
            timeZone: "Australia/Melbourne",
        });

        expect(result).toBe(
            "Thursday 15 October 2026 at 11:30 pm to Friday 16 October 2026 at 12:30 am"
        );
    });

    it("formats the same meeting correctly in New York", () => {
        const result = formatMeetingResult({
            start: new Date("2026-10-14T22:00:00Z"),
            end: new Date("2026-10-14T22:30:00Z"),
            timeZone: "America/New_York",
        });

        expect(result).toBe(
            "Wednesday 14 October 2026 — 6:00 pm to 6:30 pm"
        );
    });
});