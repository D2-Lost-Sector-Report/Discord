export function fromMinutes(minutes: number) {
  return minutes * 60 * 1000;
}

export function fromHours(hours: number) {
  return hours * 60 * 60 * 1000;
}

export function fromDays(days: number) {
  return days * 24 * 60 * 60 * 1000;
}

export function fromWeeks(weeks: number) {
  return weeks * 7 * 24 * 60 * 60 * 1000;
}