import { useMemo, useState } from 'react';
import type { ExpenseRow } from './useExpenseData';
import { ExpenseCategory } from 'hayahub-domain';
import { filterByTimeView, type TimeView } from '@/lib/date-filter';
import { groupExpensesByDay, groupExpensesByMonth, type AggregatedPeriod } from '@/lib/expense-aggregation';
import type { SortField, SortFieldAggregated, SortDirection } from './useExpenseSort';

interface UseExpenseAggregationProps {
  expenses: ExpenseRow[];
  timeView: TimeView;
  selectedDate: Date;
  selectedCategory: ExpenseCategory | null;
  searchQuery: string;
  sortField: SortField;
  sortDirection: SortDirection;
  sortFieldMonth: SortFieldAggregated;
  sortDirectionMonth: SortDirection;
  sortFieldYear: SortFieldAggregated;
  sortDirectionYear: SortDirection;
  categoryLabels: Record<ExpenseCategory, string>;
}

export function useExpenseAggregation({
  expenses,
  timeView,
  selectedDate,
  selectedCategory,
  searchQuery,
  sortField,
  sortDirection,
  sortFieldMonth,
  sortDirectionMonth,
  sortFieldYear,
  sortDirectionYear,
  categoryLabels,
}: UseExpenseAggregationProps) {
  // Store for aggregated period notes (independent from expense notes)
  const [periodNotes, setPeriodNotes] = useState<Map<string, string>>(new Map());

  // Filter expenses
  const filteredExpenses = useMemo(() => {
    let filtered = filterByTimeView(expenses, timeView, selectedDate);

    if (selectedCategory) {
      filtered = filtered.filter((expense) => expense.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (expense) =>
          expense.description.toLowerCase().includes(query) ||
          expense.amount.toString().includes(query) ||
          expense.notes.toLowerCase().includes(query) ||
          categoryLabels[expense.category].toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [expenses, timeView, selectedDate, selectedCategory, searchQuery, categoryLabels]);

  // Sort filtered expenses for detail views
  const sortedExpenses = useMemo(() => {
    return [...filteredExpenses].sort((a, b) => {
      const getValue = (exp: ExpenseRow) => {
        switch (sortField) {
          case 'date': return exp.date.getTime();
          case 'description': return exp.description.toLowerCase();
          case 'amount': return exp.amount;
          case 'category': return categoryLabels[exp.category].toLowerCase();
          case 'notes': return exp.notes.toLowerCase();
        }
      };

      const aValue = getValue(a);
      const bValue = getValue(b);
      const direction = sortDirection === 'asc' ? 1 : -1;

      if (aValue < bValue) return -direction;
      if (aValue > bValue) return direction;
      return 0;
    });
  }, [filteredExpenses, sortField, sortDirection, categoryLabels]);

  // Aggregate data for month/year views
  const aggregatedData = useMemo(() => {
    let aggregated: AggregatedPeriod[] = [];
    
    if (timeView === 'month') {
      aggregated = groupExpensesByDay(filteredExpenses);
    } else if (timeView === 'year') {
      aggregated = groupExpensesByMonth(filteredExpenses);
    }

    // Apply stored notes to aggregated periods
    return aggregated.map(period => ({
      ...period,
      notes: periodNotes.get(period.id) || period.notes
    }));
  }, [filteredExpenses, timeView, periodNotes]);

  // Sort aggregated data
  const sortedAggregatedData = useMemo(() => {
    const field = timeView === 'month' ? sortFieldMonth : sortFieldYear;
    const direction = timeView === 'month' ? sortDirectionMonth : sortDirectionYear;

    return [...aggregatedData].sort((a, b) => {
      const getValue = (period: AggregatedPeriod) => {
        switch (field) {
          case 'date': return period.periodDate.getTime();
          case 'amount': return period.totalAmount;
          case 'notes': return period.notes.toLowerCase();
          default: return 0;
        }
      };

      const aValue = getValue(a);
      const bValue = getValue(b);
      const dir = direction === 'asc' ? 1 : -1;

      if (aValue < bValue) return -dir;
      if (aValue > bValue) return dir;
      return 0;
    });
  }, [aggregatedData, timeView, sortFieldMonth, sortDirectionMonth, sortFieldYear, sortDirectionYear]);

  const updatePeriodNotes = (periodId: string, notes: string) => {
    const newNotes = new Map(periodNotes);
    newNotes.set(periodId, notes);
    setPeriodNotes(newNotes);
  };

  const removePeriodNotes = (periodId: string) => {
    const newNotes = new Map(periodNotes);
    newNotes.delete(periodId);
    setPeriodNotes(newNotes);
  };

  return {
    filteredExpenses,
    sortedExpenses,
    aggregatedData,
    sortedAggregatedData,
    periodNotes,
    updatePeriodNotes,
    removePeriodNotes,
  };
}
