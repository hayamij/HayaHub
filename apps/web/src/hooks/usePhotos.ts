'use client';

import { useEffect, useState, useCallback } from 'react';
import { container } from '@/infrastructure/di/Container';
import type { Photo } from 'hayahub-domain';

interface UsePhotosReturn {
  photos: Photo[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom Hook for Photos List
 * Encapsulates photos data fetching
 * 
 * Note: Photo operations are handled by usePhotoActions hook
 * This hook is read-only for listing photos
 */
export function usePhotos(userId: string | undefined): UsePhotosReturn {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
        setError(null);
      } else {
        setError(result.error);
        setPhotos([]);
      }
    } catch (err) {
      setError(err as Error);
      setPhotos([]);
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
