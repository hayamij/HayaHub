import type { Photo } from 'hayahub-domain';
import { failure, type Result } from 'hayahub-shared';
import type { IPhotoRepository } from '../../ports/IPhotoRepository';

export class GetPhotoByIdUseCase {
  constructor(private photoRepository: IPhotoRepository) {}

  async execute(id: string): Promise<Result<Photo | null, Error>> {
    if (!id) {
      return failure(new Error('Photo ID is required'));
    }

    return await this.photoRepository.findById(id);
  }
}
