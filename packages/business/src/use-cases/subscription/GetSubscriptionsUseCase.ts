import { success, failure, type Result } from 'hayahub-shared';
import type { ISubscriptionRepository } from '../../ports/ISubscriptionRepository';
import type { SubscriptionDTO } from '../../dtos/subscription';
import { subscriptionMapper } from '../../mappers/SubscriptionMapper';

export class GetSubscriptionsUseCase {
  constructor(private readonly subscriptionRepository: ISubscriptionRepository) {}

  async execute(userId: string): Promise<Result<SubscriptionDTO[], Error>> {
    try {
      const subscriptions = await this.subscriptionRepository.findByUserId(userId);
      const dtos = subscriptionMapper.toDTOs(subscriptions);
      return success(dtos);
    } catch (error) {
      return failure(error as Error);
    }
  }
}
