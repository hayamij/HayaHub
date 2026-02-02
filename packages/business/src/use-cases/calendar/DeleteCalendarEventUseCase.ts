import { success, failure, type Result } from 'hayahub-shared';
import type { ICalendarEventRepository } from '../../ports/ICalendarEventRepository';

export class DeleteCalendarEventUseCase {
  constructor(private readonly calendarEventRepository: ICalendarEventRepository) {}

  async execute(id: string): Promise<Result<void, Error>> {
    try {
      const event = await this.calendarEventRepository.findById(id);
      if (!event) {
        return failure(new Error('Calendar event not found'));
      }

      await this.calendarEventRepository.delete(id);
      return success(undefined);
    } catch (error) {
      return failure(error as Error);
    }
  }
}
