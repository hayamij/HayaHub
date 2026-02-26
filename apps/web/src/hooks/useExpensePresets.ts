import { useState, useEffect } from 'react';
import { Container } from '@/infrastructure/di/Container';
import type { ExpensePresetDTO, CreateExpensePresetDTO, UpdateExpensePresetDTO } from 'hayahub-business';

interface UseExpensePresetsReturn {
  presets: ExpensePresetDTO[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createPreset: (dto: CreateExpensePresetDTO) => Promise<{ success: boolean; error?: string }>;
  updatePreset: (id: string, dto: UpdateExpensePresetDTO) => Promise<{ success: boolean; error?: string }>;
  deletePreset: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export function useExpensePresets(userId: string | undefined): UseExpensePresetsReturn {
  const [presets, setPresets] = useState<ExpensePresetDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const container = Container.getInstance();
  const getPresetsUseCase = container.getExpensePresetsUseCase;
  const createPresetUseCase = container.createExpensePresetUseCase;
  const updatePresetUseCase = container.updateExpensePresetUseCase;
  const deletePresetUseCase = container.deleteExpensePresetUseCase;

  const fetchPresets = async () => {
    if (!userId) {
      setPresets([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getPresetsUseCase.execute(userId);

      if (result.isSuccess()) {
        setPresets(result.value);
      } else {
        setError(result.error.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load presets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPresets();
  }, [userId]);

  const createPreset = async (dto: CreateExpensePresetDTO) => {
    try {
      const result = await createPresetUseCase.execute(dto);

      if (result.isSuccess()) {
        await fetchPresets();
        return { success: true };
      } else {
        return { success: false, error: result.error.message };
      }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to create preset' };
    }
  };

  const updatePreset = async (id: string, dto: UpdateExpensePresetDTO) => {
    try {
      // DTO should include the id
      const dtoWithId = { ...dto, id };
      const result = await updatePresetUseCase.execute(dtoWithId);

      if (result.isSuccess()) {
        await fetchPresets();
        return { success: true };
      } else {
        return { success: false, error: result.error.message };
      }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update preset' };
    }
  };

  const deletePreset = async (id: string) => {
    try {
      const result = await deletePresetUseCase.execute(id);

      if (result.isSuccess()) {
        await fetchPresets();
        return { success: true };
      } else {
        return { success: false, error: result.error.message };
      }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete preset' };
    }
  };

  return {
    presets,
    isLoading,
    error,
    refetch: fetchPresets,
    createPreset,
    updatePreset,
    deletePreset,
  };
}
