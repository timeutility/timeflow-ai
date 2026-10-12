import { describe, expect, it } from "vitest";
import { evaluateMeetingWindow } from "./evaluateMeetingWindow";

describe("evaluateMeetingWindow", () => {
    it("finds the earliest 30-minute meeting in overlapping availability", () => {
        const result = evaluateMeetingWindow({
            participant_a_start: new Date("2026-10-15T09:00:00Z"),
            participant_a_end: new Date("2026-10-15T11:00:00Z"),
            participant_b_start: new Date("2026-10-15T10:00:00Z"),
            participant_b_end: new Date("2026-10-15T12:00:00Z"),
            duration_minutes: 30,
        });

        expect(result).toEqual({
            status: "available",
            meeting_start: new Date("2026-10-15T10:00:00Z"),
            meeting_end: new Date("2026-10-15T10:30:00Z"),
        });
    });
    it("rejects a meeting when shared availability is too short", () => {
        const result = evaluateMeetingWindow({
            participant_a_start: new Date("2026-10-15T09:00:00Z"),
            participant_a_end: new Date("2026-10-15T10:00:00Z"),
            participant_b_start: new Date("2026-10-15T09:45:00Z"),
            participant_b_end: new Date("2026-10-15T11:00:00Z"),
            duration_minutes: 30,
        });

        expect(result).toEqual({
            status: "no_overlap",
        });
    });
    it("rejects completely separate availability windows", () => {
        const result = evaluateMeetingWindow({
            participant_a_start: new Date("2026-10-15T09:00:00Z"),
            participant_a_end: new Date("2026-10-15T10:00:00Z"),
            participant_b_start: new Date("2026-10-15T11:00:00Z"),
            participant_b_end: new Date("2026-10-15T12:00:00Z"),
            duration_minutes: 30,
        });

        expect(result).toEqual({
            status: "no_overlap",
        });
    });
    it("accepts a meeting that exactly fits the shared availability", () => {
        const result = evaluateMeetingWindow({
            participant_a_start: new Date("2026-10-15T09:00:00Z"),
            participant_a_end: new Date("2026-10-15T10:00:00Z"),
            participant_b_start: new Date("2026-10-15T09:30:00Z"),
            participant_b_end: new Date("2026-10-15T11:00:00Z"),
            duration_minutes: 30,
        });

        expect(result).toEqual({
            status: "available",
            meeting_start: new Date("2026-10-15T09:30:00Z"),
            meeting_end: new Date("2026-10-15T10:00:00Z"),
        });
    });
    it("finds the earliest available 90-minute meeting", () => {
        const result = evaluateMeetingWindow({
            participant_a_start: new Date("2026-10-15T09:00:00Z"),
            participant_a_end: new Date("2026-10-15T12:00:00Z"),
            participant_b_start: new Date("2026-10-15T10:00:00Z"),
            participant_b_end: new Date("2026-10-15T13:00:00Z"),
            duration_minutes: 90,
        });

        expect(result).toEqual({
            status: "available",
            meeting_start: new Date("2026-10-15T10:00:00Z"),
            meeting_end: new Date("2026-10-15T11:30:00Z"),
        });
    });
    it("finds the earliest available 60-minute meeting", () => {
        const result = evaluateMeetingWindow({
            participant_a_start: new Date("2026-10-15T09:00:00Z"),
            participant_a_end: new Date("2026-10-15T11:00:00Z"),
            participant_b_start: new Date("2026-10-15T10:00:00Z"),
            participant_b_end: new Date("2026-10-15T12:00:00Z"),
            duration_minutes: 60,
        });

        expect(result).toEqual({
            status: "available",
            meeting_start: new Date("2026-10-15T10:00:00Z"),
            meeting_end: new Date("2026-10-15T11:00:00Z"),
        });
    });
});