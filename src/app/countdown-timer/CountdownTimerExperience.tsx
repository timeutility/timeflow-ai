
"use client";

import { useEffect, useState } from "react";
import {
    createCountdownTimer,
    startCountdownTimer,
    pauseCountdownTimer,
    resumeCountdownTimer,
    resetCountdownTimer,
    getCountdownRemainingMs,
    type CountdownTimerState,
} from "@/lib/timer/countdownTimer";

export default function CountdownTimerExperience() {
    const [hours, setHours] = useState("0");
    const [minutes, setMinutes] = useState("5");
    const [seconds, setSeconds] = useState("0");
    const displayHours = hours.padStart(2, "0");
    const displayMinutes = minutes.padStart(2, "0");
    const displaySeconds = seconds.padStart(2, "0");
    const [timer, setTimer] = useState<CountdownTimerState | null>(null);
    const [nowMs, setNowMs] = useState<number | null>(null);
    useEffect(() => {
        if (timer?.status !== "running") {
            return;
        }

        const intervalId = window.setInterval(() => {
            const currentTimeMs = performance.now();

            setNowMs(currentTimeMs);

            if (getCountdownRemainingMs(timer, currentTimeMs) === 0) {
                const completed = pauseCountdownTimer(
                    timer,
                    currentTimeMs,
                );

                if (completed.status === "success") {
                    setTimer(completed.timer);
                }
            }
        }, 100);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [timer]);

    const displayTime =
        `${displayHours}:${displayMinutes}:${displaySeconds}`;
    const remainingMs =
        timer !== null && nowMs !== null
            ? getCountdownRemainingMs(timer, nowMs)
            : null;
    const remainingSeconds =
        remainingMs !== null
            ? Math.ceil(remainingMs / 1000)
            : null;
    const remainingHours =
        remainingSeconds !== null
            ? Math.floor(remainingSeconds / 3600)
            : null;
    const remainingMinutes =
        remainingSeconds !== null
            ? Math.floor((remainingSeconds % 3600) / 60)
            : null;
    const remainingSecondsPart =
        remainingSeconds !== null
            ? remainingSeconds % 60
            : null;
    const remainingDisplayTime =
        remainingHours !== null &&
            remainingMinutes !== null &&
            remainingSecondsPart !== null
            ? `${String(remainingHours).padStart(2, "0")}:${String(remainingMinutes).padStart(2, "0")}:${String(remainingSecondsPart).padStart(2, "0")}`
            : null;

    const hoursNumber = Number(hours);
    const minutesNumber = Number(minutes);
    const secondsNumber = Number(seconds);

    const validInputs =
        hours.trim() !== "" &&
        minutes.trim() !== "" &&
        seconds.trim() !== "" &&
        Number.isInteger(hoursNumber) &&
        Number.isInteger(minutesNumber) &&
        Number.isInteger(secondsNumber) &&
        hoursNumber >= 0 &&
        hoursNumber <= 99 &&
        minutesNumber >= 0 &&
        minutesNumber <= 59 &&
        secondsNumber >= 0 &&
        secondsNumber <= 59;

    const durationMs = validInputs
        ? (hoursNumber * 3600 +
            minutesNumber * 60 +
            secondsNumber) * 1000
        : 0;

    const durationValidation = createCountdownTimer(durationMs);

    const isValidDuration =
        validInputs && durationValidation.status === "success";

    function handleStart() {
        if (!isValidDuration) {
            return;
        }

        const created = createCountdownTimer(durationMs);

        if (created.status !== "success") {
            return;
        }

        const startTimeMs = performance.now();

        const started = startCountdownTimer(
            created.timer,
            startTimeMs,
        );

        if (started.status !== "success") {
            return;
        }

        setTimer(started.timer);
        setNowMs(startTimeMs);
    }

    function handleResume() {
        if (timer?.status !== "paused") {
            return;
        }

        const resumeTimeMs = performance.now();

        const resumed = resumeCountdownTimer(
            timer,
            resumeTimeMs,
        );

        if (resumed.status !== "success") {
            return;
        }

        setTimer(resumed.timer);
        setNowMs(resumeTimeMs);
    }
    function handlePause() {
        if (timer?.status !== "running") {
            return;
        }

        const pauseTimeMs = performance.now();

        const paused = pauseCountdownTimer(
            timer,
            pauseTimeMs,
        );

        if (paused.status !== "success") {
            return;
        }

        setTimer(paused.timer);
        setNowMs(pauseTimeMs);
    }
    function handleReset() {
        if (timer === null) {
            return;
        }

        const reset = resetCountdownTimer(timer);

        setTimer(reset);
        setNowMs(null);
    }
    return (
        <section aria-label="Countdown timer controls">
            <h2>Set your countdown</h2>
            <p role="timer" aria-label="Countdown time">
                {remainingDisplayTime ?? displayTime}
            </p>
            {!isValidDuration && (
                <p role="alert">
                    Please enter a valid duration between
                    00:00:01 and 99:59:59.
                </p>
            )}

            <div>
                <label htmlFor="countdown-hours">Hours</label>
                <input
                    id="countdown-hours"
                    type="number"
                    min="0"
                    max="99"
                    step="1"
                    disabled={timer?.status === "running" || timer?.status === "paused"}
                    value={hours}
                    onChange={(event) => setHours(event.target.value)}
                />
            </div>

            <div>
                <label htmlFor="countdown-minutes">Minutes</label>
                <input
                    id="countdown-minutes"
                    type="number"
                    min="0"
                    max="59"
                    step="1"
                    disabled={timer?.status === "running" || timer?.status === "paused"}
                    value={minutes}
                    onChange={(event) => setMinutes(event.target.value)}
                />
            </div>

            <div>
                <label htmlFor="countdown-seconds">Seconds</label>
                <input
                    id="countdown-seconds"
                    type="number"
                    min="0"
                    max="59"
                    step="1"
                    disabled={timer?.status === "running" || timer?.status === "paused"}
                    value={seconds}
                    onChange={(event) => setSeconds(event.target.value)}
                />
            </div>
            <div>
                <button
                    type="button"
                    disabled={!isValidDuration || (timer !== null && timer.status !== "idle")}
                    onClick={handleStart}
                >
                    Start
                </button>

                <button
                    type="button"
                    disabled={timer?.status !== "running"}
                    onClick={handlePause}
                >
                    Pause
                </button>
                <button
                    type="button"
                    disabled={timer?.status !== "paused"}
                    onClick={handleResume}
                >
                    Resume
                </button>
                <button
                    type="button"
                    disabled={timer === null || timer.status === "idle"}
                    onClick={handleReset}
                >
                    Reset
                </button>
            </div>
        </section>
    );
}