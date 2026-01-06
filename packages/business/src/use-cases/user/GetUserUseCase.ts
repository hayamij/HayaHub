import { success, failure, type Result } from 'hayahub-shared';
import type { IUserRepository } from '../../ports/IUserRepository';
import type { UserDTO } from '../../dtos/user';
import type { User } from 'hayahub-domain';

export class GetUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<Result<UserDTO, Error>> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return failure(new Error('User not found'));
      }

      return success(this.toDTO(user));
    } catch (error) {
      return failure(error as Error);
    }
  }

  private toDTO(user: User): UserDTO {
    return {
      id: user.id,
      email: user.email.getValue(),
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
