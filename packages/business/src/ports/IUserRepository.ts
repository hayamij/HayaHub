import type { User } from 'hayahub-domain';

/**
 * Port (Interface) for User Repository
 */
export interface IUserRepository {
  save(user: User, password?: string): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  verifyPassword(email: string, password: string): Promise<boolean>;
  update(user: User): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(): Promise<User[]>;
}
