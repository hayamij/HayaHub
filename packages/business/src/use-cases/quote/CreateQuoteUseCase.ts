import { success, failure, type Result } from 'hayahub-shared';
import { Quote, QuoteCategory } from 'hayahub-domain';
import { IdGenerator } from 'hayahub-shared';
import type { IQuoteRepository } from '../../ports/IQuoteRepository';
import type { CreateQuoteDTO, QuoteDTO } from '../../dtos/quote';

export class CreateQuoteUseCase {
  constructor(private readonly quoteRepository: IQuoteRepository) {}

  async execute(dto: CreateQuoteDTO): Promise<Result<QuoteDTO, Error>> {
    try {
      const quote = Quote.create(
        IdGenerator.generate('quo'),
        dto.userId,
        dto.text,
        dto.author,
        dto.category || QuoteCategory.OTHER,
        dto.tags || []
      );

      await this.quoteRepository.save(quote);

      return success(this.toDTO(quote));
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
