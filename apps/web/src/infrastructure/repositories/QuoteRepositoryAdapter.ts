import type { IQuoteRepository } from 'hayahub-business';
import type { Quote } from 'hayahub-domain';
import { Quote as QuoteDomain, QuoteCategory } from 'hayahub-domain';
import type { IStorageService } from 'hayahub-business';

const STORAGE_KEY = 'hayahub_quotes';

interface QuoteStorage {
  id: string;
  userId: string;
  text: string;
  author: string;
  category: QuoteCategory;
  isFavorite: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export class QuoteRepositoryAdapter implements IQuoteRepository {
  constructor(private readonly storage: IStorageService) {}

  async save(quote: Quote): Promise<void> {
    const quotes = await this.loadAll();
    quotes.push(this.toStorage(quote));
    await this.storage.set(STORAGE_KEY, quotes);
  }

  async findById(id: string): Promise<Quote | null> {
    const quotes = await this.loadAll();
    const quote = quotes.find((q) => q.id === id);
    return quote ? this.toDomain(quote) : null;
  }

  async findByUserId(userId: string): Promise<Quote[]> {
    const quotes = await this.loadAll();
    return quotes.filter((q) => q.userId === userId).map(this.toDomain);
  }

  async findFavoritesByUserId(userId: string): Promise<Quote[]> {
    const quotes = await this.loadAll();
    return quotes
      .filter((q) => q.userId === userId && q.isFavorite)
      .map(this.toDomain);
  }

  async findByCategory(userId: string, category: QuoteCategory): Promise<Quote[]> {
    const quotes = await this.loadAll();
    return quotes
      .filter((q) => q.userId === userId && q.category === category)
      .map(this.toDomain);
  }

  async findByTag(userId: string, tag: string): Promise<Quote[]> {
    const quotes = await this.loadAll();
    const normalizedTag = tag.trim().toLowerCase();
    return quotes
      .filter((q) => q.userId === userId && q.tags.includes(normalizedTag))
      .map(this.toDomain);
  }

  async getRandomQuote(userId: string): Promise<Quote | null> {
    const quotes = await this.loadAll();
    const userQuotes = quotes.filter((q) => q.userId === userId);
    
    if (userQuotes.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * userQuotes.length);
    return this.toDomain(userQuotes[randomIndex]);
  }

  async update(quote: Quote): Promise<void> {
    const quotes = await this.loadAll();
    const index = quotes.findIndex((q) => q.id === quote.id);
    if (index !== -1) {
      quotes[index] = this.toStorage(quote);
      await this.storage.set(STORAGE_KEY, quotes);
    }
  }

  async delete(id: string): Promise<void> {
    const quotes = await this.loadAll();
    const filtered = quotes.filter((q) => q.id !== id);
    await this.storage.set(STORAGE_KEY, filtered);
  }

  private async loadAll(): Promise<QuoteStorage[]> {
    return (await this.storage.get<QuoteStorage[]>(STORAGE_KEY)) || [];
  }

  private toDomain(storage: QuoteStorage): Quote {
    return QuoteDomain.reconstruct(
      storage.id,
      storage.userId,
      storage.text,
      storage.author,
      storage.category,
      storage.isFavorite,
      storage.tags,
      new Date(storage.createdAt),
      new Date(storage.updatedAt)
    );
  }

  private toStorage(domain: Quote): QuoteStorage {
    return {
      id: domain.id,
      userId: domain.userId,
      text: domain.text,
      author: domain.author,
      category: domain.category,
      isFavorite: domain.isFavorite,
      tags: domain.tags,
      createdAt: domain.createdAt.toISOString(),
      updatedAt: domain.updatedAt.toISOString(),
    };
  }
}
