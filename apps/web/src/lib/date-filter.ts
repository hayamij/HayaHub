/**
 * Shared Date Filtering Utilities
 * Single source of truth for date range calculations
 * Follows DRY principle and Single Responsibility
 */

export type TimeView = 'day' | 'month' | 'year' | 'all';

export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Get date range based on time view and selected date
 * @param view - Time view (day, month, year, all)
 * @param date - Selected date
 * @returns DateRange object with start and end dates
 */
export function getDateRangeForView(view: TimeView, date: Date): DateRange | null {
  if (view === 'all') return null;

  const ranges: Record<Exclude<TimeView, 'all'>, DateRange> = {
    day: {
      start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0),
      end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999),
    },
    month: {
      start: new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0),
      end: new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999),
    },
    year: {
      start: new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0),
      end: new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999),
    },
  };

  return ranges[view as Exclude<TimeView, 'all'>];
}

/**
 * Filter items by date range based on time view
 * Generic function that works with any object having a date property
 */
export function filterByTimeView<T extends { date: Date | string }>(
  items: T[],
  view: TimeView,
  selectedDate: Date
): T[] {
  if (view === 'all') return items;

  const range = getDateRangeForView(view, selectedDate);
  if (!range) return items;

  return items.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= range.start && itemDate <= range.end;
  });
}

/**
 * Check if a date is within a specific date range
 */
export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end;
}

/**
 * Get today's date range (00:00:00 - 23:59:59)
 */
export function getTodayRange(): DateRange {
  const now = new Date();
  return {
    start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0),
    end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999),
  };
}

/**
 * Get current week's date range (Monday to Sunday)
 */
export function getWeekRange(referenceDate: Date = new Date()): DateRange {
  const dayOfWeek = referenceDate.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  
  const start = new Date(referenceDate);
  start.setDate(referenceDate.getDate() + mondayOffset);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
}

/**
 * Get current month's date range
 */
export function getMonthRange(year?: number, month?: number): DateRange {
  const now = new Date();
  const targetYear = year ?? now.getFullYear();
  const targetMonth = month ?? now.getMonth();
  
  return {
    start: new Date(targetYear, targetMonth, 1, 0, 0, 0, 0),
    end: new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999),
  };
}

/**
 * Get year's date range
 */
export function getYearRange(year?: number): DateRange {
  const targetYear = year ?? new Date().getFullYear();
  
  return {
    start: new Date(targetYear, 0, 1, 0, 0, 0, 0),
    end: new Date(targetYear, 11, 31, 23, 59, 59, 999),
  };
}

/**
 * Calculate day of year (1-365/366)
 */
export function getDayOfYear(date: Date): number {
  const yearStart = new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0);
  return Math.floor((date.getTime() - yearStart.getTime()) / 86400000);
}
