import { describe, it, expect } from 'vitest';
import { DateRange } from '../DateRange';
import { ValidationException } from '../../exceptions/ValidationException';

describe('DateRange Value Object', () => {
  describe('create - valid date ranges', () => {
    it('should create date range with start before end', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-31');
      const range = DateRange.create(start, end);
      
      expect(range.getStartDate()).toEqual(start);
      expect(range.getEndDate()).toEqual(end);
    });

    it('should create date range with same start and end', () => {
      const date = new Date('2024-01-01');
      const range = DateRange.create(date, date);
      
      expect(range.getStartDate()).toEqual(date);
      expect(range.getEndDate()).toEqual(date);
    });

    it('should create date range spanning one year', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-12-31');
      const range = DateRange.create(start, end);
      
      expect(range.getDurationInDays()).toBe(365);
    });

    it('should create date range spanning one day', () => {
      const start = new Date('2024-01-01T00:00:00');
      const end = new Date('2024-01-01T23:59:59');
      const range = DateRange.create(start, end);
      
      expect(range.getDurationInDays()).toBe(1);
    });

    it('should create date range with different years', () => {
      const start = new Date('2023-12-31');
      const end = new Date('2024-01-01');
      const range = DateRange.create(start, end);
      
      expect(range.getStartDate().getFullYear()).toBe(2023);
      expect(range.getEndDate().getFullYear()).toBe(2024);
    });
  });

  describe('create - invalid date ranges', () => {
    it('should throw error when start is after end', () => {
      const start = new Date('2024-01-31');
      const end = new Date('2024-01-01');
      
      expect(() => DateRange.create(start, end)).toThrow(ValidationException);
      expect(() => DateRange.create(start, end)).toThrow('End date cannot be before start date');
    });

    it('should throw error when start is far after end', () => {
      const start = new Date('2025-01-01');
      const end = new Date('2024-01-01');
      
      expect(() => DateRange.create(start, end)).toThrow(ValidationException);
    });
  });

  describe('contains', () => {
    const range = DateRange.create(
      new Date('2024-01-01'),
      new Date('2024-01-31')
    );

    it('should return true for date at start', () => {
      const date = new Date('2024-01-01');
      expect(range.contains(date)).toBe(true);
    });

    it('should return true for date at end', () => {
      const date = new Date('2024-01-31');
      expect(range.contains(date)).toBe(true);
    });

    it('should return true for date in middle', () => {
      const date = new Date('2024-01-15');
      expect(range.contains(date)).toBe(true);
    });

    it('should return false for date before start', () => {
      const date = new Date('2023-12-31');
      expect(range.contains(date)).toBe(false);
    });

    it('should return false for date after end', () => {
      const date = new Date('2024-02-01');
      expect(range.contains(date)).toBe(false);
    });

    it('should return false for date far before start', () => {
      const date = new Date('2023-01-01');
      expect(range.contains(date)).toBe(false);
    });

    it('should return false for date far after end', () => {
      const date = new Date('2025-01-01');
      expect(range.contains(date)).toBe(false);
    });
  });

  describe('overlaps', () => {
    const range1 = DateRange.create(
      new Date('2024-01-01'),
      new Date('2024-01-31')
    );

    it('should return true for overlapping ranges', () => {
      const range2 = DateRange.create(
        new Date('2024-01-15'),
        new Date('2024-02-15')
      );
      
      expect(range1.overlaps(range2)).toBe(true);
    });

    it('should return true for range contained within', () => {
      const range2 = DateRange.create(
        new Date('2024-01-10'),
        new Date('2024-01-20')
      );
      
      expect(range1.overlaps(range2)).toBe(true);
    });

    it('should return true for range containing', () => {
      const range2 = DateRange.create(
        new Date('2023-12-01'),
        new Date('2024-02-28')
      );
      
      expect(range1.overlaps(range2)).toBe(true);
    });

    it('should return true for same range', () => {
      const range2 = DateRange.create(
        new Date('2024-01-01'),
        new Date('2024-01-31')
      );
      
      expect(range1.overlaps(range2)).toBe(true);
    });

    it('should return true for ranges touching at start', () => {
      const range2 = DateRange.create(
        new Date('2024-01-01'),
        new Date('2024-01-15')
      );
      
      expect(range1.overlaps(range2)).toBe(true);
    });

    it('should return true for ranges touching at end', () => {
      const range2 = DateRange.create(
        new Date('2024-01-15'),
        new Date('2024-01-31')
      );
      
      expect(range1.overlaps(range2)).toBe(true);
    });

    it('should return false for non-overlapping range before', () => {
      const range2 = DateRange.create(
        new Date('2023-12-01'),
        new Date('2023-12-31')
      );
      
      expect(range1.overlaps(range2)).toBe(false);
    });

    it('should return false for non-overlapping range after', () => {
      const range2 = DateRange.create(
        new Date('2024-02-01'),
        new Date('2024-02-28')
      );
      
      expect(range1.overlaps(range2)).toBe(false);
    });
  });

  describe('getDurationInDays', () => {
    it('should return 0 for same day', () => {
      const range = DateRange.create(
        new Date('2024-01-01'),
        new Date('2024-01-01')
      );
      
      expect(range.getDurationInDays()).toBe(0);
    });

    it('should return 1 for consecutive days', () => {
      const range = DateRange.create(
        new Date('2024-01-01'),
        new Date('2024-01-02')
      );
      
      expect(range.getDurationInDays()).toBe(1);
    });

    it('should return 30 for 31-day range', () => {
      const range = DateRange.create(
        new Date('2024-01-01'),
        new Date('2024-01-31')
      );
      
      expect(range.getDurationInDays()).toBe(30);
    });

    it('should return 365 for leap year', () => {
      const range = DateRange.create(
        new Date('2024-01-01'),
        new Date('2024-12-31')
      );
      
      expect(range.getDurationInDays()).toBe(365);
    });

    it('should return 364 for non-leap year', () => {
      const range = DateRange.create(
        new Date('2023-01-01'),
        new Date('2023-12-31')
      );
      
      expect(range.getDurationInDays()).toBe(364);
    });
  });

  describe('equals', () => {
    const range1 = DateRange.create(
      new Date('2024-01-01'),
      new Date('2024-01-31')
    );

    it('should return true for same start and end dates', () => {
      const range2 = DateRange.create(
        new Date('2024-01-01'),
        new Date('2024-01-31')
      );
      
      expect(range1.equals(range2)).toBe(true);
    });

    it('should return false for different start date', () => {
      const range2 = DateRange.create(
        new Date('2024-01-02'),
        new Date('2024-01-31')
      );
      
      expect(range1.equals(range2)).toBe(false);
    });

    it('should return false for different end date', () => {
      const range2 = DateRange.create(
        new Date('2024-01-01'),
        new Date('2024-01-30')
      );
      
      expect(range1.equals(range2)).toBe(false);
    });

    it('should return false for completely different dates', () => {
      const range2 = DateRange.create(
        new Date('2024-02-01'),
        new Date('2024-02-28')
      );
      
      expect(range1.equals(range2)).toBe(false);
    });
  });

  describe('getStartDate and getEndDate', () => {
    it('should return start date', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-31');
      const range = DateRange.create(start, end);
      
      expect(range.getStartDate()).toEqual(start);
    });

    it('should return end date', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-31');
      const range = DateRange.create(start, end);
      
      expect(range.getEndDate()).toEqual(end);
    });
  });
});
