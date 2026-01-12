import { Calendar, ChevronLeft, ChevronRight,} from 'lucide-react';
import type { TimeView } from '@/lib/date-filter';

interface TimeViewSelectorProps {
  timeView: TimeView;
  selectedDate: Date;
  onTimeViewChange: (view: TimeView) => void;
  onNavigatePeriod: (direction: 'prev' | 'next') => void;
  periodLabel: string;
  hasFiltersActive: boolean;
  onClearFilters: () => void;
}

export function TimeViewSelector({
  timeView,
//   selectedDate,
  onTimeViewChange,
  onNavigatePeriod,
  periodLabel,
}: TimeViewSelectorProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-3 sm:p-4">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        {/* Time View Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {(['day', 'month', 'year', 'all'] as TimeView[]).map((view) => (
            <button
              key={view}
              onClick={() => onTimeViewChange(view)}
              className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                timeView === view
                  ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {view === 'day' && 'Ngày'}
              {view === 'month' && 'Tháng'}
              {view === 'year' && 'Năm'}
              {view === 'all' && 'Tất cả'}
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div className="hidden lg:block flex-1" />

        {/* Time Navigation - Same row on desktop, below on mobile */}
        {timeView !== 'all' && (
          <div className="flex items-center gap-2 sm:gap-2 px-3 sm:px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-lg flex-shrink-0">
            <button
              onClick={() => onNavigatePeriod('prev')}
              className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white min-w-[100px] sm:min-w-[120px] justify-center">
              <Calendar className="w-3 h-2 sm:w-3 sm:h-3" />
              <span className="whitespace-nowrap">{periodLabel}</span>
            </div>
            <button
              onClick={() => onNavigatePeriod('next')}
              className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
