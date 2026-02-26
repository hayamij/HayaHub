import { success, failure, type Result } from 'hayahub-shared';
import type { IUserRepository } from '../../ports/IUserRepository';
import type { UserDTO } from '../../dtos/user';
import { userMapper } from '../../mappers/UserMapper';

export class GetUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<Result<UserDTO, Error>> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return failure(new Error('User not found'));
      }

      return success(userMapper.toDTO(user));
    } catch (error) {
      return failure(error as Error);
    }
  }
}
