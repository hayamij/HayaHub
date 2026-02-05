'use client';

import type { CalendarEventDTO } from 'hayahub-business';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface YearViewProps {
  events: CalendarEventDTO[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onMonthClick: (month: number) => void;
}

export function YearView({ events, currentDate, onDateChange, onMonthClick }: YearViewProps) {
  const year = currentDate.getFullYear();

  const goToPrevYear = () => {
    onDateChange(new Date(year - 1, 0, 1));
  };

  const goToNextYear = () => {
    onDateChange(new Date(year + 1, 0, 1));
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const getEventsCountForMonth = (monthIndex: number) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startDate);
      return eventDate.getFullYear() === year && eventDate.getMonth() === monthIndex;
    }).length;
  };

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
    'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
    'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const renderMiniMonth = (monthIndex: number) => {
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthIndex, day);
      const isToday =
        date.toDateString() === new Date().toDateString();
      const hasEvents = events.some((event) => {
        const eventDate = new Date(event.startDate);
        return eventDate.toDateString() === date.toDateString();
      });

      days.push(
        <div
          key={day}
          className={`aspect-square flex items-center justify-center text-xs cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded ${
            isToday
              ? 'bg-blue-600 text-white font-bold'
              : hasEvents
              ? 'font-bold text-blue-600 dark:text-blue-400'
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Năm {year}
          </h2>
          <Button
            onClick={goToToday}
            variant="primary"
            size="sm"
          >
            Hôm nay
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevYear}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
            title="Năm trước"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNextYear}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
            title="Năm sau"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 12 months grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 p-6">
        {monthNames.map((monthName, monthIndex) => {
          const eventCount = getEventsCountForMonth(monthIndex);
          return (
            <div
              key={monthIndex}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md transition cursor-pointer bg-gray-50 dark:bg-gray-900/50"
              onClick={() => onMonthClick(monthIndex)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {monthName}
                </h3>
                {eventCount > 0 && (
                  <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                    {eventCount}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
                  <div
                    key={day}
                    className="text-[10px] text-gray-500 dark:text-gray-500 font-semibold"
                  >
                    {day}
                  </div>
                ))}
                {renderMiniMonth(monthIndex)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
