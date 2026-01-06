import type { WishItem } from 'hayahub-domain';

/**
 * Port (Interface) for WishItem Repository
 */
export interface IWishItemRepository {
  save(wishItem: WishItem): Promise<void>;
  findById(id: string): Promise<WishItem | null>;
  findByUserId(userId: string): Promise<WishItem[]>;
  update(wishItem: WishItem): Promise<void>;
  delete(id: string): Promise<void>;
}
