'use client';

import { CalendarEventDTO } from 'hayahub-business';
import { Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';

interface CalendarStatsCardsProps {
  events: CalendarEventDTO[];
}

export function CalendarStatsCards({ events }: CalendarStatsCardsProps) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);

  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  // Today's events
  const todayEvents = events.filter((e) => {
    const start = new Date(e.startDate);
    return start >= todayStart && start < todayEnd;
  });

  // This week's events
  const weekEvents = events.filter((e) => {
    const start = new Date(e.startDate);
    return start >= weekStart && start < weekEnd;
  });

  // Upcoming events (next 30 days)
  const futureDate = new Date(todayStart);
  futureDate.setDate(futureDate.getDate() + 30);
  const upcomingEvents = events.filter((e) => {
    const start = new Date(e.startDate);
    return start >= todayStart && start < futureDate;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Today Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Hôm nay</h3>
          <CalendarIcon className="w-5 h-5 text-blue-500" />
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {todayEvents.length}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {todayEvents.length === 0 ? 'Không có sự kiện' : 'sự kiện'}
        </p>
      </div>

      {/* This Week Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Tuần này</h3>
          <Clock className="w-5 h-5 text-green-500" />
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {weekEvents.length}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {weekEvents.length === 0 ? 'Không có sự kiện' : 'sự kiện'}
        </p>
      </div>

      {/* Upcoming Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Sắp tới (30 ngày)</h3>
          <AlertCircle className="w-5 h-5 text-orange-500" />
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {upcomingEvents.length}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {upcomingEvents.length === 0 ? 'Không có sự kiện' : 'sự kiện'}
        </p>
      </div>
    </div>
  );
}
