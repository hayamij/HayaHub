import { describe, it, expect } from 'vitest';
import { Email } from '../Email';
import { ValidationException } from '../../exceptions/ValidationException';

describe('Email Value Object', () => {
  describe('create - valid emails', () => {
    it('should create email with valid format', () => {
      const email = Email.create('test@example.com');
      expect(email.getValue()).toBe('test@example.com');
    });

    it('should create email with subdomain', () => {
      const email = Email.create('user@mail.example.com');
      expect(email.getValue()).toBe('user@mail.example.com');
    });

    it('should create email with numbers', () => {
      const email = Email.create('user123@example.com');
      expect(email.getValue()).toBe('user123@example.com');
    });

    it('should create email with dots', () => {
      const email = Email.create('first.last@example.com');
      expect(email.getValue()).toBe('first.last@example.com');
    });

    it('should create email with plus sign', () => {
      const email = Email.create('user+tag@example.com');
      expect(email.getValue()).toBe('user+tag@example.com');
    });

    it('should create email with hyphen', () => {
      const email = Email.create('user-name@example.com');
      expect(email.getValue()).toBe('user-name@example.com');
    });
  });

  describe('create - invalid emails', () => {
    it('should throw error for empty email', () => {
      expect(() => Email.create('')).toThrow(ValidationException);
      expect(() => Email.create('')).toThrow('Invalid email format');
    });

    it('should throw error for email without @', () => {
      expect(() => Email.create('invalidexample.com')).toThrow(ValidationException);
      expect(() => Email.create('invalidexample.com')).toThrow('Invalid email format');
    });

    it('should throw error for email without domain', () => {
      expect(() => Email.create('user@')).toThrow(ValidationException);
      expect(() => Email.create('user@')).toThrow('Invalid email format');
    });

    it('should throw error for email without local part', () => {
      expect(() => Email.create('@example.com')).toThrow(ValidationException);
      expect(() => Email.create('@example.com')).toThrow('Invalid email format');
    });

    it('should throw error for email with spaces', () => {
      expect(() => Email.create('user @example.com')).toThrow(ValidationException);
      expect(() => Email.create('user @example.com')).toThrow('Invalid email format');
    });

    it('should throw error for email with double @', () => {
      expect(() => Email.create('user@@example.com')).toThrow(ValidationException);
      expect(() => Email.create('user@@example.com')).toThrow('Invalid email format');
    });

    it('should throw error for email without TLD', () => {
      expect(() => Email.create('user@example')).toThrow(ValidationException);
      expect(() => Email.create('user@example')).toThrow('Invalid email format');
    });
  });

  describe('equals', () => {
    it('should return true for same email', () => {
      const email1 = Email.create('test@example.com');
      const email2 = Email.create('test@example.com');
      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false for different emails', () => {
      const email1 = Email.create('test1@example.com');
      const email2 = Email.create('test2@example.com');
      expect(email1.equals(email2)).toBe(false);
    });

    it('should be case-insensitive', () => {
      const email1 = Email.create('Test@example.com');
      const email2 = Email.create('test@example.com');
      expect(email1.equals(email2)).toBe(true);
    });
  });

  describe('getValue', () => {
    it('should return the email value', () => {
      const emailValue = 'user@example.com';
      const email = Email.create(emailValue);
      expect(email.getValue()).toBe(emailValue);
    });

    it('should return immutable value', () => {
      const email = Email.create('test@example.com');
      const value1 = email.getValue();
      const value2 = email.getValue();
      expect(value1).toBe(value2);
    });
  });
});
