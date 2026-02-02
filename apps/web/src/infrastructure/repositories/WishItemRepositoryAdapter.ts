import type { IWishItemRepository } from 'hayahub-business';
import type { WishItem } from 'hayahub-domain';
import { WishItem as WishItemDomain, Money } from 'hayahub-domain';
import type { IStorageService } from 'hayahub-business';

const STORAGE_KEY = 'hayahub_wishitems';

interface WishItemStorage {
  id: string;
  userId: string;
  name: string;
  description: string;
  estimatedPrice: number | null;
  currency: string | null;
  priority: number;
  url: string | null;
  purchased: boolean;
  purchasedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Infrastructure Layer - WishItem Repository Adapter using LocalStorage
 */
export class WishItemRepositoryAdapter implements IWishItemRepository {
  constructor(private readonly storage: IStorageService) {}

  async save(wishItem: WishItem): Promise<void> {
    const items = await this.loadAll();
    items.push(this.toStorage(wishItem));
    await this.storage.set(STORAGE_KEY, items);
  }

  async findById(id: string): Promise<WishItem | null> {
    const items = await this.loadAll();
    const item = items.find((i) => i.id === id);
    return item ? this.toDomain(item) : null;
  }

  async findByUserId(userId: string): Promise<WishItem[]> {
    const items = await this.loadAll();
    return items.filter((i) => i.userId === userId).map(this.toDomain);
  }

  async update(wishItem: WishItem): Promise<void> {
    const items = await this.loadAll();
    const index = items.findIndex((i) => i.id === wishItem.id);
    if (index !== -1) {
      items[index] = this.toStorage(wishItem);
      await this.storage.set(STORAGE_KEY, items);
    }
  }

  async delete(id: string): Promise<void> {
    const items = await this.loadAll();
    const filtered = items.filter((i) => i.id !== id);
    await this.storage.set(STORAGE_KEY, filtered);
  }

  private async loadAll(): Promise<WishItemStorage[]> {
    return (await this.storage.get<WishItemStorage[]>(STORAGE_KEY)) || [];
  }

  private toStorage(wishItem: WishItem): WishItemStorage {
    return {
      id: wishItem.id,
      userId: wishItem.userId,
      name: wishItem.name,
      description: wishItem.description,
      estimatedPrice: wishItem.estimatedPrice?.getAmount() || null,
      currency: wishItem.estimatedPrice?.getCurrency() || null,
      priority: wishItem.priority,
      url: wishItem.url,
      purchased: wishItem.purchased,
      purchasedAt: wishItem.purchasedAt?.toISOString() || null,
      createdAt: wishItem.createdAt.toISOString(),
      updatedAt: wishItem.updatedAt.toISOString(),
    };
  }

  private toDomain(storage: WishItemStorage): WishItem {
    let estimatedPrice: Money | null = null;
    if (storage.estimatedPrice !== null && storage.currency) {
      estimatedPrice = Money.create(storage.estimatedPrice, storage.currency);
    }

    return WishItemDomain.reconstruct(
      storage.id,
      storage.userId,
      storage.name,
      storage.description,
      estimatedPrice,
      storage.priority,
      storage.url,
      storage.purchased,
      storage.purchasedAt ? new Date(storage.purchasedAt) : null,
      new Date(storage.createdAt),
      new Date(storage.updatedAt)
    );
  }
}
