import type { EventPriority } from 'hayahub-domain';

export interface CreateCalendarEventDTO {
  userId: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  priority?: EventPriority;
  isAllDay?: boolean;
}

export interface UpdateCalendarEventDTO {
  title?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  location?: string;
  priority?: EventPriority;
  isAllDay?: boolean;
}

export interface CalendarEventDTO {
  id: string;
  userId: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  priority: EventPriority;
  isAllDay: boolean;
  reminders: number[];
  createdAt: Date;
  updatedAt: Date;
}
