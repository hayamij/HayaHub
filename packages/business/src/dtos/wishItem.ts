export interface CreateWishItemDTO {
  userId: string;
  name: string;
  description?: string;
  estimatedPrice?: number;
  currency?: string;
  priority?: number;
  url?: string;
}

export interface UpdateWishItemDTO {
  name?: string;
  description?: string;
  estimatedPrice?: number | null;
  currency?: string;
  priority?: number;
  url?: string | null;
  purchased?: boolean;
}

export interface WishItemDTO {
  id: string;
  userId: string;
  name: string;
  description: string;
  estimatedPrice: number | null;
  currency: string | null;
  priority: number;
  url: string | null;
  purchased: boolean;
  purchasedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
