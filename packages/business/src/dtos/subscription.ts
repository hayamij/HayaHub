import type {
  SubscriptionFrequency,
  SubscriptionStatus,
} from 'hayahub-domain';

export interface CreateSubscriptionDTO {
  userId: string;
  name: string;
  amount: number;
  currency: string;
  frequency: SubscriptionFrequency;
  startDate: Date;
  description?: string;
}

export interface UpdateSubscriptionDTO {
  name?: string;
  amount?: number;
  currency?: string;
  frequency?: SubscriptionFrequency;
  description?: string;
}

export interface SubscriptionDTO {
  id: string;
  userId: string;
  name: string;
  amount: number;
  currency: string;
  frequency: SubscriptionFrequency;
  status: SubscriptionStatus;
  startDate: Date;
  nextBillingDate: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
