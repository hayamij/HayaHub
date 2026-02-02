import { success, failure, type Result } from 'hayahub-shared';
import type { IWishItemRepository } from '../../ports/IWishItemRepository';

export class DeleteWishItemUseCase {
  constructor(private readonly wishItemRepository: IWishItemRepository) {}

  async execute(id: string): Promise<Result<void, Error>> {
    try {
      const wishItem = await this.wishItemRepository.findById(id);
      if (!wishItem) {
        return failure(new Error('Wish item not found'));
      }

      await this.wishItemRepository.delete(id);
      return success(undefined);
    } catch (error) {
      return failure(error as Error);
    }
  }
}
