import type { IUserRepository } from 'hayahub-business';
import type { User } from 'hayahub-domain';
import { User as UserDomain, Email, UserRole } from 'hayahub-domain';
import type { IStorageService } from 'hayahub-business';

const STORAGE_KEY = 'hayahub_users';

interface UserStorage {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

/**
 * Infrastructure Layer - User Repository Adapter using LocalStorage
 */
export class UserRepositoryAdapter implements IUserRepository {
  constructor(private readonly storage: IStorageService) {}

  async save(user: User): Promise<void> {
    const users = await this.loadAll();
    users.push(this.toStorage(user));
    await this.storage.set(STORAGE_KEY, users);
  }

  async findById(id: string): Promise<User | null> {
    const users = await this.loadAll();
    const user = users.find((u) => u.id === id);
    return user ? this.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = await this.loadAll();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    return user ? this.toDomain(user) : null;
  }

  async update(user: User): Promise<void> {
    const users = await this.loadAll();
    const index = users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      users[index] = this.toStorage(user);
      await this.storage.set(STORAGE_KEY, users);
    }
  }

  async delete(id: string): Promise<void> {
    const users = await this.loadAll();
    const filtered = users.filter((u) => u.id !== id);
    await this.storage.set(STORAGE_KEY, filtered);
  }

  async findAll(): Promise<User[]> {
    const users = await this.loadAll();
    return users.map(this.toDomain);
  }

  private async loadAll(): Promise<UserStorage[]> {
    return (await this.storage.get<UserStorage[]>(STORAGE_KEY)) || [];
  }

  private toStorage(user: User): UserStorage {
    return {
      id: user.id,
      email: user.email.getValue(),
      name: user.name,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  private toDomain(storage: UserStorage): User {
    return UserDomain.reconstruct(
      storage.id,
      Email.create(storage.email),
      storage.name,
      storage.role,
      new Date(storage.createdAt),
      new Date(storage.updatedAt)
    );
  }
}
