import type { Quote, QuoteCategory } from 'hayahub-domain';

export interface IQuoteRepository {
  save(quote: Quote): Promise<void>;
  findById(id: string): Promise<Quote | null>;
  findByUserId(userId: string): Promise<Quote[]>;
  findFavoritesByUserId(userId: string): Promise<Quote[]>;
  findByCategory(userId: string, category: QuoteCategory): Promise<Quote[]>;
  findByTag(userId: string, tag: string): Promise<Quote[]>;
  getRandomQuote(userId: string): Promise<Quote | null>;
  update(quote: Quote): Promise<void>;
  delete(id: string): Promise<void>;
}
