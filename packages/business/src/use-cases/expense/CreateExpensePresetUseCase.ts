import { ExpensePreset, Money } from 'hayahub-domain';
import { IdGenerator, success, failure, type Result } from 'hayahub-shared';
import type { IExpensePresetRepository } from '../../ports/IExpensePresetRepository';
import type { CreateExpensePresetDTO, ExpensePresetDTO } from '../../dtos/expensePreset';
import { expensePresetMapper } from '../../mappers/ExpensePresetMapper';

/**
 * Use Case: Create a new expense preset
 * Business Logic: Validate input and persist preset to repository
 */
export class CreateExpensePresetUseCase {
  constructor(private readonly presetRepository: IExpensePresetRepository) {}

  async execute(dto: CreateExpensePresetDTO): Promise<Result<ExpensePresetDTO, Error>> {
    try {
      // Validate input using domain entity static method
      const money = Money.create(dto.amount, dto.currency);
      ExpensePreset.checkInputForCreate(dto.name, money, dto.category);

      // Create domain entity
      const preset = ExpensePreset.create(
        IdGenerator.generate('preset'),
        dto.userId,
        dto.name,
        money,
        dto.category,
        dto.notes || ''
      );

      // Persist
      await this.presetRepository.save(preset);

      // Return DTO
      return success(expensePresetMapper.toDTO(preset));
    } catch (error) {
      return failure(error as Error);
    }
  }
}
