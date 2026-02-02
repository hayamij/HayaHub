import type { Quote } from 'hayahub-domain';
import { success, failure, type Result } from 'hayahub-shared';
import type { IQuoteRepository } from '../../ports/IQuoteRepository';
import type { QuoteDTO } from '../../dtos/quote';

export class GetQuotesUseCase {
  constructor(private readonly quoteRepository: IQuoteRepository) {}

  async execute(userId: string): Promise<Result<QuoteDTO[], Error>> {
    try {
      const quotes = await this.quoteRepository.findByUserId(userId);
      return success(quotes.map((quote) => this.toDTO(quote)));
    } catch (error) {
      return failure(error as Error);
    }
  }

  private toDTO(quote: Quote): QuoteDTO {
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
