import type { WishItem } from 'hayahub-domain';
import type { WishItemDTO } from '../dtos/wishItem';
import { BaseMapper } from './BaseMapper';

/**
 * WishItem Mapper
 * Centralized mapping logic for WishItem entity
 */
export class WishItemMapper extends BaseMapper<WishItem, WishItemDTO> {
  toDTO(wishItem: WishItem): WishItemDTO {
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
      purchasedAt: wishItem.purchasedAt,
      createdAt: wishItem.createdAt,
      updatedAt: wishItem.updatedAt,
    };
  }
}

export const wishItemMapper = new WishItemMapper();
