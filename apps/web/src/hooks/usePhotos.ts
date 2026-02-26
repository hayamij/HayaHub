'use client';

import { useEffect, useState, useCallback } from 'react';
import { container } from '@/infrastructure/di/Container';
import type { Photo } from 'hayahub-domain';

interface UsePhotosReturn {
  photos: Photo[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom Hook for Photos List
 * Encapsulates photos data fetching
 */
export function usePhotos(userId: string | undefined): UsePhotosReturn {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPhotos = useCallback(async () => {
    if (!userId) {
      setPhotos([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const getPhotosUseCase = container.getPhotosUseCase;
      const result = await getPhotosUseCase.execute(userId);

      if (result.success) {
        setPhotos(result.value);
      } else {
        setError(result.error.message);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  return {
    photos,
    isLoading,
    error,
    refetch: loadPhotos,
  };
}
