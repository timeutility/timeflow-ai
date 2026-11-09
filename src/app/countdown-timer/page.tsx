import CountdownTimerExperience from "./CountdownTimerExperience";

export default function CountdownTimerPage() {
  return (
    <main>
      <h1>Countdown Timer</h1>
      <p>
        Set a countdown duration in hours, minutes, and seconds.
        Start, pause, resume, or reset your timer whenever needed.
      </p>

      <CountdownTimerExperience />
    </main>
  );
}