import type { Photo } from 'hayahub-domain';
import { failure, type Result } from 'hayahub-shared';
import type { IPhotoRepository } from '../../ports/IPhotoRepository';

export class UpdatePhotoCaptionUseCase {
  constructor(private photoRepository: IPhotoRepository) {}

  async execute(id: string, caption: string | null): Promise<Result<Photo, Error>> {
    if (!id) {
      return failure(new Error('Photo ID is required'));
    }

    return await this.photoRepository.update(id, caption);
  }
}
