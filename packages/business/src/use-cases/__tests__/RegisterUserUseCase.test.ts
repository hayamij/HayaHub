import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RegisterUserUseCase } from '../user/RegisterUserUseCase';
import { User, UserRole, Email, UserIdFactory } from 'hayahub-domain';
import type { IUserRepository } from '../../ports/IUserRepository';

describe('RegisterUserUseCase', () => {
  let mockUserRepository: IUserRepository;
  let useCase: RegisterUserUseCase;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: vi.fn(),
      save: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
      verifyPassword: vi.fn(),
    };
    useCase = new RegisterUserUseCase(mockUserRepository);
  });

  describe('execute - successful registration', () => {
    it('should register new user successfully', async () => {
      mockUserRepository.findByEmail = vi.fn().mockResolvedValue(null);
      mockUserRepository.save = vi.fn().mockResolvedValue(undefined);

      const result = await useCase.execute({
        email: 'test@example.com',
        name: 'John Doe',
        password: 'password123',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.id).toBeDefined();
        expect(result.value.email).toBe('test@example.com');
        expect(result.value.name).toBe('John Doe');
        expect(result.value.role).toBe(UserRole.USER);
      }
      expect(mockUserRepository.findByEmail).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.any(User),
        'password123'
      );
    });

    it('should save user with correct password', async () => {
      mockUserRepository.findByEmail = vi.fn().mockResolvedValue(null);
      mockUserRepository.save = vi.fn().mockResolvedValue(undefined);

      await useCase.execute({
        email: 'test@example.com',
        name: 'John Doe',
        password: 'my_password_123',
      });

      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.any(User),
        'my_password_123'
      );
    });

    it('should create user with USER role by default', async () => {
      mockUserRepository.findByEmail = vi.fn().mockResolvedValue(null);
      mockUserRepository.save = vi.fn().mockResolvedValue(undefined);

      const result = await useCase.execute({
        email: 'test@example.com',
        name: 'John Doe',
        password: 'password',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.role).toBe(UserRole.USER);
      }
    });

    it('should return user DTO with all properties', async () => {
      mockUserRepository.findByEmail = vi.fn().mockResolvedValue(null);
      mockUserRepository.save = vi.fn().mockResolvedValue(undefined);

      const result = await useCase.execute({
        email: 'test@example.com',
        name: 'John Doe',
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

  describe('execute - duplicate email', () => {
    it('should return failure when email already exists', async () => {
      const existingUser = User.create(
        UserIdFactory.generate(),
        Email.create('test@example.com'),
        'Existing User',
        UserRole.USER
      );
      mockUserRepository.findByEmail = vi.fn().mockResolvedValue(existingUser);

      const result = await useCase.execute({
        email: 'test@example.com',
        name: 'John Doe',
        password: 'password',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toContain('Email already exists');
      }
    });

    it('should not save user when email exists', async () => {
      const existingUser = User.create(
        UserIdFactory.generate(),
        Email.create('test@example.com'),
        'Existing User',
        UserRole.USER
      );
      mockUserRepository.findByEmail = vi.fn().mockResolvedValue(existingUser);
      mockUserRepository.save = vi.fn().mockResolvedValue(undefined);

      await useCase.execute({
        email: 'test@example.com',
        name: 'John Doe',
        password: 'password',
      });

      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('execute - invalid input', () => {
    it('should return failure for invalid email format', async () => {
      const result = await useCase.execute({
        email: 'invalid-email',
        name: 'John Doe',
        password: 'password',
      });

      expect(result.success).toBe(false);
    });

    it('should return failure for empty email', async () => {
      const result = await useCase.execute({
        email: '',
        name: 'John Doe',
        password: 'password',
      });

      expect(result.success).toBe(false);
    });

    it('should return failure for empty name', async () => {
      mockUserRepository.findByEmail = vi.fn().mockResolvedValue(null);

      const result = await useCase.execute({
        email: 'test@example.com',
        name: '',
        password: 'password',
      });

      expect(result.success).toBe(false);
    });

    it('should return failure for whitespace-only name', async () => {
      mockUserRepository.findByEmail = vi.fn().mockResolvedValue(null);

      const result = await useCase.execute({
        email: 'test@example.com',
        name: '   ',
        password: 'password',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('execute - repository errors', () => {
    it('should return failure on repository findByEmail error', async () => {
      mockUserRepository.findByEmail = vi.fn().mockRejectedValue(new Error('Database error'));

      const result = await useCase.execute({
        email: 'test@example.com',
        name: 'John Doe',
        password: 'password',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toContain('Database error');
      }
    });

    it('should return failure on repository save error', async () => {
      mockUserRepository.findByEmail = vi.fn().mockResolvedValue(null);
      mockUserRepository.save = vi.fn().mockRejectedValue(new Error('Save failed'));

      const result = await useCase.execute({
        email: 'test@example.com',
        name: 'John Doe',
        password: 'password',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toContain('Save failed');
      }
    });
  });

  describe('execute - special email formats', () => {
    it('should accept email with subdomain', async () => {
      mockUserRepository.findByEmail = vi.fn().mockResolvedValue(null);
      mockUserRepository.save = vi.fn().mockResolvedValue(undefined);

      const result = await useCase.execute({
        email: 'test@mail.example.com',
        name: 'John Doe',
        password: 'password',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.email).toBe('test@mail.example.com');
      }
    });

    it('should accept email with plus sign', async () => {
      mockUserRepository.findByEmail = vi.fn().mockResolvedValue(null);
      mockUserRepository.save = vi.fn().mockResolvedValue(undefined);

      const result = await useCase.execute({
        email: 'test+tag@example.com',
        name: 'John Doe',
        password: 'password',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.email).toBe('test+tag@example.com');
      }
    });

    it('should accept email with dots', async () => {
      mockUserRepository.findByEmail = vi.fn().mockResolvedValue(null);
      mockUserRepository.save = vi.fn().mockResolvedValue(undefined);

      const result = await useCase.execute({
        email: 'first.last@example.com',
        name: 'John Doe',
        password: 'password',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.email).toBe('first.last@example.com');
      }
    });
  });

  describe('execute - special name formats', () => {
    it('should accept name with spaces', async () => {
      mockUserRepository.findByEmail = vi.fn().mockResolvedValue(null);
      mockUserRepository.save = vi.fn().mockResolvedValue(undefined);

      const result = await useCase.execute({
        email: 'test@example.com',
        name: 'John Michael Doe',
        password: 'password',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.name).toBe('John Michael Doe');
      }
    });

    it('should accept name with special characters', async () => {
      mockUserRepository.findByEmail = vi.fn().mockResolvedValue(null);
      mockUserRepository.save = vi.fn().mockResolvedValue(undefined);

      const result = await useCase.execute({
        email: 'test@example.com',
        name: "O'Brien-Smith",
        password: 'password',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.name).toBe("O'Brien-Smith");
      }
    });

    it('should accept name with unicode characters', async () => {
      mockUserRepository.findByEmail = vi.fn().mockResolvedValue(null);
      mockUserRepository.save = vi.fn().mockResolvedValue(undefined);

      const result = await useCase.execute({
        email: 'test@example.com',
        name: 'Nguyễn Văn A',
        password: 'password',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.name).toBe('Nguyễn Văn A');
      }
    });
  });

  describe('execute - return value format', () => {
    it('should not include password in result', async () => {
      mockUserRepository.findByEmail = vi.fn().mockResolvedValue(null);
      mockUserRepository.save = vi.fn().mockResolvedValue(undefined);

      const result = await useCase.execute({
        email: 'test@example.com',
        name: 'John Doe',
        password: 'secret_password',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).not.toHaveProperty('password');
      }
    });

    it('should return email as string not Email object', async () => {
      mockUserRepository.findByEmail = vi.fn().mockResolvedValue(null);
      mockUserRepository.save = vi.fn().mockResolvedValue(undefined);

      const result = await useCase.execute({
        email: 'test@example.com',
        name: 'John Doe',
        password: 'password',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(typeof result.value.email).toBe('string');
      }
    });
  });
});
