import type { Quote } from 'hayahub-domain';
import { success, failure, type Result } from 'hayahub-shared';
import type { IQuoteRepository } from '../../ports/IQuoteRepository';
import type { UpdateQuoteDTO, QuoteDTO } from '../../dtos/quote';

export class UpdateQuoteUseCase {
  constructor(private readonly quoteRepository: IQuoteRepository) {}

  async execute(id: string, dto: UpdateQuoteDTO): Promise<Result<QuoteDTO, Error>> {
    try {
      // Find existing quote
      const quote = await this.quoteRepository.findById(id);
      if (!quote) {
        return failure(new Error('Quote not found'));
      }

      // Update fields using domain methods
      if (dto.text !== undefined) {
        quote.updateText(dto.text);
      }

      if (dto.author !== undefined) {
        quote.updateAuthor(dto.author);
      }

      if (dto.category !== undefined) {
        quote.updateCategory(dto.category);
      }

      // Handle favorite toggle
      if (dto.isFavorite !== undefined && dto.isFavorite !== quote.isFavorite) {
        quote.toggleFavorite();
      }

      // Persist
      await this.quoteRepository.update(quote);

      // Return DTO
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
