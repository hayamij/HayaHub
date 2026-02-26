import type { Subscription } from 'hayahub-domain';
import type { SubscriptionDTO } from '../dtos/subscription';
import { BaseMapper } from './BaseMapper';

/**
 * Subscription Mapper
 * Centralized mapping logic for Subscription entity
 */
export class SubscriptionMapper extends BaseMapper<Subscription, SubscriptionDTO> {
  toDTO(subscription: Subscription): SubscriptionDTO {
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

export const subscriptionMapper = new SubscriptionMapper();
