import type { Event } from 'hayahub-domain';

/**
 * Port (Interface) for Event Repository
 */
export interface IEventRepository {
  save(event: Event): Promise<void>;
  findById(id: string): Promise<Event | null>;
  findByUserId(userId: string): Promise<Event[]>;
  findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Event[]>;
  update(event: Event): Promise<void>;
  delete(id: string): Promise<void>;
}
