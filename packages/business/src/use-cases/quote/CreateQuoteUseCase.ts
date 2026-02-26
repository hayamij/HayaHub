import { success, failure, type Result } from 'hayahub-shared';
import { Quote, QuoteCategory } from 'hayahub-domain';
import { IdGenerator } from 'hayahub-shared';
import type { IQuoteRepository } from '../../ports/IQuoteRepository';
import type { CreateQuoteDTO, QuoteDTO } from '../../dtos/quote';
import { quoteMapper } from '../../mappers/QuoteMapper';

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

      return success(quoteMapper.toDTO(quote));
    } catch (error) {
      return failure(error as Error);
    }
  }
}
