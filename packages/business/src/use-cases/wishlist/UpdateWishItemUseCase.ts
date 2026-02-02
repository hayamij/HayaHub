import { Money, type WishItem } from 'hayahub-domain';
import { success, failure, type Result } from 'hayahub-shared';
import type { IWishItemRepository } from '../../ports/IWishItemRepository';
import type { UpdateWishItemDTO, WishItemDTO } from '../../dtos/wishItem';

export class UpdateWishItemUseCase {
  constructor(private readonly wishItemRepository: IWishItemRepository) {}

  async execute(id: string, dto: UpdateWishItemDTO): Promise<Result<WishItemDTO, Error>> {
    try {
      // Find existing wish item
      const wishItem = await this.wishItemRepository.findById(id);
      if (!wishItem) {
        return failure(new Error('Wish item not found'));
      }

      // Update fields using domain methods
      if (dto.name !== undefined) {
        wishItem.updateName(dto.name);
      }

      if (dto.description !== undefined) {
        wishItem.updateDescription(dto.description);
      }

      if (dto.estimatedPrice !== undefined && dto.estimatedPrice !== null && dto.currency) {
        const price = Money.create(dto.estimatedPrice, dto.currency);
        wishItem.setEstimatedPrice(price);
      } else if (dto.estimatedPrice === null) {
        wishItem.removeEstimatedPrice();
      }

      if (dto.priority !== undefined) {
        wishItem.setPriority(dto.priority);
      }

      if (dto.url !== undefined && dto.url !== null) {
        wishItem.setUrl(dto.url);
      } else if (dto.url === null) {
        wishItem.removeUrl();
      }

      // Handle purchase status
      if (dto.purchased !== undefined) {
        if (dto.purchased && !wishItem.purchased) {
          wishItem.markAsPurchased();
        } else if (!dto.purchased && wishItem.purchased) {
          wishItem.markAsUnpurchased();
        }
      }

      // Persist
      await this.wishItemRepository.update(wishItem);

      // Return DTO
      return success(this.toDTO(wishItem));
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
