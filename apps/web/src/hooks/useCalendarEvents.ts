'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { container } from '@/infrastructure/di/Container';
import type { CalendarEventDTO, CreateCalendarEventDTO, UpdateCalendarEventDTO } from 'hayahub-business';

export type CalendarView = 'month' | 'week' | 'day';

export interface UseCalendarEventsResult {
  events: CalendarEventDTO[];
  loading: boolean;
  error: string | null;
  currentDate: Date;
  view: CalendarView;
  setView: (view: CalendarView) => void;
  goToToday: () => void;
  goToPrevious: () => void;
  goToNext: () => void;
  setCurrentDate: (date: Date) => void;
  createEvent: (dto: Omit<CalendarEventDTO, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEvent: (id: string, dto: Partial<CalendarEventDTO>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * Custom Hook for Calendar Events Management
 * Uses use cases properly following Clean Architecture
 */
export function useCalendarEvents(initialView: CalendarView = 'month'): UseCalendarEventsResult {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEventDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>(initialView);

  const fetchEvents = useCallback(async () => {
    if (!user) {
      setEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Calculate date range based on current view
      const { startDate, endDate } = getDateRange(currentDate, view);
      
      // Use GetCalendarEventsUseCase instead of direct repository access
      const getCalendarEventsUseCase = container.getCalendarEventsUseCase;
      const result = await getCalendarEventsUseCase.execute(user.id, startDate, endDate);
      
      if (result.isSuccess()) {
        setEvents(result.value);
      } else {
        setError(result.error.message);
        setEvents([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [user, currentDate, view]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const createEvent = async (dto: Omit<CalendarEventDTO, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('User not authenticated');

    const createCalendarEventUseCase = container.createCalendarEventUseCase;
    const result = await createCalendarEventUseCase.execute({
      ...dto,
      userId: user.id,
    } as CreateCalendarEventDTO);

    if (result.isSuccess()) {
      await fetchEvents();
    } else {
      throw new Error(result.error.message);
    }
  };

  const updateEvent = async (id: string, dto: Partial<CalendarEventDTO>) => {
    // Use UpdateCalendarEventUseCase instead of direct repository access
    const updateCalendarEventUseCase = container.updateCalendarEventUseCase;
    const result = await updateCalendarEventUseCase.execute(id, dto as UpdateCalendarEventDTO);
    
    if (result.isSuccess()) {
      await fetchEvents();
    } else {
      throw new Error(result.error.message);
    }
  };

  const deleteEvent = async (id: string) => {
    // Use DeleteCalendarEventUseCase instead of direct repository access
    const deleteCalendarEventUseCase = container.deleteCalendarEventUseCase;
    const result = await deleteCalendarEventUseCase.execute(id);
    
    if (result.isSuccess()) {
      await fetchEvents();
    } else {
      throw new Error(result.error.message);
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const goToPrevious = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (view === 'month') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else if (view === 'week') {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setDate(newDate.getDate() - 1);
      }
      return newDate;
    });
  };

  const goToNext = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (view === 'month') {
        newDate.setMonth(newDate.getMonth() + 1);
      } else if (view === 'week') {
        newDate.setDate(newDate.getDate() + 7);
      } else {
        newDate.setDate(newDate.getDate() + 1);
      }
      return newDate;
    });
  };

  return {
    events,
    loading,
    error,
    currentDate,
    view,
    setView,
    goToToday,
    goToPrevious,
    goToNext,
    setCurrentDate,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents,
  };
}

function getDateRange(date: Date, view: CalendarView): { startDate: Date; endDate: Date } {
  const start = new Date(date);
  const end = new Date(date);

  if (view === 'month') {
    // Get full month + surrounding weeks for calendar grid
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    const firstDay = start.getDay();
    start.setDate(start.getDate() - firstDay);

    end.setMonth(end.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);
    const lastDay = end.getDay();
    end.setDate(end.getDate() + (6 - lastDay));
  } else if (view === 'week') {
    // Get full week (Sunday to Saturday)
    const day = start.getDay();
    start.setDate(start.getDate() - day);
    start.setHours(0, 0, 0, 0);

    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
  } else {
    // Single day
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  }

  return { startDate: start, endDate: end };
}
