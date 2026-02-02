import { success, failure, type Result } from 'hayahub-shared';
import type { IQuoteRepository } from '../../ports/IQuoteRepository';

export class DeleteQuoteUseCase {
  constructor(private readonly quoteRepository: IQuoteRepository) {}

  async execute(id: string): Promise<Result<void, Error>> {
    try {
      const quote = await this.quoteRepository.findById(id);
      if (!quote) {
        return failure(new Error('Quote not found'));
      }

      await this.quoteRepository.delete(id);
      return success(undefined);
    } catch (error) {
      return failure(error as Error);
    }
  }
}
