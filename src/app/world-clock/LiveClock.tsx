"use client";

import { useEffect, useState } from "react";
import { evaluateTemporalState } from "@/lib/temporal/evaluateTemporalState";

type LiveClockProps = {
  entityId: string;
  ianaIdentifier: string;
};

export default function LiveClock({
  entityId,
  ianaIdentifier,
}: LiveClockProps) {
  const [referenceInstant, setReferenceInstant] = useState<Date | null>(null);

  useEffect(() => {
    setReferenceInstant(new Date());

    const timer = window.setInterval(() => {
      setReferenceInstant(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  if (!referenceInstant) {
    return <p>Loading time...</p>;
  }

  const temporalState = evaluateTemporalState({
    entity_id: entityId,
    iana_identifier: ianaIdentifier,
    reference_instant: referenceInstant,
  });

  return <p>{temporalState.local_datetime}</p>;
}