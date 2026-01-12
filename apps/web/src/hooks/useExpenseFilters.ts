import { useState } from 'react';
import { ExpenseCategory } from 'hayahub-domain';
import type { TimeView } from '@/lib/date-filter';

export interface ExpenseFilters {
  timeView: TimeView;
  selectedDate: Date;
  selectedCategory: ExpenseCategory | null;
  searchQuery: string;
}

export function useExpenseFilters() {
  const [timeView, setTimeView] = useState<TimeView>('month');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const setFilters = (filters: Partial<ExpenseFilters>) => {
    if (filters.timeView !== undefined) setTimeView(filters.timeView);
    if (filters.selectedDate !== undefined) setSelectedDate(new Date(filters.selectedDate));
    if (filters.selectedCategory !== undefined) setSelectedCategory(filters.selectedCategory);
    if (filters.searchQuery !== undefined) setSearchQuery(filters.searchQuery);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
  };

  const navigatePeriod = (direction: 'prev' | 'next') => {
    const delta = direction === 'next' ? 1 : -1;
    
    setSelectedDate(prevDate => {
      const newDate = new Date(prevDate);
      if (timeView === 'day') newDate.setDate(newDate.getDate() + delta);
      else if (timeView === 'month') newDate.setMonth(newDate.getMonth() + delta);
      else if (timeView === 'year') newDate.setFullYear(newDate.getFullYear() + delta);
      return newDate;
    });
  };

  const toggleCategory = (category: ExpenseCategory) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  return {
    // State
    timeView,
    selectedDate,
    selectedCategory,
    searchQuery,
    
    // Actions
    setTimeView,
    setSelectedDate: (date: Date) => setSelectedDate(new Date(date)),
    setSelectedCategory,
    setSearchQuery,
    setFilters,
    clearFilters,
    navigatePeriod,
    toggleCategory,
  };
}
