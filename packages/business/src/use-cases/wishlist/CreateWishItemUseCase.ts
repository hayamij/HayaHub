import { WishItem, Money } from 'hayahub-domain';
import { IdGenerator, success, failure, type Result } from 'hayahub-shared';
import type { IWishItemRepository } from '../../ports/IWishItemRepository';
import type { CreateWishItemDTO, WishItemDTO } from '../../dtos/wishItem';

export class CreateWishItemUseCase {
  constructor(private readonly wishItemRepository: IWishItemRepository) {}

  async execute(dto: CreateWishItemDTO): Promise<Result<WishItemDTO, Error>> {
    try {
      // Create Money value object if price provided
      let estimatedPrice: Money | null = null;
      if (dto.estimatedPrice !== undefined && dto.currency) {
        estimatedPrice = Money.create(dto.estimatedPrice, dto.currency);
      }

      // Create domain entity
      const wishItem = WishItem.create(
        IdGenerator.generateWishItemId(),
        dto.userId,
        dto.name,
        dto.description || '',
        estimatedPrice,
        dto.priority || 3,
        dto.url || null
      );

      // Persist
      await this.wishItemRepository.save(wishItem);

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
