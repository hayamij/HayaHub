import { useMemo } from 'react';
import { ExpenseCategory } from 'hayahub-domain';
import type { ExpenseRow } from './useExpenseData';
import { filterByTimeView, getYearRange, getDayOfYear, type TimeView } from '@/lib/date-filter';

export interface CategorySummary {
  category: ExpenseCategory;
  total: number;
  count: number;
}

export function useExpenseStats(
  expenses: ExpenseRow[],
  timeView: TimeView,
  selectedDate: Date
) {
  // Calculate category summaries
  const categorySummaries = useMemo(() => {
    const filteredByTime = filterByTimeView(expenses, timeView, selectedDate);
    const summaries = new Map<ExpenseCategory, { total: number; count: number }>();

    filteredByTime.forEach((expense) => {
      const current = summaries.get(expense.category) || { total: 0, count: 0 };
      summaries.set(expense.category, {
        total: current.total + expense.amount,
        count: current.count + 1,
      });
    });

    return Array.from(summaries.entries())
      .map(([category, { total, count }]) => ({ category, total, count }))
      .sort((a, b) => b.total - a.total);
  }, [expenses, timeView, selectedDate]);

  // Calculate display total (for card)
  const displayData = useMemo(() => {
    const displayExpenses = timeView === 'all' 
      ? expenses 
      : filterByTimeView(expenses, 'year', selectedDate);
    
    const displayTotalAmount = displayExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    return {
      totalAmount: displayTotalAmount,
      transactionCount: displayExpenses.length,
    };
  }, [expenses, timeView, selectedDate]);

  // Calculate year comparison
  const yearComparison = useMemo(() => {
    if (timeView === 'all') {
      return { percentage: 0, isIncrease: false, prevYearAmount: 0 };
    }

    const selectedYear = selectedDate.getFullYear();
    const now = new Date();
    const currentYear = new Date().getFullYear();
    const isCurrentYear = selectedYear === currentYear;
    
    let currentYearAmount: number;
    let comparisonEndDate: Date;
    
    if (isCurrentYear) {
      // Year-to-date comparison
      const yearRange = getYearRange(selectedYear);
      const dayOfYear = getDayOfYear(now);
      comparisonEndDate = new Date(selectedYear - 1, 0, 1 + dayOfYear, 23, 59, 59, 999);
      
      currentYearAmount = expenses
        .filter(exp => new Date(exp.date) >= yearRange.start && new Date(exp.date) <= now)
        .reduce((sum, e) => sum + e.amount, 0);
    } else {
      // Full year comparison
      comparisonEndDate = new Date(selectedYear - 1, 11, 31, 23, 59, 59, 999);
      currentYearAmount = displayData.totalAmount;
    }
    
    // Get previous year amount
    const prevYearRange = getYearRange(selectedYear - 1);
    const prevYearAmount = expenses
      .filter(exp => {
        const expDate = new Date(exp.date);
        return expDate >= prevYearRange.start && expDate <= comparisonEndDate;
      })
      .reduce((sum, e) => sum + e.amount, 0);
    
    if (prevYearAmount === 0) {
      return { 
        percentage: currentYearAmount > 0 ? 100 : 0, 
        isIncrease: currentYearAmount > 0,
        prevYearAmount 
      };
    }

    const change = ((currentYearAmount - prevYearAmount) / prevYearAmount) * 100;
    return { 
      percentage: Math.abs(change), 
      isIncrease: change > 0,
      prevYearAmount 
    };
  }, [expenses, timeView, selectedDate, displayData.totalAmount]);

  return {
    categorySummaries,
    displayTotalAmount: displayData.totalAmount,
    displayTransactionCount: displayData.transactionCount,
    yearComparison,
  };
}
