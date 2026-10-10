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