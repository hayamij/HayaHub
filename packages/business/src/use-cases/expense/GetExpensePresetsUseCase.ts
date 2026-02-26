import type { ExpenseCategory } from 'hayahub-domain';
import { success, failure, type Result } from 'hayahub-shared';
import type { IExpensePresetRepository } from '../../ports/IExpensePresetRepository';
import type { ExpensePresetDTO } from '../../dtos/expensePreset';
import { expensePresetMapper } from '../../mappers/ExpensePresetMapper';

/**
 * Use Case: Get expense presets filtered by user and optionally by category
 * Business Logic: Fetch presets from repository and convert to DTOs
 */
export class GetExpensePresetsUseCase {
  constructor(private readonly presetRepository: IExpensePresetRepository) {}

  /**
   * Get all presets for a user
   */
  async execute(userId: string): Promise<Result<ExpensePresetDTO[], Error>> {
    try {
      const presets = await this.presetRepository.findByUserId(userId);
      const dtos = expensePresetMapper.toDTOs(presets);
      return success(dtos);
    } catch (error) {
      return failure(error as Error);
    }
  }

  /**
   * Get presets for a user filtered by category
   */
  async executeByCategory(
    userId: string,
    category: ExpenseCategory
  ): Promise<Result<ExpensePresetDTO[], Error>> {
    try {
      const presets = await this.presetRepository.findByUserIdAndCategory(userId, category);
      const dtos = expensePresetMapper.toDTOs(presets);
      return success(dtos);
    } catch (error) {
      return failure(error as Error);
    }
  }
}
