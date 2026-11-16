
import { describe, expect, it } from "vitest";

import {
  createStopwatch,
  startStopwatch,
  pauseStopwatch,
  resumeStopwatch,
  resetStopwatch,
  recordStopwatchLap,
  getStopwatchElapsedMs,
  type StopwatchState,
} from "./stopwatchTimer";

function unwrap<T>(
  result: { ok: true; value: T } |
          { ok: false; error: unknown }
): T {
  if (!result.ok) {
    throw new Error(JSON.stringify(result.error));
  }

  return result.value;
}

describe("TimeFlow AI — Stopwatch Engine v1.0", () => {
  it("creates the correct idle state", () => {
    expect(createStopwatch()).toEqual({
      status: "idle",
      accumulated_elapsed_ms: 0,
      started_at_ms: null,
      laps: [],
    });
  });

  it("starts an idle stopwatch", () => {
    const state = unwrap(
      startStopwatch(createStopwatch(), 1000)
    );

    expect(state.status).toBe("running");
    expect(state.started_at_ms).toBe(1000);
  });

  it("calculates elapsed time while running", () => {
    const state = unwrap(
      startStopwatch(createStopwatch(), 1000)
    );

    expect(
      unwrap(getStopwatchElapsedMs(state, 3500))
    ).toBe(2500);
  });

  it("pauses and freezes elapsed time", () => {
    const running = unwrap(
      startStopwatch(createStopwatch(), 1000)
    );

    const paused = unwrap(
      pauseStopwatch(running, 4000)
    );

    expect(paused.status).toBe("paused");
    expect(paused.accumulated_elapsed_ms).toBe(3000);
    expect(paused.started_at_ms).toBeNull();

    expect(
      unwrap(getStopwatchElapsedMs(paused, 9000))
    ).toBe(3000);
  });

  it("resumes without counting paused time", () => {
    const running = unwrap(
      startStopwatch(createStopwatch(), 1000)
    );

    const paused = unwrap(
      pauseStopwatch(running, 4000)
    );

    const resumed = unwrap(
      resumeStopwatch(paused, 8000)
    );

    expect(
      unwrap(getStopwatchElapsedMs(resumed, 10000))
    ).toBe(5000);
  });

  it("supports multiple pause/resume cycles", () => {
    let state = unwrap(
      startStopwatch(createStopwatch(), 1000)
    );

    state = unwrap(pauseStopwatch(state, 3000));
    state = unwrap(resumeStopwatch(state, 5000));
    state = unwrap(pauseStopwatch(state, 8000));
    state = unwrap(resumeStopwatch(state, 12000));

    expect(
      unwrap(getStopwatchElapsedMs(state, 15000))
    ).toBe(8000);
  });

  it("records sequential laps and split times", () => {
    let state = unwrap(
      startStopwatch(createStopwatch(), 1000)
    );

    state = unwrap(recordStopwatchLap(state, 3000));
    state = unwrap(recordStopwatchLap(state, 6500));

    expect(state.laps).toEqual([
      {
        lap_number: 1,
        lap_duration_ms: 2000,
        split_time_ms: 2000,
      },
      {
        lap_number: 2,
        lap_duration_ms: 3500,
        split_time_ms: 5500,
      },
    ]);
  });

  it("allows zero-duration laps", () => {
    let state = unwrap(
      startStopwatch(createStopwatch(), 1000)
    );

    state = unwrap(recordStopwatchLap(state, 1000));
    state = unwrap(recordStopwatchLap(state, 1000));

    expect(state.laps[0].lap_duration_ms).toBe(0);
    expect(state.laps[1].lap_duration_ms).toBe(0);
  });

  it("resets a running stopwatch", () => {
    const running = unwrap(
      startStopwatch(createStopwatch(), 1000)
    );

    expect(
      unwrap(resetStopwatch(running))
    ).toEqual(createStopwatch());
  });

  it("resets a paused stopwatch with laps", () => {
    let state = unwrap(
      startStopwatch(createStopwatch(), 1000)
    );

    state = unwrap(recordStopwatchLap(state, 2000));
    state = unwrap(pauseStopwatch(state, 3000));

    expect(
      unwrap(resetStopwatch(state))
    ).toEqual(createStopwatch());
  });

  it("rejects invalid state transitions", () => {
    const idle = createStopwatch();

    expect(pauseStopwatch(idle, 1000)).toMatchObject({
      ok: false,
      error: { code: "invalid_state" },
    });

    expect(resumeStopwatch(idle, 1000)).toMatchObject({
      ok: false,
      error: { code: "invalid_state" },
    });

    expect(recordStopwatchLap(idle, 1000)).toMatchObject({
      ok: false,
      error: { code: "invalid_state" },
    });

    const running = unwrap(startStopwatch(idle, 1000));

    expect(startStopwatch(running, 2000)).toMatchObject({
      ok: false,
      error: { code: "invalid_state" },
    });
  });

  it("rejects invalid timestamps", () => {
    expect(
      startStopwatch(createStopwatch(), -1)
    ).toMatchObject({
      ok: false,
      error: { code: "invalid_clock" },
    });

    const running = unwrap(
      startStopwatch(createStopwatch(), 1000)
    );

    expect(
      pauseStopwatch(running, 999)
    ).toMatchObject({
      ok: false,
      error: { code: "invalid_clock" },
    });

    expect(
      getStopwatchElapsedMs(running, Number.NaN)
    ).toMatchObject({
      ok: false,
      error: { code: "invalid_clock" },
    });
  });

  it("rejects elapsed-time overflow", () => {
    const state: StopwatchState = {
      status: "running",
      accumulated_elapsed_ms: Number.MAX_SAFE_INTEGER,
      started_at_ms: 1000,
      laps: [],
    };

    expect(
      getStopwatchElapsedMs(state, 1001)
    ).toMatchObject({
      ok: false,
      error: { code: "invalid_elapsed" },
    });
  });

  it("supports durations longer than 24 hours", () => {
    const running = unwrap(
      startStopwatch(createStopwatch(), 0)
    );

    const duration = 100 * 60 * 60 * 1000;

    expect(
      unwrap(getStopwatchElapsedMs(running, duration))
    ).toBe(duration);
  });

  it("does not mutate existing state or lap arrays", () => {
    let state = unwrap(
      startStopwatch(createStopwatch(), 1000)
    );

    state = unwrap(recordStopwatchLap(state, 2000));

    const original = structuredClone(state);
    const next = unwrap(recordStopwatchLap(state, 3000));

    expect(state).toEqual(original);
    expect(next).not.toBe(state);
    expect(next.laps).not.toBe(state.laps);
    expect(state.laps).toHaveLength(1);
    expect(next.laps).toHaveLength(2);
  });

  it("produces deterministic results", () => {
    const state = unwrap(
      startStopwatch(createStopwatch(), 1000)
    );

    const first = getStopwatchElapsedMs(state, 5000);
    const second = getStopwatchElapsedMs(state, 5000);

    expect(first).toEqual(second);
  });
});

