import { ExpensePreset, Money } from 'hayahub-domain';
import { success, failure, type Result } from 'hayahub-shared';
import type { IExpensePresetRepository } from '../../ports/IExpensePresetRepository';
import type { UpdateExpensePresetDTO, ExpensePresetDTO } from '../../dtos/expensePreset';
import { expensePresetMapper } from '../../mappers/ExpensePresetMapper';

/**
 * Use Case: Update an existing expense preset
 * Business Logic: Find preset, apply updates, persist changes
 */
export class UpdateExpensePresetUseCase {
  constructor(private readonly presetRepository: IExpensePresetRepository) {}

  async execute(id: string, dto: UpdateExpensePresetDTO): Promise<Result<ExpensePresetDTO, Error>> {
    try {
      // Find existing preset
      const preset = await this.presetRepository.findById(id);
      if (!preset) {
        return failure(new Error('Preset not found'));
      }

      // Apply updates using domain entity methods
      if (dto.name !== undefined) {
        preset.updateName(dto.name);
      }

      if (dto.amount !== undefined && dto.currency !== undefined) {
        const money = Money.create(dto.amount, dto.currency);
        preset.updateAmount(money);
      }

      if (dto.category !== undefined) {
        preset.updateCategory(dto.category);
      }

      if (dto.notes !== undefined) {
        preset.updateNotes(dto.notes);
      }

      // Persist changes
      await this.presetRepository.update(preset);

      // Return DTO
      return success(expensePresetMapper.toDTO(preset));
    } catch (error) {
      return failure(error as Error);
    }
  }
}
