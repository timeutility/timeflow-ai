type CompareTemporalStatesInput = {
  first_iana_identifier: string;
  second_iana_identifier: string;
  reference_instant: Date;
};
export function compareTemporalStates({
  first_iana_identifier,
  second_iana_identifier,
  reference_instant,
}: CompareTemporalStatesInput) {
  const getOffsetMinutes = (ianaIdentifier: string) => {
    const formatter = new Intl.DateTimeFormat("en-AU", {
      timeZone: ianaIdentifier,
      timeZoneName: "longOffset",
    });

    const offsetPart = formatter
      .formatToParts(reference_instant)
      .find((part) => part.type === "timeZoneName");

    const match = offsetPart?.value.match(/GMT([+-])(\d{2}):(\d{2})/);

   if (!match) {
  throw new Error(`Unable to determine UTC offset for ${ianaIdentifier}`);
}

    const sign = match[1] === "+" ? 1 : -1;
    const hours = Number(match[2]);
    const minutes = Number(match[3]);

    return sign * (hours * 60 + minutes);
  };

  const firstOffsetMinutes = getOffsetMinutes(first_iana_identifier);
  const secondOffsetMinutes = getOffsetMinutes(second_iana_identifier);

  return {
    reference_instant: reference_instant.toISOString(),
    difference_minutes: firstOffsetMinutes - secondOffsetMinutes,
  };
}