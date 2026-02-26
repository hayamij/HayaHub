import { useMemo } from 'react';
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
  // Memoize use cases to prevent getter re-evaluation
  const getExpensePresetsUseCase = useMemo(() => container.getExpensePresetsUseCase, []);
  const createExpensePresetUseCase = useMemo(() => container.createExpensePresetUseCase, []);
  const updateExpensePresetUseCase = useMemo(() => container.updateExpensePresetUseCase, []);
  const deleteExpensePresetUseCase = useMemo(() => container.deleteExpensePresetUseCase, []);
  
  const {
    entities: presets,
    isLoading,
    error,
    load: refetch,
    create: createPreset,
    update: updatePreset,
    deleteEntity: deletePreset,
  } = useEntityCRUD<ExpensePresetDTO, CreateExpensePresetDTO, UpdateExpensePresetDTO>({
    getUseCase: getExpensePresetsUseCase,
    createUseCase: createExpensePresetUseCase,
    updateUseCase: updateExpensePresetUseCase,
    deleteUseCase: deleteExpensePresetUseCase,
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
