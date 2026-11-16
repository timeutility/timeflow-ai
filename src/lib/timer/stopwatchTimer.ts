
/**
 * TimeFlow AI
 * Build 6 — Stopwatch Engine
 * Step 136 — Implementation v1.0
 *
 * Contract: Step 135 — LOCKED
 *
 * Pure TypeScript.
 * No React, browser APIs, or internal clock access.
 */

export type StopwatchStatus =
  | "idle"
  | "running"
  | "paused";

export interface StopwatchLap {
  lap_number: number;
  lap_duration_ms: number;
  split_time_ms: number;
}

export interface StopwatchState {
  status: StopwatchStatus;
  accumulated_elapsed_ms: number;
  started_at_ms: number | null;
  laps: StopwatchLap[];
}

export type StopwatchErrorCode =
  | "invalid_state"
  | "invalid_clock"
  | "invalid_elapsed";

export type StopwatchResult<T> =
  | {
      ok: true;
      value: T;
    }
  | {
      ok: false;
      error: {
        code: StopwatchErrorCode;
        message: string;
      };
    };

function success<T>(value: T): StopwatchResult<T> {
  return { ok: true, value };
}

function failure<T>(
  code: StopwatchErrorCode,
  message: string
): StopwatchResult<T> {
  return {
    ok: false,
    error: { code, message },
  };
}

function validDuration(value: number): boolean {
  return Number.isSafeInteger(value) && value >= 0;
}

function validClock(value: number): boolean {
  return Number.isSafeInteger(value) && value >= 0;
}

/**
 * Validate the supplied stopwatch state.
 *
 * This function is private and does not change
 * the locked public API.
 */
function validateStopwatchState(
  state: StopwatchState
): StopwatchResult<true> {
  if (
    !state ||
    (state.status !== "idle" &&
      state.status !== "running" &&
      state.status !== "paused") ||
    !Array.isArray(state.laps)
  ) {
    return failure(
      "invalid_state",
      "Stopwatch state structure is invalid."
    );
  }

  if (!validDuration(state.accumulated_elapsed_ms)) {
    return failure(
      "invalid_elapsed",
      "Accumulated elapsed time is invalid."
    );
  }

  if (state.status === "idle") {
    if (
      state.started_at_ms !== null ||
      state.accumulated_elapsed_ms !== 0 ||
      state.laps.length !== 0
    ) {
      return failure(
        "invalid_state",
        "Idle stopwatch state is inconsistent."
      );
    }
  } else if (state.status === "running") {
    if (
      state.started_at_ms === null ||
      !validClock(state.started_at_ms)
    ) {
      return failure(
        "invalid_clock",
        "Running stopwatch requires a valid start timestamp."
      );
    }
  } else if (state.started_at_ms !== null) {
    return failure(
      "invalid_state",
      "Paused stopwatch cannot have an active start timestamp."
    );
  }

  let previous_split_ms = 0;

  for (let index = 0; index < state.laps.length; index++) {
    const lap = state.laps[index];

    if (
      !lap ||
      lap.lap_number !== index + 1
    ) {
      return failure(
        "invalid_state",
        "Lap numbering is invalid."
      );
    }

    if (
      !validDuration(lap.lap_duration_ms) ||
      !validDuration(lap.split_time_ms)
    ) {
      return failure(
        "invalid_elapsed",
        "Lap duration or split time is invalid."
      );
    }

    const expected_split_ms =
      previous_split_ms + lap.lap_duration_ms;

    if (
      !validDuration(expected_split_ms) ||
      lap.split_time_ms !== expected_split_ms
    ) {
      return failure(
        "invalid_elapsed",
        "Lap split time is inconsistent."
      );
    }

    previous_split_ms = lap.split_time_ms;
  }

  if (
    state.status === "paused" &&
    previous_split_ms > state.accumulated_elapsed_ms
  ) {
    return failure(
      "invalid_elapsed",
      "Lap split exceeds paused elapsed time."
    );
  }

  return success(true);
}

/**
 * Calculate elapsed milliseconds without mutation.
 */
