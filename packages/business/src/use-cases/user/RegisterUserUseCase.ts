import { User, Email, UserRole } from 'hayahub-domain';
import { IdGenerator, success, failure, type Result } from 'hayahub-shared';
import type { IUserRepository } from '../../ports/IUserRepository';
import type { RegisterUserDTO, UserDTO } from '../../dtos/user';
import { userMapper } from '../../mappers/UserMapper';

export class RegisterUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: RegisterUserDTO): Promise<Result<UserDTO, Error>> {
    try {
      // Check if email already exists
      const existingUser = await this.userRepository.findByEmail(dto.email);
      if (existingUser) {
        return failure(new Error('Email already exists'));
      }

      // Create domain entities
      const email = Email.create(dto.email);
      const user = User.create(IdGenerator.generateUserId(), email, dto.name, UserRole.USER);

      // Persist with password
      await this.userRepository.save(user, dto.password);

      // Return DTO using centralized mapper
      return success(userMapper.toDTO(user));
    } catch (error) {
      return failure(error as Error);
    }
  }
}
