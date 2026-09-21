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

export const getCurrentDay = () => {
  // Get current UTC date and hour
  const now = new Date();
  const utcHour = now.getUTCHours();

  // If before 17:00 UTC, subtract one day
  if (utcHour < 17) {
    now.setUTCDate(now.getUTCDate() - 1);
  }

  // Format as YYYY-MM-DD
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}