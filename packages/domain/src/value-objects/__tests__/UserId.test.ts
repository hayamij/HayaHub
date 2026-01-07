import { describe, it, expect } from 'vitest';
import { UserIdFactory, type UserId } from '../UserId';
import { ValidationException } from '../../exceptions/ValidationException';

describe('UserId Value Object', () => {
  describe('create - valid user ids', () => {
    it('should create user id with alphanumeric value', () => {
      const userId = UserIdFactory.create('user123');
      expect(userId).toBe('user123');
    });

    it('should create user id with UUID format', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const userId = UserIdFactory.create(uuid);
      expect(userId).toBe(uuid);
    });

    it('should create user id with underscore', () => {
      const userId = UserIdFactory.create('user_123');
      expect(userId).toBe('user_123');
    });

    it('should create user id with hyphen', () => {
      const userId = UserIdFactory.create('user-123');
      expect(userId).toBe('user-123');
    });

    it('should create user id with numbers only', () => {
      const userId = UserIdFactory.create('12345');
      expect(userId).toBe('12345');
    });

    it('should create user id with single character', () => {
      const userId = UserIdFactory.create('a');
      expect(userId).toBe('a');
    });

    it('should create user id with long value', () => {
      const longId = 'a'.repeat(100);
      const userId = UserIdFactory.create(longId);
      expect(userId).toBe(longId);
    });

    it('should trim whitespace', () => {
      const userId = UserIdFactory.create('  user123  ');
      expect(userId).toBe('user123');
    });
  });

  describe('create - invalid user ids', () => {
    it('should throw error for empty string', () => {
      expect(() => UserIdFactory.create('')).toThrow(ValidationException);
      expect(() => UserIdFactory.create('')).toThrow('UserId cannot be empty');
    });

    it('should throw error for whitespace only', () => {
      expect(() => UserIdFactory.create('   ')).toThrow(ValidationException);
      expect(() => UserIdFactory.create('   ')).toThrow('UserId cannot be empty');
    });

    it('should throw error for tab character', () => {
      expect(() => UserIdFactory.create('\t')).toThrow(ValidationException);
    });

    it('should throw error for newline character', () => {
      expect(() => UserIdFactory.create('\n')).toThrow(ValidationException);
    });
  });

  describe('generate', () => {
    it('should generate unique user id', () => {
      const userId1 = UserIdFactory.generate();
      const userId2 = UserIdFactory.generate();
      
      expect(userId1).not.toBe(userId2);
    });

    it('should generate user id with user_ prefix', () => {
      const userId = UserIdFactory.generate();
      expect(userId.startsWith('user_')).toBe(true);
    });

    it('should generate non-empty user id', () => {
      const userId = UserIdFactory.generate();
      expect(userId.length).toBeGreaterThan(0);
    });

    it('should generate different ids on multiple calls', () => {
      const ids = new Set<UserId>();
      for (let i = 0; i < 100; i++) {
        ids.add(UserIdFactory.generate());
      }
      expect(ids.size).toBe(100);
    });
  });

  describe('string comparison', () => {
    it('should compare user ids as strings', () => {
      const userId1 = UserIdFactory.create('user123');
      const userId2 = UserIdFactory.create('user123');
      
      expect(userId1).toBe(userId2);
    });

    it('should be different for different values', () => {
      const userId1 = UserIdFactory.create('user123');
      const userId2 = UserIdFactory.create('user456');
      
      expect(userId1).not.toBe(userId2);
    });

    it('should be case sensitive', () => {
      const userId1 = UserIdFactory.create('User123');
      const userId2 = UserIdFactory.create('user123');
      
      expect(userId1).not.toBe(userId2);
    });

    it('should match for UUID', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const userId1 = UserIdFactory.create(uuid);
      const userId2 = UserIdFactory.create(uuid);
      
      expect(userId1).toBe(userId2);
    });
  });

  describe('special characters', () => {
    it('should accept dot in user id', () => {
      const userId = UserIdFactory.create('user.123');
      expect(userId).toBe('user.123');
    });

    it('should accept @ symbol', () => {
      const userId = UserIdFactory.create('user@123');
      expect(userId).toBe('user@123');
    });

    it('should accept plus sign', () => {
      const userId = UserIdFactory.create('user+123');
      expect(userId).toBe('user+123');
    });

    it('should accept mixed special characters', () => {
      const userId = UserIdFactory.create('user_123-abc.def');
      expect(userId).toBe('user_123-abc.def');
    });
  });

  describe('edge cases', () => {
    it('should handle very long ids', () => {
      const longId = 'a'.repeat(1000);
      const userId = UserIdFactory.create(longId);
      
      expect(userId).toBe(longId);
      expect(userId.length).toBe(1000);
    });

    it('should handle unicode characters', () => {
      const userId = UserIdFactory.create('用户123');
      expect(userId).toBe('用户123');
    });

    it('should handle emoji', () => {
      const userId = UserIdFactory.create('user😀123');
      expect(userId).toBe('user😀123');
    });
  });

  describe('type safety', () => {
    it('should be assignable to string', () => {
      const userId: UserId = UserIdFactory.create('user123');
      const str: string = userId;
      expect(str).toBe('user123');
    });

    it('should work with string operations', () => {
      const userId = UserIdFactory.create('user123');
      expect(userId.toUpperCase()).toBe('USER123');
      expect(userId.includes('123')).toBe(true);
    });
  });
});
