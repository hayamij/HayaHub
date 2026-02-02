/**
 * Convert Date to local date string in YYYY-MM-DD format
 * This ensures the date reflects the user's local timezone (e.g., UTC+7 for Vietnam)
 * instead of UTC which can cause off-by-one day errors
 */
export function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Convert Date to local time string in HH:mm format
 */
export function toLocalTimeString(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}
