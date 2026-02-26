import type { Quote } from 'hayahub-domain';
import type { QuoteDTO } from '../dtos/quote';
import { BaseMapper } from './BaseMapper';

/**
 * Quote Mapper
 * Centralized mapping logic for Quote entity
 */
export class QuoteMapper extends BaseMapper<Quote, QuoteDTO> {
  toDTO(quote: Quote): QuoteDTO {
    return {
      id: quote.id,
      userId: quote.userId,
      text: quote.text,
      author: quote.author,
      category: quote.category,
      isFavorite: quote.isFavorite,
      tags: quote.tags,
      createdAt: quote.createdAt,
      updatedAt: quote.updatedAt,
    };
  }
}

export const quoteMapper = new QuoteMapper();
