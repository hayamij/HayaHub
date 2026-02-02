'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Container } from '@/infrastructure/di/Container';
import type { CalendarEventDTO } from 'hayahub-business';

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

export function useCalendarEvents(initialView: CalendarView = 'month'): UseCalendarEventsResult {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEventDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>(initialView);

  const calendarEventRepository = Container.getInstance().calendarEventRepository;
  const createCalendarEventUseCase = Container.getInstance().createCalendarEventUseCase;

  const fetchEvents = async () => {
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
      
      const result = await calendarEventRepository.findByUserIdAndDateRange(user.id, startDate, endDate);
      setEvents(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user, currentDate, view]);

  const createEvent = async (dto: Omit<CalendarEventDTO, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('User not authenticated');

    const result = await createCalendarEventUseCase.execute({
      ...dto,
      userId: user.id,
    });

    if (!result.success) {
      throw new Error(result.error.message);
    }

    await fetchEvents();
  };

  const updateEvent = async (id: string, dto: Partial<CalendarEventDTO>) => {
    const event = await calendarEventRepository.findById(id);
    if (!event) {
      throw new Error('Event not found');
    }

    // Update event properties using reschedule for date changes
    if (dto.title) event.updateTitle(dto.title);
    if (dto.description) event.updateDescription(dto.description);
    if (dto.startDate || dto.endDate) {
      const startDate = dto.startDate || event.startDate;
      const endDate = dto.endDate || event.endDate;
      event.reschedule(startDate, endDate);
    }
    if (dto.location) event.updateLocation(dto.location);
    if (dto.priority) event.setPriority(dto.priority);

    await calendarEventRepository.update(event);
    await fetchEvents();
  };

  const deleteEvent = async (id: string) => {
    await calendarEventRepository.delete(id);

    await fetchEvents();
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
