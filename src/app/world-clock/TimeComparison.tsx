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

  const differenceHours = comparison.difference_minutes / 60;

  return (
    <p>
      {firstName} is {differenceHours} hours ahead of {secondName}
    </p>
  );
}