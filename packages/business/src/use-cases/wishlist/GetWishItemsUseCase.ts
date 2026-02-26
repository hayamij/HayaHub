import { success, failure, type Result } from 'hayahub-shared';
import type { IWishItemRepository } from '../../ports/IWishItemRepository';
import type { WishItemDTO } from '../../dtos/wishItem';
import { wishItemMapper } from '../../mappers/WishItemMapper';

export class GetWishItemsUseCase {
  constructor(private readonly wishItemRepository: IWishItemRepository) {}

  async execute(userId: string): Promise<Result<WishItemDTO[], Error>> {
    try {
      const items = await this.wishItemRepository.findByUserId(userId);
      return success(wishItemMapper.toDTOs(items));
    } catch (error) {
      return failure(error as Error);
    }
  }
}
