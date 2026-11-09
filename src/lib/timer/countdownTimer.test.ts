
import { describe, expect, it } from "vitest";
import {
    createCountdownTimer,
    startCountdownTimer,
    pauseCountdownTimer,
    resumeCountdownTimer,
    resetCountdownTimer,
    getCountdownRemainingMs,
} from "./countdownTimer";

describe("createCountdownTimer", () => {
    it("creates a valid one-minute timer in the idle state", () => {
        const result = createCountdownTimer(60_000);

        expect(result).toEqual({
            status: "success",
            timer: {
                status: "idle",
                initial_duration_ms: 60_000,
                accumulated_elapsed_ms: 0,
                started_at_ms: null,
            },
        });
    });

    it("accepts the minimum duration of one second", () => {
        const result = createCountdownTimer(1_000);

        expect(result.status).toBe("success");
    });

    it("accepts the maximum duration of 99:59:59", () => {
        const result = createCountdownTimer(359_999_000);

        expect(result.status).toBe("success");
    });

    it("rejects a zero duration", () => {
        expect(createCountdownTimer(0)).toEqual({
            status: "invalid",
            reason: "invalid_duration",
        });
    });

    it("rejects a negative duration", () => {
        expect(createCountdownTimer(-1_000).status).toBe("invalid");
    });

    it("rejects a duration above the maximum", () => {
        expect(createCountdownTimer(360_000_000).status).toBe("invalid");
    });

    it("rejects fractional-second durations", () => {
        expect(createCountdownTimer(1_500).status).toBe("invalid");
    });

    it("rejects non-finite and non-numeric durations", () => {
        expect(createCountdownTimer(NaN).status).toBe("invalid");
        expect(createCountdownTimer(Infinity).status).toBe("invalid");
    });
});

describe("startCountdownTimer", () => {
    it("starts an idle timer using the supplied clock reading", () => {
        const created = createCountdownTimer(60_000);

        expect(created.status).toBe("success");

        if (created.status !== "success") {
            throw new Error("Timer creation failed");
        }

        const result = startCountdownTimer(created.timer, 5_000);

        expect(result).toEqual({
            status: "success",
            timer: {
                status: "running",
                initial_duration_ms: 60_000,
                accumulated_elapsed_ms: 0,
                started_at_ms: 5_000,
            },
        });
    });

    it("rejects starting a timer that is already running", () => {
        const created = createCountdownTimer(60_000);

        if (created.status !== "success") {
            throw new Error("Timer creation failed");
        }

        const firstStart = startCountdownTimer(created.timer, 5_000);

        if (firstStart.status !== "success") {
            throw new Error("Timer start failed");
        }

        const secondStart = startCountdownTimer(
            firstStart.timer,
            6_000,
        );

        expect(secondStart).toEqual({
            status: "invalid",
            reason: "invalid_state",
        });
    });
    it("rejects an invalid clock reading", () => {
        const created = createCountdownTimer(60_000);

        if (created.status !== "success") {
            throw new Error("Timer creation failed");
        }

        expect(startCountdownTimer(created.timer, NaN)).toEqual({
            status: "invalid",
            reason: "invalid_clock",
        });

        expect(startCountdownTimer(created.timer, -1)).toEqual({
            status: "invalid",
            reason: "invalid_clock",
        });

        expect(startCountdownTimer(created.timer, Infinity)).toEqual({
            status: "invalid",
            reason: "invalid_clock",
        });
    });
});


