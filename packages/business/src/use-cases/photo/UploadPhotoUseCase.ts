import type { Photo } from 'hayahub-domain';
import { failure, type Result } from 'hayahub-shared';
import type { IPhotoRepository } from '../../ports/IPhotoRepository';

export class UploadPhotoUseCase {
  constructor(private photoRepository: IPhotoRepository) {}

  async execute(file: File, userId: string, caption?: string | null): Promise<Result<Photo, Error>> {
    // Validate file
    if (!file) {
      return failure(new Error('No file provided'));
    }

    // Check file type (support common image formats)
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      return failure(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are supported.'));
    }

    // Check file size (max 10MB for Cloudinary free tier)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return failure(new Error('File size exceeds 10MB limit'));
    }

    // Upload to repository (Cloudinary)
    return await this.photoRepository.upload(file, userId, caption);
  }
}
