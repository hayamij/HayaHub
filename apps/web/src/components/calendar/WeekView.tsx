'use client';

import type { CalendarEventDTO } from 'hayahub-business';
import { EventPriority } from 'hayahub-domain';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface WeekViewProps {
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

export function WeekView({ events, currentDate, onDateChange, onEventClick, onDateClick }: WeekViewProps) {
  // Get start of week (Sunday)
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  // Generate 7 days of the week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  const goToPrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    onDateChange(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toDateString();
    return events.filter((event) => {
      const eventStart = new Date(event.startDate);
      return eventStart.toDateString() === dateStr;
    });
  };

  const formatWeekRange = () => {
    const start = weekDays[0];
    const end = weekDays[6];
    return `${start.getDate()} Th${start.getMonth() + 1} - ${end.getDate()} Th${end.getMonth() + 1}, ${end.getFullYear()}`;
  };

  const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

  // Time slots from 6 AM to 11 PM
  const timeSlots = Array.from({ length: 18 }, (_, i) => i + 6);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {formatWeekRange()}
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
            onClick={goToPrevWeek}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
            title="Tuần trước"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNextWeek}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
            title="Tuần sau"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Week grid */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Day headers */}
          <div className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="p-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">
              Giờ
            </div>
            {weekDays.map((date, i) => {
              const today = isToday(date);
              return (
                <div
                  key={i}
                  className={`p-2 text-center border-l border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    today ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                  }`}
                  onClick={() => onDateClick(date)}
                >
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                    {dayNames[i]}
                  </div>
                  <div
                    className={`text-lg font-bold mt-1 ${
                      today
                        ? 'w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {date.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time slots */}
          <div className="grid grid-cols-8">
            {timeSlots.map((hour) => (
              <div key={hour} className="contents">
                {/* Time label */}
                <div className="p-2 text-xs text-gray-600 dark:text-gray-400 text-right border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  {hour}:00
                </div>
                {/* Day cells */}
                {weekDays.map((date, i) => {
                  const dayEvents = getEventsForDate(date).filter((event) => {
                    if (event.isAllDay) return hour === 6; // Show all-day at first hour
                    const eventHour = new Date(event.startDate).getHours();
                    return eventHour === hour;
                  });

                  return (
                    <div
                      key={`${hour}-${i}`}
                      className="min-h-[60px] border-l border-b border-gray-200 dark:border-gray-700 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/10 cursor-pointer transition"
                      onClick={() => {
                        const clickDate = new Date(date);
                        clickDate.setHours(hour, 0, 0, 0);
                        onDateClick(clickDate);
                      }}
                    >
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventClick(event);
                          }}
                          className={`text-xs px-2 py-1 rounded text-white mb-1 cursor-pointer hover:opacity-80 ${
                            PRIORITY_COLORS[event.priority]
                          }`}
                          title={event.title}
                        >
                          {event.isAllDay ? '🔷 ' : ''}
                          <div className="font-semibold truncate">{event.title}</div>
                          {!event.isAllDay && (
                            <div className="text-[10px] opacity-90">
                              {new Date(event.startDate).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
