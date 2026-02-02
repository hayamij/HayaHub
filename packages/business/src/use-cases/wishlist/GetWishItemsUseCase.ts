import type { WishItem } from 'hayahub-domain';
import { success, failure, type Result } from 'hayahub-shared';
import type { IWishItemRepository } from '../../ports/IWishItemRepository';
import type { WishItemDTO } from '../../dtos/wishItem';

export class GetWishItemsUseCase {
  constructor(private readonly wishItemRepository: IWishItemRepository) {}

  async execute(userId: string): Promise<Result<WishItemDTO[], Error>> {
    try {
      const items = await this.wishItemRepository.findByUserId(userId);
      return success(items.map((item) => this.toDTO(item)));
    } catch (error) {
      return failure(error as Error);
    }
  }

  private toDTO(wishItem: WishItem): WishItemDTO {
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
