import { User, Email, UserRole } from 'hayahub-domain';
import { IdGenerator, success, failure, type Result } from 'hayahub-shared';
import type { IUserRepository } from '../../ports/IUserRepository';
import type { RegisterUserDTO, UserDTO } from '../../dtos/user';

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

      // Return DTO (password handling will be in infrastructure layer)
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
