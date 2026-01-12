/**
 * Shared utility functions for expense aggregation and grouping
 * Following DRY principle and Clean Architecture
 */

import { ExpenseCategory } from 'hayahub-domain';

/**
 * Generic expense interface with only required fields for aggregation
 * This allows the utility to work with any expense-like object
 */
export interface AggregableExpense {
  date: Date;
  amount: number;
  category: ExpenseCategory;
  notes: string;
}

/**
 * Aggregated data for a specific time period (day, month, etc.)
 */
export interface AggregatedPeriod {
  /** Unique ID for this aggregated period (for editing) */
  id: string;
  
  /** Period key (e.g., "2024-01-15" for day, "2024-01" for month) */
  periodKey: string;
  
  /** Display label (e.g., "15/01/2024" for day, "Tháng 1/2024" for month) */
  periodLabel: string;
  
  /** Date representing this period (for navigation) */
  periodDate: Date;
  
  /** Total amount for this period */
  totalAmount: number;
  
  /** Category counts and totals */
  categories: CategoryCount[];
  
  /** User-editable notes for this aggregated period (independent field) */
  notes: string;
  
  /** Number of transactions in this period */
  transactionCount: number;
  
  /** Raw expenses for this period (for drill-down) */
  expenses: AggregableExpense[];
}

/**
 * Category count with total amount
 */
export interface CategoryCount {
  category: ExpenseCategory;
  count: number;
  total: number;
}

/**
 * Group expenses by day
 * @param expenses - Array of expenses to group
 * @returns Array of aggregated day data, sorted by date descending
 */
export function groupExpensesByDay(
  expenses: AggregableExpense[]
): AggregatedPeriod[] {
  // Group by day key (YYYY-MM-DD)
  const grouped = new Map<string, AggregableExpense[]>();

  expenses.forEach((expense) => {
    const date = new Date(expense.date);
    const dayKey = formatDateKey(date);
    
    if (!grouped.has(dayKey)) {
      grouped.set(dayKey, []);
    }
    grouped.get(dayKey)!.push(expense);
  });

  // Convert to aggregated periods
  const result: AggregatedPeriod[] = [];

  grouped.forEach((dayExpenses, dayKey) => {
    const periodDate = parseDateKey(dayKey);
    const categories = aggregateCategories(dayExpenses);
    const totalAmount = dayExpenses.reduce((sum, e) => sum + e.amount, 0);

    result.push({
      id: `day-${dayKey}`,
      periodKey: dayKey,
      periodLabel: formatDayLabel(periodDate),
      periodDate,
      totalAmount,
      categories,
      notes: '', // Independent notes field - user can edit
      transactionCount: dayExpenses.length,
      expenses: dayExpenses,
    });
  });

  // Sort by date descending (most recent first)
  return result.sort((a, b) => b.periodDate.getTime() - a.periodDate.getTime());
}

/**
 * Group expenses by month
 * @param expenses - Array of expenses to group
 * @returns Array of aggregated month data, sorted by date descending
 */
export function groupExpensesByMonth(
  expenses: AggregableExpense[]
): AggregatedPeriod[] {
  // Group by month key (YYYY-MM)
  const grouped = new Map<string, AggregableExpense[]>();

  expenses.forEach((expense) => {
    const date = new Date(expense.date);
    const monthKey = formatMonthKey(date);
    
    if (!grouped.has(monthKey)) {
      grouped.set(monthKey, []);
    }
    grouped.get(monthKey)!.push(expense);
  });

  // Convert to aggregated periods
  const result: AggregatedPeriod[] = [];

  grouped.forEach((monthExpenses, monthKey) => {
    const periodDate = parseMonthKey(monthKey);
    const categories = aggregateCategories(monthExpenses);
    const totalAmount = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

    result.push({
      id: `month-${monthKey}`,
      periodKey: monthKey,
      periodLabel: formatMonthLabel(periodDate),
      periodDate,
      totalAmount,
      categories,
      notes: '', // Independent notes field - user can edit
      transactionCount: monthExpenses.length,
      expenses: monthExpenses,
    });
  });

  // Sort by date descending (most recent first)
  return result.sort((a, b) => b.periodDate.getTime() - a.periodDate.getTime());
}

/**
 * Aggregate expenses by category, counting occurrences and totaling amounts
 * @param expenses - Array of expenses to aggregate
 * @returns Array of category counts, sorted by total amount descending
 */
export function aggregateCategories(expenses: AggregableExpense[]): CategoryCount[] {
  const categoryMap = new Map<ExpenseCategory, { count: number; total: number }>();

  expenses.forEach((expense) => {
    const current = categoryMap.get(expense.category) || { count: 0, total: 0 };
    categoryMap.set(expense.category, {
      count: current.count + 1,
      total: current.total + expense.amount,
    });
  });

  const result: CategoryCount[] = [];
  categoryMap.forEach((value, category) => {
    result.push({
      category,
      count: value.count,
      total: value.total,
    });
  });

  // Sort by total amount descending
  return result.sort((a, b) => b.total - a.total);
}

/**
 * Format category summary string
 * Example: "ăn uống (3), khác (2), di chuyển (1)"
 * @param categories - Array of category counts
 * @param categoryLabels - Mapping of category enum to Vietnamese labels
 * @param maxCategories - Maximum number of categories to show (default: 3)
 * @returns Formatted category summary string
 */
export function formatCategorySummary(
  categories: CategoryCount[],
  categoryLabels: Record<ExpenseCategory, string>,
  maxCategories: number = 3
): string {
  if (categories.length === 0) {
    return '-';
  }

  const visible = categories.slice(0, maxCategories);
  const parts = visible.map((cat) => {
    const label = categoryLabels[cat.category];
    return `${label} (${cat.count})`;
  });

  if (categories.length > maxCategories) {
    const remaining = categories.length - maxCategories;
    parts.push(`+${remaining} khác`);
  }

  return parts.join(', ');
}

/**
 * Format date as day key (YYYY-MM-DD)
 */
function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse day key (YYYY-MM-DD) to Date
 */
function parseDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Format date as month key (YYYY-MM)
 */
function formatMonthKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Parse month key (YYYY-MM) to Date (first day of month)
 */
function parseMonthKey(key: string): Date {
  const [year, month] = key.split('-').map(Number);
  return new Date(year, month - 1, 1);
}

/**
 * Format date as day label (dd/mm/yyyy)
 */
function formatDayLabel(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Format date as month label (Tháng M/yyyy)
 */
function formatMonthLabel(date: Date): string {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `Tháng ${month}/${year}`;
}

/**
 * Format time as HH:mm
 */
export function formatTimeOnly(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}
