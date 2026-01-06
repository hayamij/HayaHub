import { success, failure, type Result } from 'hayahub-shared';
import type { IUserRepository } from '../../ports/IUserRepository';
import type { LoginUserDTO, UserDTO } from '../../dtos/user';
import type { User } from 'hayahub-domain';

export class LoginUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: LoginUserDTO): Promise<Result<UserDTO, Error>> {
    try {
      // Find user by email
      const user = await this.userRepository.findByEmail(dto.email);
      if (!user) {
        return failure(new Error('Invalid credentials'));
      }

      // Password verification will be handled in infrastructure layer
      // For now, we just return the user

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
