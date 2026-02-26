import type { User } from 'hayahub-domain';
import type { UserDTO } from '../dtos/user';
import { BaseMapper } from './BaseMapper';

/**
 * User Mapper
 * Centralized mapping logic for User entity
 */
export class UserMapper extends BaseMapper<User, UserDTO> {
  toDTO(user: User): UserDTO {
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

export const userMapper = new UserMapper();
