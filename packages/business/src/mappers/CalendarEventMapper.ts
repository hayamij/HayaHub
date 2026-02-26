import type { CalendarEvent } from 'hayahub-domain';
import type { CalendarEventDTO } from '../dtos/calendarEvent';
import { BaseMapper } from './BaseMapper';

/**
 * CalendarEvent Mapper
 * Centralized mapping logic for CalendarEvent entity
 */
export class CalendarEventMapper extends BaseMapper<CalendarEvent, CalendarEventDTO> {
  toDTO(event: CalendarEvent): CalendarEventDTO {
    return {
      id: event.id,
      userId: event.userId,
      title: event.title,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location,
      priority: event.priority,
      isAllDay: event.isAllDay,
      reminders: event.reminders,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };
  }
}

export const calendarEventMapper = new CalendarEventMapper();
