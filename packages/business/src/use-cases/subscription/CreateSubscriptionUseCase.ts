import { success, failure, type Result } from 'hayahub-shared';
import { Subscription, Money } from 'hayahub-domain';
import { IdGenerator } from 'hayahub-shared';
import type { ISubscriptionRepository } from '../../ports/ISubscriptionRepository';
import type { CreateSubscriptionDTO, SubscriptionDTO } from '../../dtos/subscription';
import { subscriptionMapper } from '../../mappers/SubscriptionMapper';

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
        dto.description,
        dto.icon
      );

      await this.subscriptionRepository.save(subscription);

      return success(subscriptionMapper.toDTO(subscription));
    } catch (error) {
      return failure(error as Error);
    }
  }
}
