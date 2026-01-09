import type { ExpensePreset, ExpenseCategory } from 'hayahub-domain';
import { success, failure, type Result } from 'hayahub-shared';
import type { IExpensePresetRepository } from '../../ports/IExpensePresetRepository';
import type { ExpensePresetDTO } from '../../dtos/expensePreset';

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
      const dtos = presets.map((preset) => this.toDTO(preset));
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
      const dtos = presets.map((preset) => this.toDTO(preset));
      return success(dtos);
    } catch (error) {
      return failure(error as Error);
    }
  }

  private toDTO(preset: ExpensePreset): ExpensePresetDTO {
    return {
      id: preset.id,
      userId: preset.userId,
      name: preset.name,
      amount: preset.amount.getAmount(),
      currency: preset.amount.getCurrency(),
      category: preset.category,
      notes: preset.notes,
      createdAt: preset.createdAt,
      updatedAt: preset.updatedAt,
    };
  }
}
