import { Temporal } from "temporal-polyfill";

export type ResolveLocalDateTimeInput = {
  local_date: string;
  local_time: string;
  iana_identifier: string;
};

export type ResolveLocalDateTimeResult =
  | {
      status: "unique";
      reference_instant: Date;
    }
  | {
      status: "ambiguous";
    }
  | {
      status: "nonexistent";
    };

export function resolveLocalDateTime({
  local_date,
  local_time,
  iana_identifier,
}: ResolveLocalDateTimeInput): ResolveLocalDateTimeResult {
  const localDateTime = `${local_date}T${local_time}`;

  let earlier: Temporal.ZonedDateTime;
  let later: Temporal.ZonedDateTime;

  try {
    earlier = Temporal.ZonedDateTime.from(
      `${localDateTime}[${iana_identifier}]`,
      { disambiguation: "earlier" },
    );

    later = Temporal.ZonedDateTime.from(
      `${localDateTime}[${iana_identifier}]`,
      { disambiguation: "later" },
    );
  } catch {
    return { status: "nonexistent" };
  }

  const requestedPlainDateTime = Temporal.PlainDateTime.from(localDateTime);
  const earlierPlainDateTime = earlier.toPlainDateTime();
  const laterPlainDateTime = later.toPlainDateTime();

  if (
    !earlierPlainDateTime.equals(requestedPlainDateTime) ||
    !laterPlainDateTime.equals(requestedPlainDateTime)
  ) {
    return { status: "nonexistent" };
  }

  if (earlier.epochNanoseconds !== later.epochNanoseconds) {
    return { status: "ambiguous" };
  }

  return {
    status: "unique",
    reference_instant: new Date(Number(earlier.epochMilliseconds)),
  };
}