function calculateElapsed(
  state: StopwatchState,
  now_ms: number
): StopwatchResult<number> {
  const validation = validateStopwatchState(state);

  if (!validation.ok) {
    return validation;
  }

  if (!validClock(now_ms)) {
    return failure(
      "invalid_clock",
      "Timestamp must be a nonnegative safe integer."
    );
  }

  if (state.status !== "running") {
    return success(state.accumulated_elapsed_ms);
  }

  const started_at_ms = state.started_at_ms;

  if (
    started_at_ms === null ||
    now_ms < started_at_ms
  ) {
    return failure(
      "invalid_clock",
      "Timestamp precedes the active stopwatch start."
    );
  }

  const elapsed_ms =
    state.accumulated_elapsed_ms +
    (now_ms - started_at_ms);

  if (!validDuration(elapsed_ms)) {
    return failure(
      "invalid_elapsed",
      "Calculated elapsed time is invalid."
    );
  }

  const previous_split_ms =
    state.laps[state.laps.length - 1]?.split_time_ms ?? 0;

  if (previous_split_ms > elapsed_ms) {
    return failure(
      "invalid_elapsed",
      "Lap split exceeds current elapsed time."
    );
  }

  return success(elapsed_ms);
}

/**
 * Create a fresh idle stopwatch.
 */
export function createStopwatch(): StopwatchState {
  return {
    status: "idle",
    accumulated_elapsed_ms: 0,
    started_at_ms: null,
    laps: [],
  };
}

/**
 * Start an idle stopwatch.
 */
export function startStopwatch(
  state: StopwatchState,
  now_ms: number
): StopwatchResult<StopwatchState> {
  if (state.status !== "idle") {
    return failure(
      "invalid_state",
      "Only an idle stopwatch can be started."
    );
  }

  const validation = validateStopwatchState(state);

  if (!validation.ok) {
    return validation;
  }

  if (!validClock(now_ms)) {
    return failure(
      "invalid_clock",
      "Invalid start timestamp."
    );
  }

  return success({
    status: "running",
    accumulated_elapsed_ms: 0,
    started_at_ms: now_ms,
    laps: [],
  });
}

/**
 * Pause a running stopwatch.
 */
export function pauseStopwatch(
  state: StopwatchState,
  now_ms: number
): StopwatchResult<StopwatchState> {
  if (state.status !== "running") {
    return failure(
      "invalid_state",
      "Only a running stopwatch can be paused."
    );
  }

  const elapsed = calculateElapsed(state, now_ms);

  if (!elapsed.ok) {
    return elapsed;
  }

  return success({
    ...state,
    status: "paused",
    accumulated_elapsed_ms: elapsed.value,
    started_at_ms: null,
  });
}

/**
 * Resume a paused stopwatch.
 */
export function resumeStopwatch(
  state: StopwatchState,
  now_ms: number
): StopwatchResult<StopwatchState> {
  if (state.status !== "paused") {
    return failure(
      "invalid_state",
      "Only a paused stopwatch can be resumed."
    );
  }

  const validation = validateStopwatchState(state);

  if (!validation.ok) {
    return validation;
  }

  if (!validClock(now_ms)) {
    return failure(
      "invalid_clock",
      "Invalid resume timestamp."
    );
  }

  return success({
    ...state,
    status: "running",
    started_at_ms: now_ms,
  });
}

/**
 * Reset a stopwatch from any state.
 */
export function resetStopwatch(
  _state: StopwatchState
): StopwatchResult<StopwatchState> {
  return success(createStopwatch());
}

/**
 * Calculate elapsed milliseconds without mutation.
 */
export function getStopwatchElapsedMs(
  state: StopwatchState,
  now_ms: number
): StopwatchResult<number> {
  return calculateElapsed(state, now_ms);
}

/**
 * Record a lap while running.
 *
 * Split time = cumulative elapsed time.
 * Lap duration = current split - previous split.
 */
export function recordStopwatchLap(
  state: StopwatchState,
  now_ms: number
): StopwatchResult<StopwatchState> {
  if (state.status !== "running") {
    return failure(
      "invalid_state",
      "Laps can only be recorded while running."
    );
  }

  const elapsed = calculateElapsed(state, now_ms);

  if (!elapsed.ok) {
    return elapsed;
  }

  const previous_split_ms =
    state.laps[state.laps.length - 1]?.split_time_ms ?? 0;

  const lap_duration_ms =
    elapsed.value - previous_split_ms;

  if (!validDuration(lap_duration_ms)) {
    return failure(
      "invalid_elapsed",
      "Calculated lap duration is invalid."
    );
  }

  const lap: StopwatchLap = {
    lap_number: state.laps.length + 1,
    lap_duration_ms,
    split_time_ms: elapsed.value,
  };

  return success({
    ...state,
    laps: [...state.laps, lap],
  });
}