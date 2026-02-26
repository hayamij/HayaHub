import { success, failure, type Result } from 'hayahub-shared';
import type { IQuoteRepository } from '../../ports/IQuoteRepository';
import type { QuoteDTO } from '../../dtos/quote';
import { quoteMapper } from '../../mappers/QuoteMapper';

export class GetQuotesUseCase {
  constructor(private readonly quoteRepository: IQuoteRepository) {}

  async execute(userId: string): Promise<Result<QuoteDTO[], Error>> {
    try {
      const quotes = await this.quoteRepository.findByUserId(userId);
      return success(quoteMapper.toDTOs(quotes));
    } catch (error) {
      return failure(error as Error);
    }
  }
}
