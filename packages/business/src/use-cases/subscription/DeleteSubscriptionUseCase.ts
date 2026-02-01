import { success, failure, type Result } from 'hayahub-shared';
import type { ISubscriptionRepository } from '../../ports/ISubscriptionRepository';

export class DeleteSubscriptionUseCase {
  constructor(private readonly subscriptionRepository: ISubscriptionRepository) {}

  async execute(id: string): Promise<Result<void, Error>> {
    try {
      await this.subscriptionRepository.delete(id);
      return success(undefined);
    } catch (error) {
      return failure(error as Error);
    }
  }
}