describe("pauseCountdownTimer", () => {
    it("pauses a running timer and preserves elapsed time", () => {
        const created = createCountdownTimer(60_000);

        if (created.status !== "success") {
            throw new Error("Timer creation failed");
        }

        const started = startCountdownTimer(created.timer, 5_000);

        if (started.status !== "success") {
            throw new Error("Timer start failed");
        }

        const paused = pauseCountdownTimer(started.timer, 20_000);

        expect(paused).toEqual({
            status: "success",
            timer: {
                status: "paused",
                initial_duration_ms: 60_000,
                accumulated_elapsed_ms: 15_000,
                started_at_ms: null,
            },
        });
    });

    it("rejects pausing a timer that has not started", () => {
        const created = createCountdownTimer(60_000);

        if (created.status !== "success") {
            throw new Error("Timer creation failed");
        }

        const result = pauseCountdownTimer(
            created.timer,
            5_000,
        );

        expect(result).toEqual({
            status: "invalid",
            reason: "invalid_state",
        });
    });

    it("rejects invalid clock readings when pausing", () => {
        const created = createCountdownTimer(60_000);

        if (created.status !== "success") {
            throw new Error("Timer creation failed");
        }

        const started = startCountdownTimer(created.timer, 5_000);

        if (started.status !== "success") {
            throw new Error("Timer start failed");
        }

        expect(pauseCountdownTimer(started.timer, NaN)).toEqual({
            status: "invalid",
            reason: "invalid_clock",
        });

        expect(pauseCountdownTimer(started.timer, Infinity)).toEqual({
            status: "invalid",
            reason: "invalid_clock",
        });

        expect(pauseCountdownTimer(started.timer, 4_000)).toEqual({
            status: "invalid",
            reason: "invalid_clock",
        });
    });

    it("completes a timer when its duration has elapsed", () => {
        const created = createCountdownTimer(60_000);

        if (created.status !== "success") {
            throw new Error("Timer creation failed");
        }

        const started = startCountdownTimer(created.timer, 5_000);

        if (started.status !== "success") {
            throw new Error("Timer start failed");
        }

        const result = pauseCountdownTimer(started.timer, 65_000);

        expect(result).toEqual({
            status: "success",
            timer: {
                status: "completed",
                initial_duration_ms: 60_000,
                accumulated_elapsed_ms: 60_000,
                started_at_ms: null,
            },
        });
    });
});


describe("resumeCountdownTimer", () => {
    it("resumes a paused timer without losing elapsed time", () => {
        const created = createCountdownTimer(60_000);

        if (created.status !== "success") {
            throw new Error("Timer creation failed");
        }

        const started = startCountdownTimer(created.timer, 5_000);

        if (started.status !== "success") {
            throw new Error("Timer start failed");
        }

        const paused = pauseCountdownTimer(started.timer, 20_000);

        if (paused.status !== "success") {
            throw new Error("Timer pause failed");
        }

        const resumed = resumeCountdownTimer(paused.timer, 30_000);

        expect(resumed).toEqual({
            status: "success",
            timer: {
                status: "running",
                initial_duration_ms: 60_000,
                accumulated_elapsed_ms: 15_000,
                started_at_ms: 30_000,
            },
        });
    });

    it("rejects resuming a timer that has not started", () => {
        const created = createCountdownTimer(60_000);

        if (created.status !== "success") {
            throw new Error("Timer creation failed");
        }

        const result = resumeCountdownTimer(
            created.timer,
            5_000,
        );

        expect(result).toEqual({
            status: "invalid",
            reason: "invalid_state",
        });
    });
    it("rejects resuming a timer that is already running", () => {
        const created = createCountdownTimer(60_000);

        if (created.status !== "success") {
            throw new Error("Timer creation failed");
        }

        const started = startCountdownTimer(created.timer, 5_000);

        if (started.status !== "success") {
            throw new Error("Timer start failed");
        }

        const result = resumeCountdownTimer(
            started.timer,
            10_000,
        );

        expect(result).toEqual({
            status: "invalid",
            reason: "invalid_state",
        });
    });
    it("rejects resuming a completed timer", () => {
        const created = createCountdownTimer(60_000);

        if (created.status !== "success") {
            throw new Error("Timer creation failed");
        }

        const started = startCountdownTimer(created.timer, 5_000);

        if (started.status !== "success") {
            throw new Error("Timer start failed");
        }

        const completed = pauseCountdownTimer(
            started.timer,
            65_000,
        );

        if (
            completed.status !== "success" ||
            completed.timer.status !== "completed"
        ) {
            throw new Error("Timer completion failed");
        }

        const result = resumeCountdownTimer(
            completed.timer,
            70_000,
        );

        expect(result).toEqual({
            status: "invalid",
            reason: "invalid_state",
        });
    });

    it("rejects invalid clock readings when resuming", () => {
        const created = createCountdownTimer(60_000);

        if (created.status !== "success") {
            throw new Error("Timer creation failed");
        }

        const started = startCountdownTimer(created.timer, 5_000);

        if (started.status !== "success") {
            throw new Error("Timer start failed");
        }

        const paused = pauseCountdownTimer(started.timer, 20_000);

        if (paused.status !== "success") {
            throw new Error("Timer pause failed");
        }

        expect(resumeCountdownTimer(paused.timer, NaN)).toEqual({
            status: "invalid",
            reason: "invalid_clock",
        });

        expect(resumeCountdownTimer(paused.timer, Infinity)).toEqual({
            status: "invalid",
            reason: "invalid_clock",
        });

        expect(resumeCountdownTimer(paused.timer, -1)).toEqual({
            status: "invalid",
            reason: "invalid_clock",
        });
    });

});


