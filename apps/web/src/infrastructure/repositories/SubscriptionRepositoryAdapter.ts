import type { ISubscriptionRepository } from 'hayahub-business';
import type { Subscription } from 'hayahub-domain';
import { Subscription as SubscriptionDomain, Money, SubscriptionFrequency, SubscriptionStatus } from 'hayahub-domain';
import type { IStorageService } from 'hayahub-business';

const STORAGE_KEY = 'hayahub_subscriptions';

interface SubscriptionStorage {
  id: string;
  userId: string;
  name: string;
  amount: number;
  currency: string;
  frequency: SubscriptionFrequency;
  status: SubscriptionStatus;
  startDate: string;
  nextBillingDate: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export class SubscriptionRepositoryAdapter implements ISubscriptionRepository {
  constructor(private readonly storage: IStorageService) {}

  async save(subscription: Subscription): Promise<void> {
    const subscriptions = await this.loadAll();
    subscriptions.push(this.toStorage(subscription));
    await this.storage.set(STORAGE_KEY, subscriptions);
  }

  async findById(id: string): Promise<Subscription | null> {
    const subscriptions = await this.loadAll();
    const sub = subscriptions.find((s) => s.id === id);
    return sub ? this.toDomain(sub) : null;
  }

  async findByUserId(userId: string): Promise<Subscription[]> {
    const subscriptions = await this.loadAll();
    return subscriptions.filter((s) => s.userId === userId).map(this.toDomain);
  }

  async findActiveByUserId(userId: string): Promise<Subscription[]> {
    const subscriptions = await this.loadAll();
    return subscriptions
      .filter((s) => s.userId === userId && s.status === SubscriptionStatus.ACTIVE)
      .map(this.toDomain);
  }

  async findDueSubscriptions(userId: string): Promise<Subscription[]> {
    const subscriptions = await this.loadAll();
    const now = new Date();
    return subscriptions
      .filter((s) => 
        s.userId === userId && 
        s.status === SubscriptionStatus.ACTIVE &&
        new Date(s.nextBillingDate) <= now
      )
      .map(this.toDomain);
  }

  async update(subscription: Subscription): Promise<void> {
    const subscriptions = await this.loadAll();
    const index = subscriptions.findIndex((s) => s.id === subscription.id);
    if (index !== -1) {
      subscriptions[index] = this.toStorage(subscription);
      await this.storage.set(STORAGE_KEY, subscriptions);
    }
  }

  async delete(id: string): Promise<void> {
    const subscriptions = await this.loadAll();
    const filtered = subscriptions.filter((s) => s.id !== id);
    await this.storage.set(STORAGE_KEY, filtered);
  }

  private async loadAll(): Promise<SubscriptionStorage[]> {
    return (await this.storage.get<SubscriptionStorage[]>(STORAGE_KEY)) || [];
  }

  private toDomain(storage: SubscriptionStorage): Subscription {
    const money = Money.create(storage.amount, storage.currency);
    return SubscriptionDomain.reconstruct(
      storage.id,
      storage.userId,
      storage.name,
      money,
      storage.frequency,
      storage.status,
      new Date(storage.startDate),
      new Date(storage.nextBillingDate),
      storage.description,
      new Date(storage.createdAt),
      new Date(storage.updatedAt)
    );
  }

  private toStorage(domain: Subscription): SubscriptionStorage {
    return {
      id: domain.id,
      userId: domain.userId,
      name: domain.name,
      amount: domain.amount.getAmount(),
      currency: domain.amount.getCurrency(),
      frequency: domain.frequency,
      status: domain.status,
      startDate: domain.startDate.toISOString(),
      nextBillingDate: domain.nextBillingDate.toISOString(),
      description: domain.description,
      createdAt: domain.createdAt.toISOString(),
      updatedAt: domain.updatedAt.toISOString(),
    };
  }
}
