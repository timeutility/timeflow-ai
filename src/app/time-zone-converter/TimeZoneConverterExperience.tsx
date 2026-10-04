"use client";

export default function TimeZoneConverterExperience() {
  return (
    <section>
      <div>
        <label htmlFor="source-location">From</label>
        <select id="source-location">
          <option>Melbourne</option>
          <option>New York</option>
        </select>
      </div>

      <div>
        <label htmlFor="local-date">Date</label>
        <input id="local-date" type="date" />
      </div>

      <div>
        <label htmlFor="local-time">Time</label>
        <input id="local-time" type="time" />
      </div>

      <div>
        <label htmlFor="destination-location">To</label>
        <select id="destination-location">
          <option>New York</option>
          <option>Melbourne</option>
        </select>
      </div>

      <button type="button">Convert</button>
    </section>
  );
}