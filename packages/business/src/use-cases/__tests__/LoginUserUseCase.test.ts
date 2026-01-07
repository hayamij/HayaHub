import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LoginUserUseCase } from '../user/LoginUserUseCase';
import { User, UserRole, Email, UserIdFactory } from 'hayahub-domain';
import type { IUserRepository } from '../../ports/IUserRepository';

describe('LoginUserUseCase', () => {
  let mockUserRepository: IUserRepository;
  let useCase: LoginUserUseCase;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: vi.fn(),
      verifyPassword: vi.fn(),
      save: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
    };
    useCase = new LoginUserUseCase(mockUserRepository);
  });

  describe('execute - successful login', () => {
    it('should login user with correct credentials', async () => {
      const user = User.create(
        UserIdFactory.generate(),
        Email.create('test@example.com'),
        'John Doe',
        UserRole.USER
      );
      mockUserRepository.findByEmail = vi.fn().mockResolvedValue(user);
      mockUserRepository.verifyPassword = vi.fn().mockResolvedValue(true);

      const result = await useCase.execute({
        email: 'test@example.com',
        password: 'correct_password',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.email).toBe('test@example.com');
        expect(result.value.name).toBe('John Doe');
        expect(result.value.role).toBe(UserRole.USER);
      }
    });

    it('should login admin user', async () => {
      const admin = User.create(
        UserIdFactory.generate(),
        Email.create('admin@example.com'),
        'Admin User',
        UserRole.ADMIN
      );
      mockUserRepository.findByEmail = vi.fn().mockResolvedValue(admin);
      mockUserRepository.verifyPassword = vi.fn().mockResolvedValue(true);

      const result = await useCase.execute({
        email: 'admin@example.com',
        password: 'admin_password',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.role).toBe(UserRole.ADMIN);
      }
    });

    it('should call repository with correct email', async () => {
      const user = User.create(
        UserIdFactory.generate(),
        Email.create('test@example.com'),
        'John Doe',
        UserRole.USER
      );
      mockUserRepository.findByEmail = vi.fn().mockResolvedValue(user);
      mockUserRepository.verifyPassword = vi.fn().mockResolvedValue(true);

      await useCase.execute({
        email: 'test@example.com',
        password: 'password',
      });

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockUserRepository.verifyPassword).toHaveBeenCalledWith('test@example.com', 'password');
    });

    it('should return user with all properties', async () => {
      const user = User.create(
        UserIdFactory.generate(),
        Email.create('test@example.com'),
        'John Doe',
        UserRole.USER
      );
      mockUserRepository.findByEmail = vi.fn().mockResolvedValue(user);
      mockUserRepository.verifyPassword = vi.fn().mockResolvedValue(true);

      const result = await useCase.execute({
        email: 'test@example.com',
        password: 'password',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toHaveProperty('id');
        expect(result.value).toHaveProperty('email');
        expect(result.value).toHaveProperty('name');
        expect(result.value).toHaveProperty('role');
        expect(result.value).toHaveProperty('createdAt');
        expect(result.value).toHaveProperty('updatedAt');
      }
    });
  });

  describe('execute - user not found', () => {
    it('should return failure when user does not exist', async () => {
      mockUserRepository.findByEmail = vi.fn().mockResolvedValue(null);

      const result = await useCase.execute({
        email: 'nonexistent@example.com',
        password: 'password',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toContain('Invalid credentials');
      }
    });

    it('should return failure for unregistered email', async () => {
      mockUserRepository.findByEmail = vi.fn().mockResolvedValue(null);

      const result = await useCase.execute({
        email: 'new@example.com',
        password: 'password',
      });

      expect(result.success).toBe(false);
    });

    it('should not call verifyPassword when user not found', async () => {
      mockUserRepository.findByEmail = vi.fn().mockResolvedValue(null);
      mockUserRepository.verifyPassword = vi.fn();

      await useCase.execute({
        email: 'nonexistent@example.com',
        password: 'password',
      });

      expect(mockUserRepository.verifyPassword).not.toHaveBeenCalled();
    });
  });

  describe('execute - wrong password', () => {
    it('should return failure for incorrect password', async () => {
      const user = User.create(
        UserIdFactory.generate(),
        Email.create('test@example.com'),
        'John Doe',
        UserRole.USER
      );
      mockUserRepository.findByEmail = vi.fn().mockResolvedValue(user);
      mockUserRepository.verifyPassword = vi.fn().mockResolvedValue(false);

      const result = await useCase.execute({
        email: 'test@example.com',
        password: 'wrong_password',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toContain('Invalid credentials');
      }
    });

    it('should call verifyPassword with correct parameters', async () => {
      const user = User.create(
        UserIdFactory.generate(),
        Email.create('test@example.com'),
        'John Doe',
        UserRole.USER
      );
      mockUserRepository.findByEmail = vi.fn().mockResolvedValue(user);
      mockUserRepository.verifyPassword = vi.fn().mockResolvedValue(false);

      await useCase.execute({
        email: 'test@example.com',
        password: 'wrong_password',
      });

      expect(mockUserRepository.verifyPassword).toHaveBeenCalledWith(
        'test@example.com',
        'wrong_password'
      );
    });
  });

  describe('execute - invalid email format', () => {
    it('should return failure for invalid email', async () => {
      const result = await useCase.execute({
        email: 'invalid-email',
        password: 'password',
      });

      expect(result.success).toBe(false);
    });

    it('should return failure for email without @', async () => {
      const result = await useCase.execute({
        email: 'invalidemail.com',
        password: 'password',
      });

      expect(result.success).toBe(false);
    });

    it('should return failure for email without domain', async () => {
      const result = await useCase.execute({
        email: 'test@',
        password: 'password',
      });

      expect(result.success).toBe(false);
    });

    it('should return failure for empty email', async () => {
      const result = await useCase.execute({
        email: '',
        password: 'password',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('execute - repository errors', () => {
    it('should return failure on repository error', async () => {
      mockUserRepository.findByEmail = vi.fn().mockRejectedValue(
        new Error('Database connection failed')
      );

      const result = await useCase.execute({
        email: 'test@example.com',
        password: 'password',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toContain('Database connection failed');
      }
    });

    it('should return failure on network error', async () => {
      mockUserRepository.findByEmail = vi.fn().mockRejectedValue(
        new Error('Network timeout')
      );

      const result = await useCase.execute({
        email: 'test@example.com',
        password: 'password',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toContain('Network timeout');
      }
    });

    it('should return failure on verifyPassword error', async () => {
      const user = User.create(
        UserIdFactory.generate(),
        Email.create('test@example.com'),
        'John Doe',
        UserRole.USER
      );
      mockUserRepository.findByEmail = vi.fn().mockResolvedValue(user);
      mockUserRepository.verifyPassword = vi.fn().mockRejectedValue(
        new Error('Password verification failed')
      );

      const result = await useCase.execute({
        email: 'test@example.com',
        password: 'password',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('execute - special email formats', () => {
    it('should login with email containing subdomain', async () => {
      const user = User.create(
        UserIdFactory.generate(),
        Email.create('test@mail.example.com'),
        'John Doe',
        UserRole.USER
      );
      mockUserRepository.findByEmail = vi.fn().mockResolvedValue(user);
      mockUserRepository.verifyPassword = vi.fn().mockResolvedValue(true);

      const result = await useCase.execute({
        email: 'test@mail.example.com',
        password: 'password',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.email).toBe('test@mail.example.com');
      }
    });

    it('should login with email containing plus sign', async () => {
      const user = User.create(
        UserIdFactory.generate(),
        Email.create('test+tag@example.com'),
        'John Doe',
        UserRole.USER
      );
      mockUserRepository.findByEmail = vi.fn().mockResolvedValue(user);
      mockUserRepository.verifyPassword = vi.fn().mockResolvedValue(true);

      const result = await useCase.execute({
        email: 'test+tag@example.com',
        password: 'password',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.email).toBe('test+tag@example.com');
      }
    });

    it('should login with email containing dots', async () => {
      const user = User.create(
        UserIdFactory.generate(),
        Email.create('first.last@example.com'),
        'John Doe',
        UserRole.USER
      );
      mockUserRepository.findByEmail = vi.fn().mockResolvedValue(user);
      mockUserRepository.verifyPassword = vi.fn().mockResolvedValue(true);

      const result = await useCase.execute({
        email: 'first.last@example.com',
        password: 'password',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.email).toBe('first.last@example.com');
      }
    });
  });

  describe('execute - security considerations', () => {
    it('should use same error message for wrong password and non-existent user', async () => {
      // Non-existent user
      mockUserRepository.findByEmail = vi.fn().mockResolvedValue(null);
      const result1 = await useCase.execute({
        email: 'nonexistent@example.com',
        password: 'password',
      });

      // Wrong password
      const user = User.create(
        UserIdFactory.generate(),
        Email.create('test@example.com'),
        'John Doe',
        UserRole.USER
      );
      mockUserRepository.findByEmail = vi.fn().mockResolvedValue(user);
      mockUserRepository.verifyPassword = vi.fn().mockResolvedValue(false);
      const result2 = await useCase.execute({
        email: 'test@example.com',
        password: 'wrong_password',
      });

      expect(result1.success).toBe(false);
      expect(result2.success).toBe(false);
      
      if (!result1.success && !result2.success) {
        expect(result1.error.message).toBe(result2.error.message);
      }
    });
  });

  describe('execute - return value format', () => {
    it('should return user DTO not entity', async () => {
      const user = User.create(
        UserIdFactory.generate(),
        Email.create('test@example.com'),
        'John Doe',
        UserRole.USER
      );
      mockUserRepository.findByEmail = vi.fn().mockResolvedValue(user);
      mockUserRepository.verifyPassword = vi.fn().mockResolvedValue(true);

      const result = await useCase.execute({
        email: 'test@example.com',
        password: 'password',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        // Should have string email, not Email value object
        expect(typeof result.value.email).toBe('string');
      }
    });

    it('should not include password in result', async () => {
      const user = User.create(
        UserIdFactory.generate(),
        Email.create('test@example.com'),
        'John Doe',
        UserRole.USER
      );
      mockUserRepository.findByEmail = vi.fn().mockResolvedValue(user);
      mockUserRepository.verifyPassword = vi.fn().mockResolvedValue(true);

      const result = await useCase.execute({
        email: 'test@example.com',
        password: 'secret_password',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).not.toHaveProperty('password');
      }
    });
  });
});
