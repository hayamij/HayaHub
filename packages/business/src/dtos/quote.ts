import type { QuoteCategory } from 'hayahub-domain';

export interface CreateQuoteDTO {
  userId: string;
  text: string;
  author: string;
  category?: QuoteCategory;
  tags?: string[];
}

export interface UpdateQuoteDTO {
  text?: string;
  author?: string;
  category?: QuoteCategory;
  isFavorite?: boolean;
}

export interface QuoteDTO {
  id: string;
  userId: string;
  text: string;
  author: string;
  category: QuoteCategory;
  isFavorite: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
