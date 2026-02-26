import { useState } from 'react';
import { container } from '@/infrastructure/di/Container';
import type { LoginUserDTO } from 'hayahub-business';

interface UseLoginReturn {
  login: (credentials: LoginUserDTO) => Promise<{ success: boolean; user?: any; error?: string }>;
  isLoading: boolean;
  error: string | null;
}

export function useLogin(): UseLoginReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginUseCase = container.loginUserUseCase;

  const login = async (credentials: LoginUserDTO) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loginUseCase.execute(credentials);

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
    login,
    isLoading,
    error,
  };
}
