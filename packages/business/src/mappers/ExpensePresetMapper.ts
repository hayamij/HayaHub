import type { ExpensePreset } from 'hayahub-domain';
import type { ExpensePresetDTO } from '../dtos/expensePreset';
import { BaseMapper } from './BaseMapper';

/**
 * ExpensePreset Mapper
 * Centralized mapping logic for ExpensePreset entity
 */
export class ExpensePresetMapper extends BaseMapper<ExpensePreset, ExpensePresetDTO> {
  toDTO(preset: ExpensePreset): ExpensePresetDTO {
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

export const expensePresetMapper = new ExpensePresetMapper();