describe("resetCountdownTimer", () => {
    it("resets a running timer to its initial state", () => {
        const created = createCountdownTimer(60_000);

        if (created.status !== "success") {
            throw new Error("Timer creation failed");
        }

        const started = startCountdownTimer(created.timer, 5_000);

        if (started.status !== "success") {
            throw new Error("Timer start failed");
        }

        const result = resetCountdownTimer(started.timer);

        expect(result).toEqual({
            status: "idle",
            initial_duration_ms: 60_000,
            accumulated_elapsed_ms: 0,
            started_at_ms: null,
        });
    });

    it("resets a paused timer to its initial state", () => {
        const created = createCountdownTimer(60_000);

        if (created.status !== "success") {
            throw new Error("Timer creation failed");
        }

        const started = startCountdownTimer(created.timer, 5_000);

        if (started.status !== "success") {
            throw new Error("Timer start failed");
        }

        const paused = pauseCountdownTimer(started.timer, 20_000);

        if (paused.status !== "success") {
            throw new Error("Timer pause failed");
        }

        const result = resetCountdownTimer(paused.timer);

        expect(result).toEqual({
            status: "idle",
            initial_duration_ms: 60_000,
            accumulated_elapsed_ms: 0,
            started_at_ms: null,
        });
    });

    it("resets a completed timer to its initial state", () => {
        const created = createCountdownTimer(60_000);

        if (created.status !== "success") {
            throw new Error("Timer creation failed");
        }

        const started = startCountdownTimer(created.timer, 5_000);

        if (started.status !== "success") {
            throw new Error("Timer start failed");
        }

        const completed = pauseCountdownTimer(
            started.timer,
            65_000,
        );

        if (
            completed.status !== "success" ||
            completed.timer.status !== "completed"
        ) {
            throw new Error("Timer completion failed");
        }

        const result = resetCountdownTimer(completed.timer);

        expect(result).toEqual({
            status: "idle",
            initial_duration_ms: 60_000,
            accumulated_elapsed_ms: 0,
            started_at_ms: null,
        });
    });

    it("keeps an idle timer in its initial state when reset", () => {
        const created = createCountdownTimer(60_000);

        if (created.status !== "success") {
            throw new Error("Timer creation failed");
        }

        const result = resetCountdownTimer(created.timer);

        expect(result).toEqual({
            status: "idle",
            initial_duration_ms: 60_000,
            accumulated_elapsed_ms: 0,
            started_at_ms: null,
        });
    });
});


