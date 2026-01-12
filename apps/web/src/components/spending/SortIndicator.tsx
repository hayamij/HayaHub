import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { SortField, SortDirection } from '@/hooks/useExpenseSort';

interface SortIndicatorProps {
  field: SortField;
  currentField: SortField;
  currentDirection: SortDirection;
}

export function SortIndicator({ field, currentField, currentDirection }: SortIndicatorProps) {
  if (currentField !== field) {
    return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
  }
  return currentDirection === 'asc' ? (
    <ArrowUp className="w-4 h-4 text-gray-900 dark:text-white" />
  ) : (
    <ArrowDown className="w-4 h-4 text-gray-900 dark:text-white" />
  );
}
