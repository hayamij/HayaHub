import type { CalendarEvent } from 'hayahub-domain';

export interface ICalendarEventRepository {
  save(event: CalendarEvent): Promise<void>;
  findById(id: string): Promise<CalendarEvent | null>;
  findByUserId(userId: string): Promise<CalendarEvent[]>;
  findByUserIdAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<CalendarEvent[]>;
  findUpcomingEvents(userId: string, limit?: number): Promise<CalendarEvent[]>;
  update(event: CalendarEvent): Promise<void>;
  delete(id: string): Promise<void>;
}
