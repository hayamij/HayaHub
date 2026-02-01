import type {
  SubscriptionFrequency,
  SubscriptionStatus,
  LayoutPositionData,
} from 'hayahub-domain';

export interface CreateSubscriptionDTO {
  userId: string;
  name: string;
  amount: number;
  currency: string;
  frequency: SubscriptionFrequency;
  startDate: Date;
  description?: string;
  icon?: string;
}

export interface UpdateSubscriptionDTO {
  name?: string;
  amount?: number;
  currency?: string;
  frequency?: SubscriptionFrequency;
  description?: string;
  icon?: string;
  layoutPosition?: LayoutPositionData;
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
  icon?: string;
  layoutPosition?: LayoutPositionData;
  createdAt: Date;
  updatedAt: Date;
}
