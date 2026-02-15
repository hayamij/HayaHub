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

    // Check file type (support common image formats including RAW)
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/x-sony-arw', // Sony RAW
      'image/x-canon-cr2', // Canon RAW
      'image/x-nikon-nef', // Nikon RAW
      'application/octet-stream', // Fallback for RAW files
    ];

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(arw|cr2|nef|raw|dng)$/i)) {
      return failure(new Error('Invalid file type. Only image files are supported.'));
    }

    // Check file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > maxSize) {
      return failure(new Error('File size exceeds 100MB limit'));
    }

    // Upload to repository (Cloudinary)
    return await this.photoRepository.upload(file, userId, caption);
  }
}
