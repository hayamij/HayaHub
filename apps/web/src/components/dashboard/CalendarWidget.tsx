'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, TrendingUp } from 'lucide-react';
import { Container } from '@/infrastructure/di/Container';
import { useAuth } from '@/contexts/AuthContext';
import type { CalendarEventDTO } from 'hayahub-business';

export default function CalendarWidget() {
  const router = useRouter();
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEventDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    today: 0,
    week: 0,
    upcoming: 0,
  });

  useEffect(() => {
    const loadEvents = async () => {
      if (!user?.id) return;

      setIsLoading(true);
      try {
        const getCalendarEventsUseCase = Container.getCalendarEventsUseCase();
        const result = await getCalendarEventsUseCase.execute(user.id);

        if (result.success) {
          const allEvents = result.value;
          setEvents(allEvents);

          // Calculate stats
          const now = new Date();
          const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const todayEnd = new Date(todayStart);
          todayEnd.setHours(23, 59, 59, 999);

          const weekStart = new Date(todayStart);
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 6);
          weekEnd.setHours(23, 59, 59, 999);

          const todayEvents = allEvents.filter((e) => {
            const start = new Date(e.startDate);
            return start >= todayStart && start <= todayEnd;
          });

          const weekEvents = allEvents.filter((e) => {
            const start = new Date(e.startDate);
            return start >= weekStart && start <= weekEnd;
          });

          const upcomingEvents = allEvents.filter((e) => {
            const start = new Date(e.startDate);
            return start > now;
          }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

          setStats({
            today: todayEvents.length,
            week: weekEvents.length,
            upcoming: upcomingEvents.slice(0, 5).length,
          });
        }
      } catch (error) {
        console.error('Failed to load calendar events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, [user]);

  const upcomingEvents = events
    .filter((e) => new Date(e.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 5);

  const formatEventTime = (date: Date) => {
    return new Date(date).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      onClick={() => router.push('/calendar' as any)}
      className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Lịch
          </h3>
        </div>
        <TrendingUp className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Hôm nay</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.today}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Tuần này</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.week}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Sắp tới</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.upcoming}</p>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sự kiện sắp tới
            </p>
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors"
                >
                  <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatEventTime(event.startDate)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                Không có sự kiện sắp tới
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

