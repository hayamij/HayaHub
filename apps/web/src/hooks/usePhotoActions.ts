'use client';

import { useState, useCallback } from 'react';
import { container } from '@/infrastructure/di/Container';
import type { Photo } from 'hayahub-domain';

interface UsePhotosReturn {
  uploadPhoto: (file: File, userId: string) => Promise<{ success: boolean; photo?: Photo; error?: string }>;
  deletePhoto: (photoId: string) => Promise<{ success: boolean; error?: string }>;
  updatePhotoCaption: (photoId: string, caption: string | null) => Promise<{ success: boolean; error?: string }>;
  isUploading: boolean;
}

/**
 * Custom Hook for Photos Management
 * Encapsulates photo upload, delete, and update operations
 */
export function usePhotoActions(): UsePhotosReturn {
  const [isUploading, setIsUploading] = useState(false);

  const uploadPhoto = useCallback(async (file: File, userId: string) => {
    setIsUploading(true);
    try {
      const uploadPhotoUseCase = container.uploadPhotoUseCase;
      const result = await uploadPhotoUseCase.execute(file, userId);

      if (result.success) {
        return { success: true, photo: result.value };
      } else {
        return { success: false, error: result.error.message };
      }
    } catch (error) {
      return { success: false, error: (error as Error).message };
    } finally {
      setIsUploading(false);
    }
  }, []);

  const deletePhoto = useCallback(async (photoId: string) => {
    try {
      const deletePhotoUseCase = container.deletePhotoUseCase;
      const result = await deletePhotoUseCase.execute(photoId);

      if (result.success) {
        return { success: true };
      } else {
        return { success: false, error: result.error.message };
      }
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }, []);

  const updatePhotoCaption = useCallback(async (photoId: string, caption: string | null) => {
    try {
      const updatePhotoCaptionUseCase = container.updatePhotoCaptionUseCase;
      const result = await updatePhotoCaptionUseCase.execute(photoId, caption);

      if (result.success) {
        return { success: true };
      } else {
        return { success: false, error: result.error.message };
      }
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }, []);

  return {
    uploadPhoto,
    deletePhoto,
    updatePhotoCaption,
    isUploading,
  };
}
