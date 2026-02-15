import type { Photo } from 'hayahub-domain';
import type { Result } from 'hayahub-shared';

export interface IPhotoRepository {
  /**
   * Upload a photo to cloud storage
   */
  upload(file: File, userId: string, caption?: string | null): Promise<Result<Photo, Error>>;

  /**
   * Find all photos by user ID
   */
  findByUserId(userId: string): Promise<Result<Photo[], Error>>;

  /**
   * Find a photo by ID
   */
  findById(id: string): Promise<Result<Photo | null, Error>>;

  /**
   * Update a photo's caption
   */
  update(id: string, caption: string | null): Promise<Result<Photo, Error>>;

  /**
   * Delete a photo
   */
  delete(id: string): Promise<Result<void, Error>>;
}
