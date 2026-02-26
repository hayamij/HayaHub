import { Email } from 'hayahub-domain';
import { success, failure, type Result } from 'hayahub-shared';
import type { IUserRepository } from '../../ports/IUserRepository';
import type { UserDTO } from '../../dtos/user';
import type { User } from 'hayahub-domain';
import { userMapper } from '../../mappers/UserMapper';

export interface UpdateUserDTO {
  name?: string;
  email?: string;
}

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string, dto: UpdateUserDTO): Promise<Result<UserDTO, Error>> {
    try {
      // Find user
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return failure(new Error('User not found'));
      }

      // Update name if provided
      if (dto.name !== undefined && dto.name !== user.name) {
        user.changeName(dto.name);
      }

      // Update email if provided
      if (dto.email !== undefined && dto.email !== user.email.getValue()) {
        // Check if new email is already taken
        const existingUser = await this.userRepository.findByEmail(dto.email);
        if (existingUser && existingUser.id !== userId) {
          return failure(new Error('Email already exists'));
        }

        const newEmail = Email.create(dto.email);
        user.changeEmail(newEmail);
      }

      // Persist changes
      await this.userRepository.update(user);

      return success(userMapper.toDTO(user));
    } catch (error) {
      return failure(error as Error);
    }
  }
}
