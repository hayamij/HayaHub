import { success, failure, type Result } from 'hayahub-shared';
import { Subscription, Money, LayoutPosition } from 'hayahub-domain';
import type { ISubscriptionRepository } from '../../ports/ISubscriptionRepository';
import type { UpdateSubscriptionDTO, SubscriptionDTO } from '../../dtos/subscription';

export class UpdateSubscriptionUseCase {
  constructor(private readonly subscriptionRepository: ISubscriptionRepository) {}

  async execute(id: string, dto: UpdateSubscriptionDTO): Promise<Result<SubscriptionDTO, Error>> {
    try {
      const subscription = await this.subscriptionRepository.findById(id);
      if (!subscription) {
        return failure(new Error('Subscription not found'));
      }

      // Update fields
      if (dto.name !== undefined) {
        subscription.updateName(dto.name);
      }
      if (dto.amount !== undefined && dto.currency !== undefined) {
        const money = Money.create(dto.amount, dto.currency);
        subscription.updateAmount(money);
      }
      if (dto.frequency !== undefined) {
        subscription.updateFrequency(dto.frequency);
      }
      if (dto.status !== undefined) {
        // Handle status changes
        if (dto.status === 'PAUSED') {
          subscription.pause();
        } else if (dto.status === 'ACTIVE') {
          subscription.resume();
        } else if (dto.status === 'CANCELLED') {
          subscription.cancel();
        }
      }
      if (dto.description !== undefined) {
        subscription.updateDescription(dto.description);
      }
      if (dto.icon !== undefined) {
        subscription.updateIcon(dto.icon);
      }
      if (dto.layoutPosition !== undefined) {
        const layout = LayoutPosition.fromData(dto.layoutPosition);
        subscription.updateLayout(layout);
      }

      await this.subscriptionRepository.update(subscription);

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
      icon: subscription.icon,
      layoutPosition: subscription.layoutPosition?.toData(),
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
    };
  }
}