describe("getCountdownRemainingMs", () => {
    it("returns the full duration for an idle timer", () => {
        const created = createCountdownTimer(60_000);

        if (created.status !== "success") {
            throw new Error("Timer creation failed");
        }

        const remaining = getCountdownRemainingMs(
            created.timer,
            5_000,
        );

        expect(remaining).toBe(60_000);
    });
    it("subtracts elapsed time from a running timer", () => {
        const created = createCountdownTimer(60_000);

        if (created.status !== "success") {
            throw new Error("Timer creation failed");
        }

        const started = startCountdownTimer(created.timer, 5_000);

        if (started.status !== "success") {
            throw new Error("Timer start failed");
        }

        const remaining = getCountdownRemainingMs(
            started.timer,
            20_000,
        );

        expect(remaining).toBe(45_000);
    });
    it("preserves remaining time while paused", () => {
        const created = createCountdownTimer(60_000);

        if (created.status !== "success") {
            throw new Error("Timer creation failed");
        }

        const started = startCountdownTimer(created.timer, 5_000);

        if (started.status !== "success") {
            throw new Error("Timer start failed");
        }

        const paused = pauseCountdownTimer(started.timer, 20_000);

        if (paused.status !== "success") {
            throw new Error("Timer pause failed");
        }

        const remaining = getCountdownRemainingMs(
            paused.timer,
            50_000,
        );

        expect(remaining).toBe(45_000);
    });
    it("returns zero for a completed timer", () => {
        const created = createCountdownTimer(60_000);

        if (created.status !== "success") {
            throw new Error("Timer creation failed");
        }

        const started = startCountdownTimer(created.timer, 5_000);

        if (started.status !== "success") {
            throw new Error("Timer start failed");
        }

        const completed = pauseCountdownTimer(
            started.timer,
            65_000,
        );

        if (
            completed.status !== "success" ||
            completed.timer.status !== "completed"
        ) {
            throw new Error("Timer completion failed");
        }

        const remaining = getCountdownRemainingMs(
            completed.timer,
            90_000,
        );

        expect(remaining).toBe(0);
    });
    it("never returns negative remaining time after expiry", () => {
        const created = createCountdownTimer(60_000);

        if (created.status !== "success") {
            throw new Error("Timer creation failed");
        }

        const started = startCountdownTimer(created.timer, 5_000);

        if (started.status !== "success") {
            throw new Error("Timer start failed");
        }

        const remaining = getCountdownRemainingMs(
            started.timer,
            95_000,
        );

        expect(remaining).toBe(0);
    });

    it("preserves elapsed time after pausing and resuming", () => {
        const created = createCountdownTimer(60_000);

        if (created.status !== "success") {
            throw new Error("Timer creation failed");
        }

        const started = startCountdownTimer(created.timer, 5_000);

        if (started.status !== "success") {
            throw new Error("Timer start failed");
        }

        const paused = pauseCountdownTimer(started.timer, 20_000);

        if (paused.status !== "success") {
            throw new Error("Timer pause failed");
        }

        const resumed = resumeCountdownTimer(paused.timer, 30_000);

        if (resumed.status !== "success") {
            throw new Error("Timer resume failed");
        }

        const remaining = getCountdownRemainingMs(
            resumed.timer,
            40_000,
        );

        expect(remaining).toBe(35_000);
    });

    it("handles invalid clock readings without corrupting remaining time", () => {
        const created = createCountdownTimer(60_000);

        if (created.status !== "success") {
            throw new Error("Timer creation failed");
        }

        const started = startCountdownTimer(created.timer, 5_000);

        if (started.status !== "success") {
            throw new Error("Timer start failed");
        }

        expect(
            getCountdownRemainingMs(started.timer, NaN),
        ).toBe(60_000);

        expect(
            getCountdownRemainingMs(started.timer, Infinity),
        ).toBe(60_000);

        expect(
            getCountdownRemainingMs(started.timer, 4_000),
        ).toBe(60_000);
    });
});