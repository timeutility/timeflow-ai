import TimeDifferenceCalculatorExperience from "./TimeDifferenceCalculatorExperience";

export default function TimeDifferenceCalculatorPage() {
  return (
    <main>
      <h1>Time Difference Calculator</h1>
      <p>
        Calculate the elapsed time between two dates and times,
        accounting for time zones and daylight-saving transitions.
      </p>

      <TimeDifferenceCalculatorExperience />
    </main>
  );
}