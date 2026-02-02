'use client';

import type { CalendarEventDTO } from 'hayahub-business';
import { EventPriority } from 'hayahub-domain';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthViewProps {
  events: CalendarEventDTO[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onEventClick: (event: CalendarEventDTO) => void;
  onDateClick: (date: Date) => void;
}

const PRIORITY_COLORS: Record<EventPriority, string> = {
  [EventPriority.LOW]: 'bg-gray-500',
  [EventPriority.MEDIUM]: 'bg-blue-500',
  [EventPriority.HIGH]: 'bg-red-500',
};

export function MonthView({ events, currentDate, onDateChange, onEventClick, onDateClick }: MonthViewProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and calculate grid
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Previous month days to fill
  const prevMonth = new Date(year, month, 0);
  const daysInPrevMonth = prevMonth.getDate();
  const prevMonthDays = Array.from(
    { length: startingDayOfWeek },
    (_, i) => daysInPrevMonth - startingDayOfWeek + i + 1
  );

  // Current month days
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Next month days to fill (to make 6 rows of 7 days = 42 cells)
  const totalCells = 42;
  const nextMonthDays = Array.from(
    { length: totalCells - prevMonthDays.length - currentMonthDays.length },
    (_, i) => i + 1
  );

  const goToPrevMonth = () => {
    onDateChange(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    onDateChange(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const isToday = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const getEventsForDate = (day: number, monthOffset: number) => {
    const date = new Date(year, month + monthOffset, day);
    const dateStr = date.toDateString();
    return events.filter((event) => {
      const eventStart = new Date(event.startDate);
      return eventStart.toDateString() === dateStr;
    });
  };

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {monthNames[month]} {year}
          </h2>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Hôm nay
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
            title="Tháng trước"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
            title="Tháng sau"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        {dayNames.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {/* Previous month days */}
        {prevMonthDays.map((day) => {
          const dayEvents = getEventsForDate(day, -1);
          return (
            <div
              key={`prev-${day}`}
              className="min-h-[100px] border-r border-b border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-900/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => onDateClick(new Date(year, month - 1, day))}
            >
              <div className="text-sm text-gray-400 dark:text-gray-600">{day}</div>
              <div className="space-y-1 mt-1">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    className={`text-xs px-1 py-0.5 rounded text-white truncate cursor-pointer hover:opacity-80 ${
                      PRIORITY_COLORS[event.priority]
                    }`}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500">+{dayEvents.length - 2} khác</div>
                )}
              </div>
            </div>
          );
        })}

        {/* Current month days */}
        {currentMonthDays.map((day) => {
          const dayEvents = getEventsForDate(day, 0);
          const today = isToday(day, true);
          return (
            <div
              key={`current-${day}`}
              className={`min-h-[100px] border-r border-b border-gray-200 dark:border-gray-700 p-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition ${
                today ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-white dark:bg-gray-800'
              }`}
              onClick={() => onDateClick(new Date(year, month, day))}
            >
              <div
                className={`text-sm font-semibold ${
                  today
                    ? 'w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center'
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                {day}
              </div>
              <div className="space-y-1 mt-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    className={`text-xs px-1 py-0.5 rounded text-white truncate cursor-pointer hover:opacity-80 ${
                      PRIORITY_COLORS[event.priority]
                    }`}
                    title={event.title}
                  >
                    {event.isAllDay ? '🔷 ' : ''}
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    +{dayEvents.length - 3} khác
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Next month days */}
        {nextMonthDays.map((day) => {
          const dayEvents = getEventsForDate(day, 1);
          return (
            <div
              key={`next-${day}`}
              className="min-h-[100px] border-r border-b border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-900/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => onDateClick(new Date(year, month + 1, day))}
            >
              <div className="text-sm text-gray-400 dark:text-gray-600">{day}</div>
              <div className="space-y-1 mt-1">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    className={`text-xs px-1 py-0.5 rounded text-white truncate cursor-pointer hover:opacity-80 ${
                      PRIORITY_COLORS[event.priority]
                    }`}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500">+{dayEvents.length - 2} khác</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
