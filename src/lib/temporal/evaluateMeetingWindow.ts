export type EvaluateMeetingWindowInput = {
    participant_a_start: Date;
    participant_a_end: Date;
    participant_b_start: Date;
    participant_b_end: Date;
    duration_minutes: 30 | 60 | 90;
};
export type EvaluateMeetingWindowResult =
    | {
        status: "available";
        meeting_start: Date;
        meeting_end: Date;
    }
    | {
        status: "no_overlap";
    };
export function evaluateMeetingWindow({
    participant_a_start,
    participant_a_end,
    participant_b_start,
    participant_b_end,
    duration_minutes,
}: EvaluateMeetingWindowInput): EvaluateMeetingWindowResult {
    const overlapStart = new Date(
        Math.max(
            participant_a_start.getTime(),
            participant_b_start.getTime(),
        ),
    );
    const overlapEnd = new Date(
        Math.min(
            participant_a_end.getTime(),
            participant_b_end.getTime(),
        ),
    );
    const overlapDurationMs = overlapEnd.getTime() - overlapStart.getTime();
    const requiredDurationMs = duration_minutes * 60 * 1000;
    if (overlapDurationMs < requiredDurationMs) {
        return { status: "no_overlap" };
    }
    const meetingEnd = new Date(
        overlapStart.getTime() + requiredDurationMs,
    );
    return {
        status: "available",
        meeting_start: overlapStart,
        meeting_end: meetingEnd,
    };
}