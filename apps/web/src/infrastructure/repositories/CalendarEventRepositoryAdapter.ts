import type { ICalendarEventRepository } from 'hayahub-business';
import type { CalendarEvent } from 'hayahub-domain';
import { CalendarEvent as CalendarEventDomain, EventPriority } from 'hayahub-domain';
import type { IStorageService } from 'hayahub-business';

const STORAGE_KEY = 'hayahub_calendar_events';

interface CalendarEventStorage {
  id: string;
  userId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
  priority: EventPriority;
  isAllDay: boolean;
  reminders: number[];
  createdAt: string;
  updatedAt: string;
}

export class CalendarEventRepositoryAdapter implements ICalendarEventRepository {
  constructor(private readonly storage: IStorageService) {}

  async save(event: CalendarEvent): Promise<void> {
    const events = await this.loadAll();
    events.push(this.toStorage(event));
    await this.storage.set(STORAGE_KEY, events);
  }

  async findById(id: string): Promise<CalendarEvent | null> {
    const events = await this.loadAll();
    const event = events.find((e) => e.id === id);
    return event ? this.toDomain(event) : null;
  }

  async findByUserId(userId: string): Promise<CalendarEvent[]> {
    const events = await this.loadAll();
    return events.filter((e) => e.userId === userId).map(this.toDomain);
  }

  async findByUserIdAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<CalendarEvent[]> {
    const events = await this.loadAll();
    return events
      .filter((e) => {
        const eventStart = new Date(e.startDate);
        const eventEnd = new Date(e.endDate);
        return (
          e.userId === userId &&
          ((eventStart >= startDate && eventStart <= endDate) ||
            (eventEnd >= startDate && eventEnd <= endDate) ||
            (eventStart <= startDate && eventEnd >= endDate))
        );
      })
      .map(this.toDomain);
  }

  async findUpcomingEvents(userId: string, limit: number = 10): Promise<CalendarEvent[]> {
    const events = await this.loadAll();
    const now = new Date();
    return events
      .filter((e) => e.userId === userId && new Date(e.startDate) > now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, limit)
      .map(this.toDomain);
  }

  async update(event: CalendarEvent): Promise<void> {
    const events = await this.loadAll();
    const index = events.findIndex((e) => e.id === event.id);
    if (index !== -1) {
      events[index] = this.toStorage(event);
      await this.storage.set(STORAGE_KEY, events);
    }
  }

  async delete(id: string): Promise<void> {
    const events = await this.loadAll();
    const filtered = events.filter((e) => e.id !== id);
    await this.storage.set(STORAGE_KEY, filtered);
  }

  private async loadAll(): Promise<CalendarEventStorage[]> {
    return (await this.storage.get<CalendarEventStorage[]>(STORAGE_KEY)) || [];
  }

  private toDomain(storage: CalendarEventStorage): CalendarEvent {
    return CalendarEventDomain.reconstruct(
      storage.id,
      storage.userId,
      storage.title,
      storage.description,
      new Date(storage.startDate),
      new Date(storage.endDate),
      storage.location,
      storage.priority,
      storage.isAllDay,
      storage.reminders,
      new Date(storage.createdAt),
      new Date(storage.updatedAt)
    );
  }

  private toStorage(domain: CalendarEvent): CalendarEventStorage {
    return {
      id: domain.id,
      userId: domain.userId,
      title: domain.title,
      description: domain.description,
      startDate: domain.startDate.toISOString(),
      endDate: domain.endDate.toISOString(),
      location: domain.location,
      priority: domain.priority,
      isAllDay: domain.isAllDay,
      reminders: domain.reminders,
      createdAt: domain.createdAt.toISOString(),
      updatedAt: domain.updatedAt.toISOString(),
    };
  }
}
