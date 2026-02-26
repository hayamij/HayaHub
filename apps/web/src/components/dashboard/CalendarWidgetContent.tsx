'use client';

import { useEffect, useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { container } from '@/infrastructure/di/Container';
import { useAuth } from '@/contexts/AuthContext';
import type { CalendarEventDTO } from 'hayahub-business';

export default function CalendarWidgetContent() {
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
        const getCalendarEventsUseCase = container.getCalendarEventsUseCase;
        const result = await getCalendarEventsUseCase.execute(user.id);

        if (result.success) {
          const allEvents = result.value;
          setEvents(allEvents);

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
            upcoming: upcomingEvents.length,
          });
        }
      } catch (error) {
        console.error('Failed to load events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, [user]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-400">Đang tải...</div>
      </div>
    );
  }

  const upcomingEvents = events
    .filter((e) => new Date(e.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3);

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
          <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">Hôm nay</div>
          <div className="text-xl font-bold text-blue-700 dark:text-blue-300">{stats.today}</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg">
          <div className="text-xs text-purple-600 dark:text-purple-400 mb-1">Tuần này</div>
          <div className="text-xl font-bold text-purple-700 dark:text-purple-300">{stats.week}</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
          <div className="text-xs text-green-600 dark:text-green-400 mb-1">Sắp tới</div>
          <div className="text-xl font-bold text-green-700 dark:text-green-300">{stats.upcoming}</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Sự kiện sắp tới</h4>
        {upcomingEvents.length === 0 ? (
          <div className="text-sm text-gray-400 dark:text-gray-500">Không có sự kiện nào</div>
        ) : (
          <div className="space-y-2">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {event.title}
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3" />
                      {new Date(event.startDate).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                      })}{' '}
                      - {new Date(event.startDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
