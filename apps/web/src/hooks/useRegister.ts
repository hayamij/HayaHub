import { useState } from 'react';
import { container } from '@/infrastructure/di/Container';
import type { RegisterUserDTO } from 'hayahub-business';

interface UseRegisterReturn {
  register: (userData: RegisterUserDTO) => Promise<{ success: boolean; user?: any; error?: string }>;
  isLoading: boolean;
  error: string | null;
}

export function useRegister(): UseRegisterReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerUseCase = container.registerUserUseCase;

  const register = async (userData: RegisterUserDTO) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await registerUseCase.execute(userData);

      if (result.isSuccess()) {
        return { success: true, user: result.value };
      } else {
        const errorMessage = result.error.message;
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
    error,
  };
}
