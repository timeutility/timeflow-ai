export type FormatMeetingResultInput = {
    start: Date;
    end: Date;
    timeZone: string;
};

export function formatMeetingResult({
    start,
    end,
    timeZone,
}: FormatMeetingResultInput): string {
    const dateFormatter = new Intl.DateTimeFormat("en-AU", {
        timeZone,
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const timeFormatter = new Intl.DateTimeFormat("en-AU", {
        timeZone,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    const startDate = dateFormatter.format(start);
    const endDate = dateFormatter.format(end);

    const startTime = timeFormatter.format(start);
    const endTime = timeFormatter.format(end);

    if (startDate === endDate) {
        return `${startDate} — ${startTime} to ${endTime}`;
    }

    return `${startDate} at ${startTime} to ${endDate} at ${endTime}`;
}