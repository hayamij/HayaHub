import { success, failure, type Result } from 'hayahub-shared';
import { Subscription, Money } from 'hayahub-domain';
import { IdGenerator } from 'hayahub-shared';
import type { ISubscriptionRepository } from '../../ports/ISubscriptionRepository';
import type { CreateSubscriptionDTO, SubscriptionDTO } from '../../dtos/subscription';

export class CreateSubscriptionUseCase {
  constructor(private readonly subscriptionRepository: ISubscriptionRepository) {}

  async execute(dto: CreateSubscriptionDTO): Promise<Result<SubscriptionDTO, Error>> {
    try {
      const money = Money.create(dto.amount, dto.currency);
      const subscription = Subscription.create(
        IdGenerator.generate('sub'),
        dto.userId,
        dto.name,
        money,
        dto.frequency,
        dto.startDate,
        dto.description
      );

      await this.subscriptionRepository.save(subscription);

      return success(this.toDTO(subscription));
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
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
    };
  }
}
