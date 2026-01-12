import { success, failure, type Result } from 'hayahub-shared';
import { CalendarEvent, EventPriority } from 'hayahub-domain';
import { IdGenerator } from 'hayahub-shared';
import type { ICalendarEventRepository } from '../../ports/ICalendarEventRepository';
import type { CreateCalendarEventDTO, CalendarEventDTO } from '../../dtos/calendarEvent';

export class CreateCalendarEventUseCase {
  constructor(private readonly calendarEventRepository: ICalendarEventRepository) {}

  async execute(dto: CreateCalendarEventDTO): Promise<Result<CalendarEventDTO, Error>> {
    try {
      const event = CalendarEvent.create(
        IdGenerator.generate('cal'),
        dto.userId,
        dto.title,
        dto.description,
        dto.startDate,
        dto.endDate,
        dto.location,
        dto.priority || EventPriority.MEDIUM,
        dto.isAllDay || false
      );

      await this.calendarEventRepository.save(event);

      return success(this.toDTO(event));
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
