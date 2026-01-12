import { useState } from 'react';

export type SortField = 'date' | 'description' | 'amount' | 'category' | 'notes';
export type SortFieldAggregated = 'date' | 'amount' | 'notes';
export type SortDirection = 'asc' | 'desc';

export function useExpenseSort() {
  // Sort for detail view (day, all)
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Sort for month view
  const [sortFieldMonth, setSortFieldMonth] = useState<SortFieldAggregated>('date');
  const [sortDirectionMonth, setSortDirectionMonth] = useState<SortDirection>('desc');
  
  // Sort for year view
  const [sortFieldYear, setSortFieldYear] = useState<SortFieldAggregated>('date');
  const [sortDirectionYear, setSortDirectionYear] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'date' || field === 'amount' ? 'desc' : 'asc');
    }
  };

  const handleSortMonth = (field: SortFieldAggregated) => {
    if (sortFieldMonth === field) {
      setSortDirectionMonth(sortDirectionMonth === 'asc' ? 'desc' : 'asc');
    } else {
      setSortFieldMonth(field);
      setSortDirectionMonth(field === 'date' || field === 'amount' ? 'desc' : 'asc');
    }
  };

  const handleSortYear = (field: SortFieldAggregated) => {
    if (sortFieldYear === field) {
      setSortDirectionYear(sortDirectionYear === 'asc' ? 'desc' : 'asc');
    } else {
      setSortFieldYear(field);
      setSortDirectionYear(field === 'date' || field === 'amount' ? 'desc' : 'asc');
    }
  };

  return {
    // Detail view sort
    sortField,
    sortDirection,
    handleSort,
    
    // Month view sort
    sortFieldMonth,
    sortDirectionMonth,
    handleSortMonth,
    
    // Year view sort
    sortFieldYear,
    sortDirectionYear,
    handleSortYear,
  };
}
