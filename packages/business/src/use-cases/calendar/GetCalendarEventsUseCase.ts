import { success, failure, type Result } from 'hayahub-shared';
import type { ICalendarEventRepository } from '../../ports/ICalendarEventRepository';
import type { CalendarEventDTO } from '../../dtos/calendarEvent';
import type { CalendarEvent } from 'hayahub-domain';
import { calendarEventMapper } from '../../mappers/CalendarEventMapper';

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

      return success(calendarEventMapper.toDTOs(events));
    } catch (error) {
      return failure(error as Error);
    }
  }
}
