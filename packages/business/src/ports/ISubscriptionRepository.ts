import type { Subscription } from 'hayahub-domain';

export interface ISubscriptionRepository {
  save(subscription: Subscription): Promise<void>;
  findById(id: string): Promise<Subscription | null>;
  findByUserId(userId: string): Promise<Subscription[]>;
  findActiveByUserId(userId: string): Promise<Subscription[]>;
  findDueSubscriptions(userId: string): Promise<Subscription[]>;
  update(subscription: Subscription): Promise<void>;
  delete(id: string): Promise<void>;
}
