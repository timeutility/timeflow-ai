  type EvaluateTemporalStateInput = {
  entity_id: string;
  iana_identifier: string;
  reference_instant: Date;
};

export function evaluateTemporalState({
  entity_id,
  iana_identifier,
  reference_instant,
}: EvaluateTemporalStateInput) {
  const formatter = new Intl.DateTimeFormat("en-AU", {
    timeZone: iana_identifier,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const offsetFormatter = new Intl.DateTimeFormat("en-AU", {
    timeZone: iana_identifier,
    timeZoneName: "longOffset",
  });

  const offsetPart = offsetFormatter
    .formatToParts(reference_instant)
    .find((part) => part.type === "timeZoneName");

  return {
    entity_id,
    reference_instant: reference_instant.toISOString(),
    local_datetime: formatter.format(reference_instant),
    timezone: iana_identifier,
    utc_offset: offsetPart?.value ?? null,
  };
}