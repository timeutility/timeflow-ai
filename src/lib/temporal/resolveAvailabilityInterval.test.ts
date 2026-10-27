import { describe, expect, it } from "vitest";
import { resolveAvailabilityInterval } from "./resolveAvailabilityInterval";

describe("resolveAvailabilityInterval", () => {
    it("rejects an end time earlier than the start time", () => {
        const result = resolveAvailabilityInterval({
            local_date: "2026-10-10",
            start_time: "17:00",
            end_time: "09:00",
            iana_identifier: "Australia/Melbourne",
        });

        expect(result.status).toBe("invalid_order");
    });

    it("rejects equal availability start and end times", () => {
        const result = resolveAvailabilityInterval({
            local_date: "2026-10-10",
            start_time: "09:00",
            end_time: "09:00",
            iana_identifier: "Australia/Melbourne",
        });

        expect(result.status).toBe("invalid_order");
    });
    it("accepts a valid availability window", () => {
        const result = resolveAvailabilityInterval({
            local_date: "2026-10-10",
            start_time: "09:00",
            end_time: "17:00",
            iana_identifier: "Australia/Melbourne",
        });

        expect(result.status).toBe("valid");

        if (result.status === "valid") {
            expect(result.start_instant).toBeInstanceOf(Date);
            expect(result.end_instant).toBeInstanceOf(Date);
            expect(result.end_instant.getTime()).toBeGreaterThan(
                result.start_instant.getTime(),
            );
        }
    });
    it("converts Melbourne availability times to exact UTC instants", () => {
        const result = resolveAvailabilityInterval({
            local_date: "2026-10-10",
            start_time: "09:00",
            end_time: "17:00",
            iana_identifier: "Australia/Melbourne",
        });

        expect(result.status).toBe("valid");

        if (result.status === "valid") {
            expect(result.start_instant.toISOString()).toBe(
                "2026-10-09T22:00:00.000Z",
            );
            expect(result.end_instant.toISOString()).toBe(
                "2026-10-10T06:00:00.000Z",
            );
        }
    });
    it("resolves a valid availability window across the daylight-saving transition", () => {
        const result = resolveAvailabilityInterval({
            local_date: "2026-10-04",
            start_time: "01:30",
            end_time: "03:30",
            iana_identifier: "Australia/Melbourne",
        });

        expect(result.status).toBe("valid");

        if (result.status === "valid") {
            expect(result.start_instant.toISOString()).toBe(
                "2026-10-03T15:30:00.000Z",
            );
            expect(result.end_instant.toISOString()).toBe(
                "2026-10-03T16:30:00.000Z",
            );
            expect(
                result.end_instant.getTime() -
                result.start_instant.getTime(),
            ).toBe(60 * 60 * 1000);
        }
    });
    it("rejects a nonexistent daylight-saving start time", () => {
        const result = resolveAvailabilityInterval({
            local_date: "2026-10-04",
            start_time: "02:30",
            end_time: "04:00",
            iana_identifier: "Australia/Melbourne",
        });

        expect(result.status).toBe("nonexistent");
    });
    it("rejects an ambiguous daylight-saving start time", () => {
        const result = resolveAvailabilityInterval({
            local_date: "2026-04-05",
            start_time: "02:30",
            end_time: "04:00",
            iana_identifier: "Australia/Melbourne",
        });

        expect(result.status).toBe("ambiguous");
    });
    it("rejects a nonexistent daylight-saving end time", () => {
        const result = resolveAvailabilityInterval({
            local_date: "2026-10-04",
            start_time: "01:00",
            end_time: "02:30",
            iana_identifier: "Australia/Melbourne",
        });

        expect(result.status).toBe("nonexistent");
    });
    it("rejects an ambiguous daylight-saving end time", () => {
        const result = resolveAvailabilityInterval({
            local_date: "2026-04-05",
            start_time: "01:00",
            end_time: "02:30",
            iana_identifier: "Australia/Melbourne",
        });

        expect(result.status).toBe("ambiguous");
    });
});