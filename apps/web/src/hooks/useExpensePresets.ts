import { container } from '@/infrastructure/di/Container';
import type { ExpensePresetDTO, CreateExpensePresetDTO, UpdateExpensePresetDTO } from 'hayahub-business';
import { useEntityCRUD } from './useEntityCRUD';

interface UseExpensePresetsReturn {
  presets: ExpensePresetDTO[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  createPreset: (dto: CreateExpensePresetDTO) => Promise<boolean>;
  updatePreset: (id: string, dto: UpdateExpensePresetDTO) => Promise<boolean>;
  deletePreset: (id: string) => Promise<boolean>;
}

/**
 * Custom Hook for Expense Presets Management
 * Uses generic useEntityCRUD to eliminate code duplication
 */
export function useExpensePresets(userId: string | undefined): UseExpensePresetsReturn {
  const {
    entities: presets,
    isLoading,
    error,
    load: refetch,
    create: createPreset,
    update: updatePreset,
    deleteEntity: deletePreset,
  } = useEntityCRUD<ExpensePresetDTO, CreateExpensePresetDTO, UpdateExpensePresetDTO>({
    getUseCase: container.getExpensePresetsUseCase,
    createUseCase: container.createExpensePresetUseCase,
    updateUseCase: container.updateExpensePresetUseCase,
    deleteUseCase: container.deleteExpensePresetUseCase,
    getParams: userId!,
  });

  return {
    presets,
    isLoading,
    error,
    refetch,
    createPreset,
    updatePreset,
    deletePreset,
  };
}
