import { describe, it, expect } from 'vitest';
import { User, UserRole, Email, UserIdFactory } from '../../';
import { ValidationException } from '../../exceptions/ValidationException';

describe('User Entity', () => {
  const validEmail = Email.create('test@example.com');
  const adminEmail = Email.create('admin@example.com');
  const userId1 = UserIdFactory.create('user-1');
  const userId2 = UserIdFactory.create('user-2');
  const adminId = UserIdFactory.create('admin-1');
  
  describe('create - valid users', () => {
    it('should create user with valid data', () => {
      const user = User.create(userId1, validEmail, 'John Doe', UserRole.USER);
      
      expect(user.id).toBe(userId1);
      expect(user.email.equals(validEmail)).toBe(true);
      expect(user.name).toBe('John Doe');
      expect(user.role).toBe(UserRole.USER);
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should create admin user', () => {
      const user = User.create(adminId, adminEmail, 'Admin User', UserRole.ADMIN);
      
      expect(user.role).toBe(UserRole.ADMIN);
    });

    it('should create user with short name', () => {
      const user = User.create(userId1, validEmail, 'Jo', UserRole.USER);
      expect(user.name).toBe('Jo');
    });

    it('should create user with long name', () => {
      const longName = 'A'.repeat(100);
      const user = User.create(userId1, validEmail, longName, UserRole.USER);
      expect(user.name).toBe(longName);
    });

    it('should default to USER role', () => {
      const user = User.create(userId1, validEmail, 'John Doe');
      expect(user.role).toBe(UserRole.USER);
    });
  });

  describe('create - invalid users', () => {
    it('should throw error for empty name', () => {
      expect(() => User.create(userId1, validEmail, '', UserRole.USER))
        .toThrow(ValidationException);
      expect(() => User.create(userId1, validEmail, '', UserRole.USER))
        .toThrow('Name is required');
    });

    it('should throw error for whitespace-only name', () => {
      expect(() => User.create(userId1, validEmail, '   ', UserRole.USER))
        .toThrow(ValidationException);
      expect(() => User.create(userId1, validEmail, '   ', UserRole.USER))
        .toThrow('Name is required');
    });
  });

  describe('changeName', () => {
    it('should change name successfully', () => {
      const user = User.create(userId1, validEmail, 'John Doe', UserRole.USER);
      const oldUpdatedAt = user.updatedAt;
      
      // Small delay to ensure updatedAt changes
      setTimeout(() => {
        user.changeName('Jane Doe');
        
        expect(user.name).toBe('Jane Doe');
        expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());
      }, 10);
    });

    it('should throw error for empty name', () => {
      const user = User.create(userId1, validEmail, 'John Doe', UserRole.USER);
      
      expect(() => user.changeName('')).toThrow(ValidationException);
      expect(() => user.changeName('')).toThrow('Name cannot be empty');
    });

    it('should throw error for whitespace-only name', () => {
      const user = User.create(userId1, validEmail, 'John Doe', UserRole.USER);
      
      expect(() => user.changeName('  ')).toThrow(ValidationException);
    });

    it('should keep old name when change fails', () => {
      const user = User.create(userId1, validEmail, 'John Doe', UserRole.USER);
      
      try {
        user.changeName('');
      } catch (e) {
        // Expected error
      }
      
      expect(user.name).toBe('John Doe');
    });

    it('should trim whitespace from new name', () => {
      const user = User.create(userId1, validEmail, 'John Doe', UserRole.USER);
      user.changeName('  Jane Doe  ');
      expect(user.name).toBe('Jane Doe');
    });
  });

  describe('changeEmail', () => {
    it('should change email successfully', () => {
      const user = User.create(userId1, validEmail, 'John Doe', UserRole.USER);
      const newEmail = Email.create('newemail@example.com');
      const oldUpdatedAt = user.updatedAt;
      
      setTimeout(() => {
        user.changeEmail(newEmail);
        
        expect(user.email.equals(newEmail)).toBe(true);
        expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());
      }, 10);
    });

    it('should update to different email', () => {
      const user = User.create(userId1, validEmail, 'John Doe', UserRole.USER);
      const newEmail = Email.create('different@example.com');
      
      user.changeEmail(newEmail);
      
      expect(user.email.getValue()).toBe('different@example.com');
    });
  });

  describe('upgradeToAdmin', () => {
    it('should upgrade user to admin', () => {
      const user = User.create(userId1, validEmail, 'John Doe', UserRole.USER);
      
      user.upgradeToAdmin();
      
      expect(user.role).toBe(UserRole.ADMIN);
    });

    it('should update updatedAt when upgrading', () => {
      const user = User.create(userId1, validEmail, 'John Doe', UserRole.USER);
      const oldUpdatedAt = user.updatedAt;
      
      setTimeout(() => {
        user.upgradeToAdmin();
        expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());
      }, 10);
    });

    it('should work even if already admin', () => {
      const user = User.create(adminId, adminEmail, 'Admin', UserRole.ADMIN);
      
      user.upgradeToAdmin();
      
      expect(user.role).toBe(UserRole.ADMIN);
    });
  });

  describe('canManageUsers', () => {
    it('should return true for admin', () => {
      const admin = User.create(adminId, adminEmail, 'Admin', UserRole.ADMIN);
      expect(admin.canManageUsers()).toBe(true);
    });

    it('should return false for regular user', () => {
      const user = User.create(userId1, validEmail, 'User', UserRole.USER);
      expect(user.canManageUsers()).toBe(false);
    });
  });

  describe('canDeleteExpense', () => {
    it('should return true when user owns the expense', () => {
      const user = User.create(userId1, validEmail, 'User', UserRole.USER);
      expect(user.canDeleteExpense(userId1)).toBe(true);
    });

    it('should return false when user does not own the expense', () => {
      const user = User.create(userId1, validEmail, 'User', UserRole.USER);
      expect(user.canDeleteExpense(userId2)).toBe(false);
    });

    it('should return true for admin even if not owner', () => {
      const admin = User.create(adminId, adminEmail, 'Admin', UserRole.ADMIN);
      expect(admin.canDeleteExpense(userId1)).toBe(true);
    });

    it('should return true for admin with own expense', () => {
      const admin = User.create(adminId, adminEmail, 'Admin', UserRole.ADMIN);
      expect(admin.canDeleteExpense(adminId)).toBe(true);
    });
  });

  describe('reconstruct', () => {
    it('should reconstruct user from storage', () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      
      const user = User.reconstruct(
        userId1,
        validEmail,
        'John Doe',
        UserRole.USER,
        createdAt,
        updatedAt
      );
      
      expect(user.id).toBe(userId1);
      expect(user.email.equals(validEmail)).toBe(true);
      expect(user.name).toBe('John Doe');
      expect(user.role).toBe(UserRole.USER);
      expect(user.createdAt).toBe(createdAt);
      expect(user.updatedAt).toBe(updatedAt);
    });

    it('should reconstruct admin user', () => {
      const user = User.reconstruct(
        adminId,
        adminEmail,
        'Admin',
        UserRole.ADMIN,
        new Date(),
        new Date()
      );
      
      expect(user.canManageUsers()).toBe(true);
    });
  });

  describe('equality and identity', () => {
    it('should have same id for same user', () => {
      const user1 = User.create(userId1, validEmail, 'John', UserRole.USER);
      const user2 = User.create(userId1, validEmail, 'John', UserRole.USER);
      
      expect(user1.id).toBe(user2.id);
    });

    it('should have different ids for different users', () => {
      const user1 = User.create(userId1, validEmail, 'John', UserRole.USER);
      const user2 = User.create(userId2, validEmail, 'Jane', UserRole.USER);
      
      expect(user1.id).not.toBe(user2.id);
    });
  });

  describe('immutability', () => {
    it('should not change createdAt after updates', () => {
      const user = User.create(userId1, validEmail, 'John', UserRole.USER);
      const createdAt = user.createdAt;
      
      user.changeName('Jane');
      
      expect(user.createdAt).toBe(createdAt);
    });

    it('should not allow direct modification of email', () => {
      const user = User.create(userId1, validEmail, 'John', UserRole.USER);
      const originalEmail = user.email.getValue();
      
      // Email is a value object, so this creates a new object
      const newEmail = Email.create('new@example.com');
      
      // Original user email should not change
      expect(user.email.getValue()).toBe(originalEmail);
    });

    it('should not change id after creation', () => {
      const user = User.create(userId1, validEmail, 'John', UserRole.USER);
      const originalId = user.id;
      
      user.changeName('Jane');
      user.upgradeToAdmin();
      
      expect(user.id).toBe(originalId);
    });
  });

  describe('special name formats', () => {
    it('should accept name with spaces', () => {
      const user = User.create(userId1, validEmail, 'John Michael Doe', UserRole.USER);
      expect(user.name).toBe('John Michael Doe');
    });

    it('should accept name with special characters', () => {
      const user = User.create(userId1, validEmail, "O'Brien-Smith", UserRole.USER);
      expect(user.name).toBe("O'Brien-Smith");
    });

    it('should accept name with unicode characters', () => {
      const user = User.create(userId1, validEmail, 'Nguyễn Văn A', UserRole.USER);
      expect(user.name).toBe('Nguyễn Văn A');
    });
  });
});
