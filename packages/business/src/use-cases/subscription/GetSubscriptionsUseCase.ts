import { success, failure, type Result } from 'hayahub-shared';
import type { ISubscriptionRepository } from '../../ports/ISubscriptionRepository';
import type { SubscriptionDTO } from '../../dtos/subscription';
import { Subscription } from 'hayahub-domain';

export class GetSubscriptionsUseCase {
  constructor(private readonly subscriptionRepository: ISubscriptionRepository) {}

  async execute(userId: string): Promise<Result<SubscriptionDTO[], Error>> {
    try {
      const subscriptions = await this.subscriptionRepository.findByUserId(userId);
      const dtos = subscriptions.map(this.toDTO);
      return success(dtos);
    } catch (error) {
      return failure(error as Error);
    }
  }

  private toDTO(subscription: Subscription): SubscriptionDTO {
    return {
      id: subscription.id,
      userId: subscription.userId,
      name: subscription.name,
      amount: subscription.amount.getAmount(),
      currency: subscription.amount.getCurrency(),
      frequency: subscription.frequency,
      status: subscription.status,
      startDate: subscription.startDate,
      nextBillingDate: subscription.nextBillingDate,
      description: subscription.description,
      icon: subscription.icon,
      layoutPosition: subscription.layoutPosition?.toData(),
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
    };
  }
}
