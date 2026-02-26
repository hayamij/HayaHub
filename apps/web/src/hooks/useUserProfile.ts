import { useState } from 'react';
import { Container } from '@/infrastructure/di/Container';

interface UpdateUserData {
  name?: string;
  email?: string;
}

interface UseUserProfileReturn {
  updateProfile: (userId: string, data: UpdateUserData) => Promise<{ success: boolean; user?: any; error?: string }>;
  isLoading: boolean;
  error: string | null;
}

export function useUserProfile(): UseUserProfileReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const container = Container.getInstance();
  const updateUserUseCase = container.updateUserUseCase;

  const updateProfile = async (userId: string, data: UpdateUserData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await updateUserUseCase.execute(userId, data);

      if (result.isSuccess()) {
        return { success: true, user: result.value };
      } else {
        const errorMessage = result.error.message;
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateProfile,
    isLoading,
    error,
  };
}
