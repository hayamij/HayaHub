import { describe, it, expect } from 'vitest';
import { Money } from '../Money';
import { ValidationException } from '../../exceptions/ValidationException';

describe('Money Value Object', () => {
  describe('create - valid amounts', () => {
    it('should create money with positive amount', () => {
      const money = Money.create(100, 'USD');
      expect(money.getAmount()).toBe(100);
      expect(money.getCurrency()).toBe('USD');
    });

    it('should create money with zero amount', () => {
      const money = Money.create(0, 'USD');
      expect(money.getAmount()).toBe(0);
    });

    it('should create money with decimal amount', () => {
      const money = Money.create(99.99, 'USD');
      expect(money.getAmount()).toBe(99.99);
    });

    it('should create money with large amount', () => {
      const money = Money.create(1000000, 'USD');
      expect(money.getAmount()).toBe(1000000);
    });

    it('should create money with different currencies', () => {
      const usd = Money.create(100, 'USD');
      const eur = Money.create(100, 'EUR');
      const vnd = Money.create(100, 'VND');
      
      expect(usd.getCurrency()).toBe('USD');
      expect(eur.getCurrency()).toBe('EUR');
      expect(vnd.getCurrency()).toBe('VND');
    });
  });

  describe('create - invalid amounts', () => {
    it('should throw error for negative amount', () => {
      expect(() => Money.create(-1, 'USD')).toThrow(ValidationException);
      expect(() => Money.create(-1, 'USD')).toThrow('Amount cannot be negative');
    });

    it('should throw error for negative decimal', () => {
      expect(() => Money.create(-0.01, 'USD')).toThrow(ValidationException);
      expect(() => Money.create(-0.01, 'USD')).toThrow('Amount cannot be negative');
    });

    it('should throw error for empty currency', () => {
      expect(() => Money.create(100, '')).toThrow(ValidationException);
      expect(() => Money.create(100, '')).toThrow('Currency is required');
    });
  });

  describe('add', () => {
    it('should add money with same currency', () => {
      const money1 = Money.create(100, 'USD');
      const money2 = Money.create(50, 'USD');
      const result = money1.add(money2);
      
      expect(result.getAmount()).toBe(150);
      expect(result.getCurrency()).toBe('USD');
    });

    it('should add zero amount', () => {
      const money1 = Money.create(100, 'USD');
      const money2 = Money.create(0, 'USD');
      const result = money1.add(money2);
      
      expect(result.getAmount()).toBe(100);
    });

    it('should add decimal amounts', () => {
      const money1 = Money.create(10.5, 'USD');
      const money2 = Money.create(5.25, 'USD');
      const result = money1.add(money2);
      
      expect(result.getAmount()).toBeCloseTo(15.75, 2);
    });

    it('should throw error for different currencies', () => {
      const money1 = Money.create(100, 'USD');
      const money2 = Money.create(50, 'EUR');
      
      expect(() => money1.add(money2)).toThrow(ValidationException);
      expect(() => money1.add(money2)).toThrow('Cannot add money with different currencies');
    });
  });

  describe('subtract', () => {
    it('should subtract money with same currency', () => {
      const money1 = Money.create(100, 'USD');
      const money2 = Money.create(30, 'USD');
      const result = money1.subtract(money2);
      
      expect(result.getAmount()).toBe(70);
      expect(result.getCurrency()).toBe('USD');
    });

    it('should subtract to zero', () => {
      const money1 = Money.create(100, 'USD');
      const money2 = Money.create(100, 'USD');
      const result = money1.subtract(money2);
      
      expect(result.getAmount()).toBe(0);
    });

    it('should throw error when result would be negative', () => {
      const money1 = Money.create(100, 'USD');
      const money2 = Money.create(150, 'USD');
      
      expect(() => money1.subtract(money2)).toThrow(ValidationException);
      expect(() => money1.subtract(money2)).toThrow('Amount cannot be negative');
    });

    it('should throw error for different currencies', () => {
      const money1 = Money.create(100, 'USD');
      const money2 = Money.create(50, 'EUR');
      
      expect(() => money1.subtract(money2)).toThrow(ValidationException);
      expect(() => money1.subtract(money2)).toThrow('Cannot subtract money with different currencies');
    });
  });

  describe('multiply', () => {
    it('should multiply amount by positive number', () => {
      const money = Money.create(100, 'USD');
      const result = money.multiply(2);
      
      expect(result.getAmount()).toBe(200);
      expect(result.getCurrency()).toBe('USD');
    });

    it('should multiply by zero', () => {
      const money = Money.create(100, 'USD');
      const result = money.multiply(0);
      
      expect(result.getAmount()).toBe(0);
    });

    it('should multiply by decimal', () => {
      const money = Money.create(100, 'USD');
      const result = money.multiply(0.5);
      
      expect(result.getAmount()).toBe(50);
    });

    it('should multiply by decimal with precision', () => {
      const money = Money.create(10, 'USD');
      const result = money.multiply(1.15);
      
      expect(result.getAmount()).toBeCloseTo(11.5, 2);
    });

    it('should throw error for negative multiplier', () => {
      const money = Money.create(100, 'USD');
      
      expect(() => money.multiply(-1)).toThrow(ValidationException);
      expect(() => money.multiply(-1)).toThrow('Amount cannot be negative');
    });
  });

  describe('equals', () => {
    it('should return true for same amount and currency', () => {
      const money1 = Money.create(100, 'USD');
      const money2 = Money.create(100, 'USD');
      
      expect(money1.equals(money2)).toBe(true);
    });

    it('should return false for different amounts', () => {
      const money1 = Money.create(100, 'USD');
      const money2 = Money.create(200, 'USD');
      
      expect(money1.equals(money2)).toBe(false);
    });

    it('should return false for different currencies', () => {
      const money1 = Money.create(100, 'USD');
      const money2 = Money.create(100, 'EUR');
      
      expect(money1.equals(money2)).toBe(false);
    });

    it('should return false for both different', () => {
      const money1 = Money.create(100, 'USD');
      const money2 = Money.create(200, 'EUR');
      
      expect(money1.equals(money2)).toBe(false);
    });
  });

  describe('isGreaterThan', () => {
    it('should return true when amount is greater', () => {
      const money1 = Money.create(100, 'USD');
      const money2 = Money.create(50, 'USD');
      
      expect(money1.isGreaterThan(money2)).toBe(true);
    });

    it('should return false when amount is less', () => {
      const money1 = Money.create(50, 'USD');
      const money2 = Money.create(100, 'USD');
      
      expect(money1.isGreaterThan(money2)).toBe(false);
    });

    it('should return false when amounts are equal', () => {
      const money1 = Money.create(100, 'USD');
      const money2 = Money.create(100, 'USD');
      
      expect(money1.isGreaterThan(money2)).toBe(false);
    });

    it('should throw error for different currencies', () => {
      const money1 = Money.create(100, 'USD');
      const money2 = Money.create(50, 'EUR');
      
      expect(() => money1.isGreaterThan(money2)).toThrow(ValidationException);
      expect(() => money1.isGreaterThan(money2)).toThrow('Cannot compare money with different currencies');
    });
  });

  describe('getAmount and getCurrency', () => {
    it('should return correct amount', () => {
      const money = Money.create(123.45, 'USD');
      expect(money.getAmount()).toBe(123.45);
    });

    it('should return correct currency', () => {
      const money = Money.create(100, 'EUR');
      expect(money.getCurrency()).toBe('EUR');
    });

    it('should return immutable values', () => {
      const money = Money.create(100, 'USD');
      const amount1 = money.getAmount();
      const amount2 = money.getAmount();
      const currency1 = money.getCurrency();
      const currency2 = money.getCurrency();
      
      expect(amount1).toBe(amount2);
      expect(currency1).toBe(currency2);
    });
  });
});
