import type { Metadata } from "next";
import StopwatchTimer from "@/components/StopwatchTimer";

export const metadata: Metadata = {
  title: "Online Stopwatch | TimeFlow AI",
  description:
    "Use the free TimeFlow AI online stopwatch to measure elapsed time, record laps, and track split times.",
};

export default function StopwatchPage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Free Online Stopwatch
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-zinc-600">
            Measure elapsed time, record laps, and track
            split times with the TimeFlow AI Stopwatch.
          </p>
        </header>

        <StopwatchTimer />
      </div>
    </main>
  );
}