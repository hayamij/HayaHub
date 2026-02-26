'use client';

import { useEffect, useState, useCallback } from 'react';
import { container } from '@/infrastructure/di/Container';
import type { CalendarEventDTO } from 'hayahub-business';

interface CalendarWidgetStats {
  today: number;
  week: number;
  upcoming: number;
}

interface UseCalendarWidgetReturn {
  events: CalendarEventDTO[];
  upcomingEvents: CalendarEventDTO[];
  stats: CalendarWidgetStats;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom Hook for Calendar Widget
 * Encapsulates calendar data fetching and stats calculation
 * Follows Clean Architecture by accessing business layer through hooks
 */
export function useCalendarWidget(userId: string | undefined): UseCalendarWidgetReturn {
  const [events, setEvents] = useState<CalendarEventDTO[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEventDTO[]>([]);
  const [stats, setStats] = useState<CalendarWidgetStats>({
    today: 0,
    week: 0,
    upcoming: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const calculateStats = useCallback((allEvents: CalendarEventDTO[]) => {
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

    const upcoming = allEvents
      .filter((e) => {
        const start = new Date(e.startDate);
        return start > now;
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    setStats({
      today: todayEvents.length,
      week: weekEvents.length,
      upcoming: upcoming.length,
    });

    setUpcomingEvents(upcoming.slice(0, 5));
  }, []);

  const loadEvents = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const getCalendarEventsUseCase = container.getCalendarEventsUseCase;
      const result = await getCalendarEventsUseCase.execute(userId);

      if (result.success) {
        const allEvents = result.value;
        setEvents(allEvents);
        calculateStats(allEvents);
      } else {
        setError(new Error('Failed to load calendar events'));
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, calculateStats]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return {
    events,
    upcomingEvents,
    stats,
    isLoading,
    error,
    refetch: loadEvents,
  };
}
