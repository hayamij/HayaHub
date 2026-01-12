import { ValidationException } from '../exceptions/ValidationException';
import type { UserId } from '../value-objects/UserId';

export type QuoteId = string;

export enum QuoteCategory {
  MOTIVATION = 'MOTIVATION',
  WISDOM = 'WISDOM',
  INSPIRATION = 'INSPIRATION',
  HUMOR = 'HUMOR',
  LIFE = 'LIFE',
  SUCCESS = 'SUCCESS',
  OTHER = 'OTHER',
}

/**
 * Quote Entity - Inspirational quotes collection
 */
export class Quote {
  private constructor(
    private readonly _id: QuoteId,
    private readonly _userId: UserId,
    private _text: string,
    private _author: string,
    private _category: QuoteCategory,
    private _isFavorite: boolean = false,
    private _tags: string[] = [],
    private readonly _createdAt: Date = new Date(),
    private _updatedAt: Date = new Date()
  ) {
    this.validate();
  }

  static create(
    id: QuoteId,
    userId: UserId,
    text: string,
    author: string,
    category: QuoteCategory = QuoteCategory.OTHER,
    tags: string[] = []
  ): Quote {
    return new Quote(id, userId, text, author, category, false, tags);
  }

  static reconstruct(
    id: QuoteId,
    userId: UserId,
    text: string,
    author: string,
    category: QuoteCategory,
    isFavorite: boolean,
    tags: string[],
    createdAt: Date,
    updatedAt: Date
  ): Quote {
    return new Quote(id, userId, text, author, category, isFavorite, tags, createdAt, updatedAt);
  }

  // Business logic
  updateText(text: string): void {
    if (!text || text.trim().length === 0) {
      throw new ValidationException('Quote text cannot be empty');
    }
    this._text = text.trim();
    this._updatedAt = new Date();
  }

  updateAuthor(author: string): void {
    if (!author || author.trim().length === 0) {
      throw new ValidationException('Author cannot be empty');
    }
    this._author = author.trim();
    this._updatedAt = new Date();
  }

  updateCategory(category: QuoteCategory): void {
    this._category = category;
    this._updatedAt = new Date();
  }

  toggleFavorite(): void {
    this._isFavorite = !this._isFavorite;
    this._updatedAt = new Date();
  }

  addTag(tag: string): void {
    const normalizedTag = tag.trim().toLowerCase();
    if (!normalizedTag) {
      throw new ValidationException('Tag cannot be empty');
    }
    if (!this._tags.includes(normalizedTag)) {
      this._tags.push(normalizedTag);
      this._updatedAt = new Date();
    }
  }

  removeTag(tag: string): void {
    const normalizedTag = tag.trim().toLowerCase();
    this._tags = this._tags.filter((t) => t !== normalizedTag);
    this._updatedAt = new Date();
  }

  private validate(): void {
    if (!this._text || this._text.trim().length === 0) {
      throw new ValidationException('Quote text is required');
    }
    if (!this._author || this._author.trim().length === 0) {
      throw new ValidationException('Author is required');
    }
  }

  // Getters
  get id(): QuoteId {
    return this._id;
  }

  get userId(): UserId {
    return this._userId;
  }

  get text(): string {
    return this._text;
  }

  get author(): string {
    return this._author;
  }

  get category(): QuoteCategory {
    return this._category;
  }

  get isFavorite(): boolean {
    return this._isFavorite;
  }

  get tags(): string[] {
    return [...this._tags];
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  matchesTag(tag: string): boolean {
    return this._tags.includes(tag.trim().toLowerCase());
  }
}
