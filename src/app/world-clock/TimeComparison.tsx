"use client";

import { useEffect, useState } from "react";
import { compareTemporalStates } from "@/lib/temporal/compareTemporalStates";

type TimeComparisonProps = {
  firstName: string;
  firstIanaIdentifier: string;
  secondName: string;
  secondIanaIdentifier: string;
};

export default function TimeComparison({
  firstName,
  firstIanaIdentifier,
  secondName,
  secondIanaIdentifier,
}: TimeComparisonProps) {
  const [referenceInstant, setReferenceInstant] = useState<Date | null>(null);

  useEffect(() => {
    setReferenceInstant(new Date());

    const timer = window.setInterval(() => {
      setReferenceInstant(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  if (!referenceInstant) {
    return <p>Loading comparison...</p>;
  }

  const comparison = compareTemporalStates({
    first_iana_identifier: firstIanaIdentifier,
    second_iana_identifier: secondIanaIdentifier,
    reference_instant: referenceInstant,
  });

  const differenceMinutes = comparison.difference_minutes;
  const absoluteDifferenceMinutes = Math.abs(differenceMinutes);
  const hours = Math.floor(absoluteDifferenceMinutes / 60);
  const minutes = absoluteDifferenceMinutes % 60;

  const differenceLabel =
    hours > 0 && minutes > 0
      ? `${hours} hours ${minutes} minutes`
      : hours > 0
        ? `${hours} hours`
        : `${minutes} minutes`;
  if (differenceMinutes === 0) {
    return (
      <p>
        {firstName} and {secondName} have the same local time
      </p>
    );
  }

  const direction = differenceMinutes > 0 ? "ahead of" : "behind";
  return (
    <p>
      {firstName} is {differenceLabel} {direction} {secondName}
    </p>
  );
}