/**
 * Step 136.13
 * Stopwatch Engine — Contract Validation Tests
 *
 * These tests intentionally exercise malformed states.
 * The engine must reject inconsistent state rather
 * than silently accepting or repairing it.
 */

describe("Stopwatch Engine — Contract Validation", () => {
  it("rejects an idle state with an active timestamp", () => {
    const invalid: StopwatchState = {
      status: "idle",
      accumulated_elapsed_ms: 0,
      started_at_ms: 1000,
      laps: [],
    };

    expect(startStopwatch(invalid, 2000)).toMatchObject({
      ok: false,
      error: { code: "invalid_state" },
    });
  });

  it("rejects an idle state containing elapsed time", () => {
    const invalid: StopwatchState = {
      status: "idle",
      accumulated_elapsed_ms: 5000,
      started_at_ms: null,
      laps: [],
    };

    expect(startStopwatch(invalid, 6000)).toMatchObject({
      ok: false,
      error: { code: "invalid_state" },
    });
  });

  it("rejects a running state with negative accumulated time", () => {
    const invalid: StopwatchState = {
      status: "running",
      accumulated_elapsed_ms: -1000,
      started_at_ms: 1000,
      laps: [],
    };

    expect(
      getStopwatchElapsedMs(invalid, 3000)
    ).toMatchObject({
      ok: false,
      error: { code: "invalid_elapsed" },
    });
  });

  it("rejects a running state without a start timestamp", () => {
    const invalid: StopwatchState = {
      status: "running",
      accumulated_elapsed_ms: 0,
      started_at_ms: null,
      laps: [],
    };

    expect(
      getStopwatchElapsedMs(invalid, 3000)
    ).toMatchObject({
      ok: false,
      error: { code: "invalid_clock" },
    });
  });

  it("rejects a paused state containing an active timestamp", () => {
    const invalid: StopwatchState = {
      status: "paused",
      accumulated_elapsed_ms: 3000,
      started_at_ms: 1000,
      laps: [],
    };

    expect(resumeStopwatch(invalid, 5000)).toMatchObject({
      ok: false,
      error: { code: "invalid_state" },
    });
  });

  it("rejects nonsequential lap numbers", () => {
    const invalid: StopwatchState = {
      status: "running",
      accumulated_elapsed_ms: 0,
      started_at_ms: 1000,
      laps: [
        {
          lap_number: 3,
          lap_duration_ms: 1000,
          split_time_ms: 1000,
        },
      ],
    };

    expect(recordStopwatchLap(invalid, 3000)).toMatchObject({
      ok: false,
      error: { code: "invalid_state" },
    });
  });

  it("rejects inconsistent lap duration and split time", () => {
    const invalid: StopwatchState = {
      status: "running",
      accumulated_elapsed_ms: 0,
      started_at_ms: 1000,
      laps: [
        {
          lap_number: 1,
          lap_duration_ms: 1000,
          split_time_ms: 2000,
        },
      ],
    };

    expect(recordStopwatchLap(invalid, 4000)).toMatchObject({
      ok: false,
      error: { code: "invalid_elapsed" },
    });
  });

  it("rejects a lap split exceeding current elapsed time", () => {
    const invalid: StopwatchState = {
      status: "running",
      accumulated_elapsed_ms: 0,
      started_at_ms: 1000,
      laps: [
        {
          lap_number: 1,
          lap_duration_ms: 5000,
          split_time_ms: 5000,
        },
      ],
    };

    expect(recordStopwatchLap(invalid, 3000)).toMatchObject({
      ok: false,
      error: { code: "invalid_elapsed" },
    });
  });

  it("rejects invalid accumulated time in a paused state", () => {
    const invalid: StopwatchState = {
      status: "paused",
      accumulated_elapsed_ms: Number.NaN,
      started_at_ms: null,
      laps: [],
    };

    expect(resumeStopwatch(invalid, 5000)).toMatchObject({
      ok: false,
      error: { code: "invalid_elapsed" },
    });
  });

  it("rejects malformed historical lap records", () => {
    const invalid: StopwatchState = {
      status: "running",
      accumulated_elapsed_ms: 0,
      started_at_ms: 1000,
      laps: [
        {
          lap_number: 1,
          lap_duration_ms: 1000,
          split_time_ms: 1000,
        },
        {
          lap_number: 2,
          lap_duration_ms: -500,
          split_time_ms: 500,
        },
      ],
    };

    expect(recordStopwatchLap(invalid, 4000)).toMatchObject({
      ok: false,
      error: { code: "invalid_elapsed" },
    });
  });
});