import { failure, type Result } from 'hayahub-shared';
import type { IPhotoRepository } from '../../ports/IPhotoRepository';

export class DeletePhotoUseCase {
  constructor(private photoRepository: IPhotoRepository) {}

  async execute(id: string): Promise<Result<void, Error>> {
    if (!id) {
      return failure(new Error('Photo ID is required'));
    }

    return await this.photoRepository.delete(id);
  }
}
