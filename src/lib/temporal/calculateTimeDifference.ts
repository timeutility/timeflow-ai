
import { resolveLocalDateTime } from "./resolveLocalDateTime";
import type { ResolveLocalDateTimeInput } from "./resolveLocalDateTime";

export type CalculateTimeDifferenceInput = {
  start: ResolveLocalDateTimeInput;
  end: ResolveLocalDateTimeInput;
};

export type CalculateTimeDifferenceResult =
  | {
      status: "success";
      order: "before" | "equal" | "after";
      duration: {
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
      };
      total_milliseconds: number;
    }
  | {
      status: "invalid";
      field: "start" | "end";
      reason: "ambiguous" | "nonexistent";
    };

export function calculateTimeDifference({
  start,
  end,
}: CalculateTimeDifferenceInput): CalculateTimeDifferenceResult {
  const startResult = resolveLocalDateTime(start);

  if (startResult.status !== "unique") {
    return {
      status: "invalid",
      field: "start",
      reason: startResult.status,
    };
  }

  const endResult = resolveLocalDateTime(end);

  if (endResult.status !== "unique") {
    return {
      status: "invalid",
      field: "end",
      reason: endResult.status,
    };
  }

  const startMilliseconds = startResult.reference_instant.getTime();
  const endMilliseconds = endResult.reference_instant.getTime();

  const order =
    startMilliseconds < endMilliseconds
      ? "before"
      : startMilliseconds > endMilliseconds
        ? "after"
        : "equal";

  const total_milliseconds = Math.abs(
    endMilliseconds - startMilliseconds,
  );

  const totalSeconds = Math.floor(total_milliseconds / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    status: "success",
    order,
    duration: {
      days,
      hours,
      minutes,
      seconds,
    },
    total_milliseconds,
  };
}