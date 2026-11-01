import { describe, expect, it } from "vitest";
import { calculateTimeDifference } from "./calculateTimeDifference";

describe("calculateTimeDifference", () => {
  const melbourne = "Australia/Melbourne";
  const newYork = "America/New_York";

  it("calculates a duration when start is before end", () => {
    const result = calculateTimeDifference({
      start: {
        local_date: "2026-10-15",
        local_time: "09:00",
        iana_identifier: melbourne,
      },
      end: {
        local_date: "2026-10-15",
        local_time: "11:30",
        iana_identifier: melbourne,
      },
    });

    expect(result).toMatchObject({
      status: "success",
      order: "before",
      duration: {
        days: 0,
        hours: 2,
        minutes: 30,
        seconds: 0,
      },
      total_milliseconds: 9_000_000,
    });
  });

  it("calculates the same duration in reverse order", () => {
    const result = calculateTimeDifference({
      start: {
        local_date: "2026-10-15",
        local_time: "11:30",
        iana_identifier: melbourne,
      },
      end: {
        local_date: "2026-10-15",
        local_time: "09:00",
        iana_identifier: melbourne,
      },
    });

    expect(result).toMatchObject({
      status: "success",
      order: "after",
      duration: {
        days: 0,
        hours: 2,
        minutes: 30,
        seconds: 0,
      },
    });
  });

  it("returns zero for identical instants", () => {
    const result = calculateTimeDifference({
      start: {
        local_date: "2026-10-15",
        local_time: "09:00",
        iana_identifier: melbourne,
      },
      end: {
        local_date: "2026-10-14",
        local_time: "18:00",
        iana_identifier: newYork,
      },
    });

    expect(result).toMatchObject({
      status: "success",
      order: "equal",
      duration: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
      total_milliseconds: 0,
    });
  });

  it("calculates elapsed time across different time zones", () => {
    const result = calculateTimeDifference({
      start: {
        local_date: "2026-10-15",
        local_time: "09:00",
        iana_identifier: melbourne,
      },
      end: {
        local_date: "2026-10-14",
        local_time: "20:30",
        iana_identifier: newYork,
      },
    });

    expect(result).toMatchObject({
      status: "success",
      order: "before",
      duration: {
        days: 0,
        hours: 2,
        minutes: 30,
        seconds: 0,
      },
    });
  });

  it("calculates elapsed time across a calendar-year boundary", () => {
    const result = calculateTimeDifference({
      start: {
        local_date: "2026-12-31",
        local_time: "23:00",
        iana_identifier: "Etc/UTC",
      },
      end: {
        local_date: "2027-01-01",
        local_time: "01:30",
        iana_identifier: "Etc/UTC",
      },
    });

    expect(result).toMatchObject({
      status: "success",
      order: "before",
      duration: {
        days: 0,
        hours: 2,
        minutes: 30,
        seconds: 0,
      },
    });
  });

  it("uses actual elapsed time across Melbourne DST start", () => {
    const result = calculateTimeDifference({
      start: {
        local_date: "2026-10-04",
        local_time: "01:30",
        iana_identifier: melbourne,
      },
      end: {
        local_date: "2026-10-04",
        local_time: "03:30",
        iana_identifier: melbourne,
      },
    });

    expect(result).toMatchObject({
      status: "success",
      order: "before",
      duration: {
        days: 0,
        hours: 1,
        minutes: 0,
        seconds: 0,
      },
    });
  });

  it("rejects a nonexistent local time", () => {
    const result = calculateTimeDifference({
      start: {
        local_date: "2026-10-04",
        local_time: "02:30",
        iana_identifier: melbourne,
      },
      end: {
        local_date: "2026-10-04",
        local_time: "04:00",
        iana_identifier: melbourne,
      },
    });

    expect(result).toEqual({
      status: "invalid",
      field: "start",
      reason: "nonexistent",
    });
  });

  it("rejects an ambiguous local time", () => {
    const result = calculateTimeDifference({
      start: {
        local_date: "2026-04-05",
        local_time: "02:30",
        iana_identifier: melbourne,
      },
      end: {
        local_date: "2026-04-05",
        local_time: "04:00",
        iana_identifier: melbourne,
      },
    });

    expect(result).toEqual({
      status: "invalid",
      field: "start",
      reason: "ambiguous",
    });
  });

  it("identifies an invalid end time", () => {
    const result = calculateTimeDifference({
      start: {
        local_date: "2026-10-04",
        local_time: "01:00",
        iana_identifier: melbourne,
      },
      end: {
        local_date: "2026-10-04",
        local_time: "02:30",
        iana_identifier: melbourne,
      },
    });

    expect(result).toEqual({
      status: "invalid",
      field: "end",
      reason: "nonexistent",
    });
  });
});