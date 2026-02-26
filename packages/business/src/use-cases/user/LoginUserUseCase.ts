import { success, failure, type Result } from 'hayahub-shared';
import type { IUserRepository } from '../../ports/IUserRepository';
import type { LoginUserDTO, UserDTO } from '../../dtos/user';
import { userMapper } from '../../mappers/UserMapper';

export class LoginUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: LoginUserDTO): Promise<Result<UserDTO, Error>> {
    try {
      // Find user by email
      const user = await this.userRepository.findByEmail(dto.email);
      if (!user) {
        return failure(new Error('Invalid credentials'));
      }

      // Verify password
      const isValidPassword = await this.userRepository.verifyPassword(dto.email, dto.password);
      if (!isValidPassword) {
        return failure(new Error('Invalid credentials'));
      }

      return success(userMapper.toDTO(user));
    } catch (error) {
      return failure(error as Error);
    }
  }
}
