export type CountdownTimerStatus =
    | "idle"
    | "running"
    | "paused"
    | "completed";

export type CountdownTimerState = {
    status: CountdownTimerStatus;
    initial_duration_ms: number;
    accumulated_elapsed_ms: number;
    started_at_ms: number | null;
};
export type CreateCountdownTimerResult =
    | {
        status: "success";
        timer: CountdownTimerState;
    }
    | {
        status: "invalid";
        reason: "invalid_duration";
    };

export function createCountdownTimer(
    duration_ms: number,
): CreateCountdownTimerResult {
    const maximum_duration_ms =
        (99 * 3600 + 59 * 60 + 59) * 1000;

    if (
        !Number.isSafeInteger(duration_ms) ||
        duration_ms < 1000 ||
        duration_ms > maximum_duration_ms ||
        duration_ms % 1000 !== 0
    ) {
        return {
            status: "invalid",
            reason: "invalid_duration",
        };
    }

    return {
        status: "success",
        timer: {
            status: "idle",
            initial_duration_ms: duration_ms,
            accumulated_elapsed_ms: 0,
            started_at_ms: null,
        },
    };
}

export type StartCountdownTimerResult =
    | {
        status: "success";
        timer: CountdownTimerState;
    }
    | {
        status: "invalid";
        reason: "invalid_state" | "invalid_clock";
    };

export function startCountdownTimer(
    timer: CountdownTimerState,
    now_ms: number,
): StartCountdownTimerResult {
    if (timer.status !== "idle") {
        return {
            status: "invalid",
            reason: "invalid_state",
        };
    }

    if (!Number.isFinite(now_ms) || now_ms < 0) {
        return {
            status: "invalid",
            reason: "invalid_clock",
        };
    }

    return {
        status: "success",
        timer: {
            ...timer,
            status: "running",
            accumulated_elapsed_ms: 0,
            started_at_ms: now_ms,
        },
    };
}


export type PauseCountdownTimerResult =
    | {
        status: "success";
        timer: CountdownTimerState;
    }
    | {
        status: "invalid";
        reason: "invalid_state" | "invalid_clock";
    };

export function pauseCountdownTimer(
    timer: CountdownTimerState,
    now_ms: number,
): PauseCountdownTimerResult {
    if (
        timer.status !== "running" ||
        timer.started_at_ms === null
    ) {
        return {
            status: "invalid",
            reason: "invalid_state",
        };
    }

    if (
        !Number.isFinite(now_ms) ||
        now_ms < timer.started_at_ms
    ) {
        return {
            status: "invalid",
            reason: "invalid_clock",
        };
    }

    const elapsed_ms =
        timer.accumulated_elapsed_ms +
        (now_ms - timer.started_at_ms);

    return {
        status: "success",
        timer: {
            ...timer,
            status:
                elapsed_ms >= timer.initial_duration_ms
                    ? "completed"
                    : "paused",
            accumulated_elapsed_ms: Math.min(
                elapsed_ms,
                timer.initial_duration_ms,
            ),
            started_at_ms: null,
        },
    };
}
export type ResumeCountdownTimerResult =
    | {
        status: "success";
        timer: CountdownTimerState;
    }
    | {
        status: "invalid";
        reason: "invalid_state" | "invalid_clock";
    };

export function resumeCountdownTimer(
    timer: CountdownTimerState,
    now_ms: number,
): ResumeCountdownTimerResult {
    if (timer.status !== "paused") {
        return {
            status: "invalid",
            reason: "invalid_state",
        };
    }

    if (!Number.isFinite(now_ms) || now_ms < 0) {
        return {
            status: "invalid",
            reason: "invalid_clock",
        };
    }

    return {
        status: "success",
        timer: {
            ...timer,
            status: "running",
            started_at_ms: now_ms,
        },
    };
}


export function resetCountdownTimer(
    timer: CountdownTimerState,
): CountdownTimerState {
    return {
        ...timer,
        status: "idle",
        accumulated_elapsed_ms: 0,
        started_at_ms: null,
    };
}


export function getCountdownRemainingMs(
    timer: CountdownTimerState,
    now_ms: number,
): number {
    if (timer.status === "completed") {
        return 0;
    }

    if (timer.status === "idle") {
        return timer.initial_duration_ms;
    }

    if (timer.status === "paused") {
        return Math.max(
            0,
            timer.initial_duration_ms -
            timer.accumulated_elapsed_ms,
        );
    }

    if (
        timer.started_at_ms === null ||
        !Number.isFinite(now_ms) ||
        now_ms < timer.started_at_ms
    ) {
        return Math.max(
            0,
            timer.initial_duration_ms -
            timer.accumulated_elapsed_ms,
        );
    }

    const elapsed_ms =
        timer.accumulated_elapsed_ms +
        (now_ms - timer.started_at_ms);

    return Math.max(
        0,
        timer.initial_duration_ms - elapsed_ms,
    );
}