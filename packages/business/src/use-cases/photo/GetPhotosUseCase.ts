import type { Photo } from 'hayahub-domain';
import { failure, type Result } from 'hayahub-shared';
import type { IPhotoRepository } from '../../ports/IPhotoRepository';

export class GetPhotosUseCase {
  constructor(private photoRepository: IPhotoRepository) {}

  async execute(userId: string): Promise<Result<Photo[], Error>> {
    if (!userId) {
      return failure(new Error('User ID is required'));
    }

    return await this.photoRepository.findByUserId(userId);
  }
}
