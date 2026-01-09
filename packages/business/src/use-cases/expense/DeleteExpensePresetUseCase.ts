import { success, failure, type Result } from 'hayahub-shared';
import type { IExpensePresetRepository } from '../../ports/IExpensePresetRepository';

/**
 * Use Case: Delete an expense preset
 * Business Logic: Verify preset exists and delete it
 */
export class DeleteExpensePresetUseCase {
  constructor(private readonly presetRepository: IExpensePresetRepository) {}

  async execute(presetId: string): Promise<Result<void, Error>> {
    try {
      // Verify preset exists
      const preset = await this.presetRepository.findById(presetId);
      if (!preset) {
        return failure(new Error('Preset not found'));
      }

      // Delete preset
      await this.presetRepository.delete(presetId);

      return success(undefined);
    } catch (error) {
      return failure(error as Error);
    }
  }
}
