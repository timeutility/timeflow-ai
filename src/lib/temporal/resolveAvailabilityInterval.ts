import { resolveLocalDateTime } from "./resolveLocalDateTime";
export type ResolveAvailabilityIntervalInput = {
    local_date: string;
    start_time: string;
    end_time: string;
    iana_identifier: string;
};
export type ResolveAvailabilityIntervalResult =
    | {
        status: "valid";
        start_instant: Date;
        end_instant: Date;
    }
    | {
        status: "invalid_order";
    }
    | {
        status: "ambiguous";
    }
    | {
        status: "nonexistent";
    };
export function resolveAvailabilityInterval({
    local_date,
    start_time,
    end_time,
    iana_identifier,
}: ResolveAvailabilityIntervalInput): ResolveAvailabilityIntervalResult {
    if (end_time <= start_time) {
        return { status: "invalid_order" };
    }
    const resolvedStart = resolveLocalDateTime({
        local_date,
        local_time: start_time,
        iana_identifier,
    });
    if (resolvedStart.status === "ambiguous") {
        return { status: "ambiguous" };
    }
    if (resolvedStart.status === "nonexistent") {
        return { status: "nonexistent" };
    }
    const resolvedEnd = resolveLocalDateTime({
        local_date,
        local_time: end_time,
        iana_identifier,
    });
    if (resolvedEnd.status === "ambiguous") {
        return { status: "ambiguous" };
    }
    if (resolvedEnd.status === "nonexistent") {
        return { status: "nonexistent" };
    }

    return {
        status: "valid",
        start_instant: resolvedStart.reference_instant,
        end_instant: resolvedEnd.reference_instant,
    };
}