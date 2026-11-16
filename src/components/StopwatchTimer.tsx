"use client";

import { useEffect, useRef, useState } from "react";

import {
  createStopwatch,
  startStopwatch,
  pauseStopwatch,
  resumeStopwatch,
  resetStopwatch,
  getStopwatchElapsedMs,
  recordStopwatchLap,
  type StopwatchState,
  type StopwatchResult,
} from "@/lib/timer/stopwatchTimer";

function getNowMs(): number {
  return Math.floor(performance.now());
}

function formatTime(milliseconds: number): string {
  const totalCentiseconds = Math.floor(milliseconds / 10);

  const centiseconds = totalCentiseconds % 100;
  const seconds = Math.floor(totalCentiseconds / 100) % 60;
  const minutes = Math.floor(totalCentiseconds / 6000) % 60;
  const hours = Math.floor(totalCentiseconds / 360000);

  return (
    `${String(hours).padStart(2, "0")}:` +
    `${String(minutes).padStart(2, "0")}:` +
    `${String(seconds).padStart(2, "0")}.` +
    `${String(centiseconds).padStart(2, "0")}`
  );
}

export default function StopwatchTimer() {
  const [stopwatch, setStopwatch] = useState<StopwatchState>(
    createStopwatch
  );

  const stopwatchRef = useRef(stopwatch);

  const [elapsedMs, setElapsedMs] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    stopwatchRef.current = stopwatch;
  }, [stopwatch]);

  useEffect(() => {
    if (stopwatch.status !== "running") return;

    const interval = window.setInterval(() => {
      const result = getStopwatchElapsedMs(
        stopwatchRef.current,
        getNowMs()
      );

      if (result.ok) {
        setElapsedMs(result.value);
      } else {
        setError(result.error.message);
      }
    }, 10);

    return () => window.clearInterval(interval);
  }, [stopwatch.status]);

  function applyTransition(
    result: StopwatchResult<StopwatchState>,
    nowMs: number
  ) {
    if (!result.ok) {
      setError(result.error.message);
      return;
    }

    const nextState = result.value;
    stopwatchRef.current = nextState;
    setStopwatch(nextState);
    setError(null);

    const elapsed = getStopwatchElapsedMs(nextState, nowMs);

    if (elapsed.ok) {
      setElapsedMs(elapsed.value);
    } else {
      setError(elapsed.error.message);
    }
  }

  function handleStart() {
    const nowMs = getNowMs();
    applyTransition(
      startStopwatch(stopwatchRef.current, nowMs),
      nowMs
    );
  }

  function handlePause() {
    const nowMs = getNowMs();
    applyTransition(
      pauseStopwatch(stopwatchRef.current, nowMs),
      nowMs
    );
  }

  function handleResume() {
    const nowMs = getNowMs();
    applyTransition(
      resumeStopwatch(stopwatchRef.current, nowMs),
      nowMs
    );
  }

  function handleReset() {
    const nowMs = getNowMs();
    applyTransition(
      resetStopwatch(stopwatchRef.current),
      nowMs
    );
  }

  function handleLap() {
    const nowMs = getNowMs();
    applyTransition(
      recordStopwatchLap(stopwatchRef.current, nowMs),
      nowMs
    );
  }

  const isIdle = stopwatch.status === "idle";
  const isRunning = stopwatch.status === "running";
  const isPaused = stopwatch.status === "paused";

  return (
    <section className="mx-auto w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-center text-2xl font-semibold text-zinc-900">
        Stopwatch
      </h2>

      <div
        role="timer"
        aria-label="Elapsed stopwatch time"
        className="mb-6 text-center font-mono text-4xl font-semibold tabular-nums text-zinc-900 sm:text-5xl"
      >
        {formatTime(elapsedMs)}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {isIdle && (
          <button
            type="button"
            onClick={handleStart}
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            Start
          </button>
        )}

        {isRunning && (
          <>
            <button
              type="button"
              onClick={handlePause}
              className="rounded-lg bg-amber-600 px-5 py-3 font-medium text-white hover:bg-amber-700"
            >
              Pause
            </button>

            <button
              type="button"
              onClick={handleLap}
              className="rounded-lg bg-emerald-600 px-5 py-3 font-medium text-white hover:bg-emerald-700"
            >
              Lap
            </button>
          </>
        )}

        {isPaused && (
          <button
            type="button"
            onClick={handleResume}
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            Resume
          </button>
        )}

        {!isIdle && (
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg bg-zinc-700 px-5 py-3 font-medium text-white hover:bg-zinc-800"
          >
            Reset
          </button>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-4 text-center text-sm text-red-600">
          {error}
        </p>
      )}

      {stopwatch.laps.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-3 text-lg font-semibold text-zinc-900">
            Laps
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-700">
              <thead>
                <tr className="border-b border-zinc-200">
                  <th scope="col" className="py-2">Lap</th>
                  <th scope="col" className="py-2">Duration</th>
                  <th scope="col" className="py-2">Split</th>
                </tr>
              </thead>
              <tbody>
                {stopwatch.laps.map((lap) => (
                  <tr
                    key={lap.lap_number}
                    className="border-b border-zinc-100"
                  >
                    <td className="py-2">{lap.lap_number}</td>
                    <td className="py-2">
                      {formatTime(lap.lap_duration_ms)}
                    </td>
                    <td className="py-2">
                      {formatTime(lap.split_time_ms)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}