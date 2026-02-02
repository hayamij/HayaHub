import { success, failure, type Result } from 'hayahub-shared';
import type { ICalendarEventRepository } from '../../ports/ICalendarEventRepository';
import type { CalendarEventDTO } from '../../dtos/calendarEvent';
import type { CalendarEvent } from 'hayahub-domain';

export class GetCalendarEventsUseCase {
  constructor(private readonly calendarEventRepository: ICalendarEventRepository) {}

  async execute(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<Result<CalendarEventDTO[], Error>> {
    try {
      let events: CalendarEvent[];

      if (startDate && endDate) {
        events = await this.calendarEventRepository.findByUserIdAndDateRange(userId, startDate, endDate);
      } else {
        events = await this.calendarEventRepository.findByUserId(userId);
      }

      return success(events.map((event) => this.toDTO(event)));
    } catch (error) {
      return failure(error as Error);
    }
  }

  private toDTO(event: CalendarEvent): CalendarEventDTO {
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
