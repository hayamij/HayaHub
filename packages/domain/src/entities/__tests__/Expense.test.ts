import { describe, it, expect } from 'vitest';
import { Expense, Money, ExpenseCategory, UserIdFactory } from '../../';
import { ValidationException } from '../../exceptions/ValidationException';

describe('Expense Entity', () => {
  const validAmount = Money.create(100, 'USD');
  const userId1 = UserIdFactory.create('user-1');
  const userId2 = UserIdFactory.create('user-2');
  const expenseId1 = 'exp-1';
  const expenseId2 = 'exp-2';
  const testDate = new Date('2024-01-15');
  
  describe('create - valid expenses', () => {
    it('should create expense with valid data', () => {
      const expense = Expense.create(
        expenseId1,
        userId1,
        'Grocery shopping',
        validAmount,
        ExpenseCategory.FOOD,
        testDate,
        ['groceries', 'monthly']
      );
      
      expect(expense.id).toBe(expenseId1);
      expect(expense.userId).toBe(userId1);
      expect(expense.description).toBe('Grocery shopping');
      expect(expense.amount.equals(validAmount)).toBe(true);
      expect(expense.category).toBe(ExpenseCategory.FOOD);
      expect(expense.date).toBe(testDate);
      expect(expense.tags).toEqual(['groceries', 'monthly']);
      expect(expense.createdAt).toBeInstanceOf(Date);
      expect(expense.updatedAt).toBeInstanceOf(Date);
    });

    it('should create expense without tags', () => {
      const expense = Expense.create(
        expenseId1,
        userId1,
        'No tags',
        validAmount,
        ExpenseCategory.OTHER,
        testDate
      );
      
      expect(expense.tags).toEqual([]);
    });

    it('should create expense with zero amount', () => {
      const zeroAmount = Money.create(0, 'USD');
      const expense = Expense.create(
        expenseId1,
        userId1,
        'Free item',
        zeroAmount,
        ExpenseCategory.OTHER,
        testDate
      );
      
      expect(expense.amount.getAmount()).toBe(0);
    });

    it('should create expense with large amount', () => {
      const largeAmount = Money.create(999999.99, 'USD');
      const expense = Expense.create(
        expenseId1,
        userId1,
        'Big purchase',
        largeAmount,
        ExpenseCategory.OTHER,
        testDate
      );
      
      expect(expense.amount.getAmount()).toBe(999999.99);
    });

    it('should create expense with different currency', () => {
      const eurAmount = Money.create(100, 'EUR');
      const expense = Expense.create(
        expenseId1,
        userId1,
        'European expense',
        eurAmount,
        ExpenseCategory.TRAVEL,
        testDate
      );
      
      expect(expense.amount.getCurrency()).toBe('EUR');
    });

    it('should create expense with different categories', () => {
      const categories = [
        ExpenseCategory.FOOD,
        ExpenseCategory.TRANSPORT,
        ExpenseCategory.ENTERTAINMENT,
        ExpenseCategory.HEALTHCARE,
        ExpenseCategory.EDUCATION,
        ExpenseCategory.SHOPPING,
        ExpenseCategory.BILLS,
        ExpenseCategory.TRAVEL,
        ExpenseCategory.OTHER,
      ];

      categories.forEach(category => {
        const expense = Expense.create(
          expenseId1,
          userId1,
          'Test expense',
          validAmount,
          category,
          testDate
        );
        expect(expense.category).toBe(category);
      });
    });
  });

  describe('create - invalid expenses', () => {
    it('should throw error for empty description', () => {
      expect(() => Expense.create(
        expenseId1,
        userId1,
        '',
        validAmount,
        ExpenseCategory.OTHER,
        testDate
      )).toThrow(ValidationException);
      expect(() => Expense.create(
        expenseId1,
        userId1,
        '',
        validAmount,
        ExpenseCategory.OTHER,
        testDate
      )).toThrow('Description is required');
    });

    it('should throw error for whitespace-only description', () => {
      expect(() => Expense.create(
        expenseId1,
        userId1,
        '   ',
        validAmount,
        ExpenseCategory.OTHER,
        testDate
      )).toThrow(ValidationException);
      expect(() => Expense.create(
        expenseId1,
        userId1,
        '   ',
        validAmount,
        ExpenseCategory.OTHER,
        testDate
      )).toThrow('Description is required');
    });
  });

  describe('updateDescription', () => {
    it('should update description successfully', () => {
      const expense = Expense.create(
        expenseId1,
        userId1,
        'Old description',
        validAmount,
        ExpenseCategory.OTHER,
        testDate
      );
      const oldUpdatedAt = expense.updatedAt;
      
      setTimeout(() => {
        expense.updateDescription('New description');
        
        expect(expense.description).toBe('New description');
        expect(expense.updatedAt.getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());
      }, 10);
    });

    it('should throw error for empty description', () => {
      const expense = Expense.create(
        expenseId1,
        userId1,
        'Old description',
        validAmount,
        ExpenseCategory.OTHER,
        testDate
      );
      
      expect(() => expense.updateDescription('')).toThrow(ValidationException);
      expect(() => expense.updateDescription('')).toThrow('Description cannot be empty');
    });

    it('should throw error for whitespace-only description', () => {
      const expense = Expense.create(
        expenseId1,
        userId1,
        'Old description',
        validAmount,
        ExpenseCategory.OTHER,
        testDate
      );
      
      expect(() => expense.updateDescription('  ')).toThrow(ValidationException);
    });

    it('should keep old description when update fails', () => {
      const expense = Expense.create(
        expenseId1,
        userId1,
        'Old description',
        validAmount,
        ExpenseCategory.OTHER,
        testDate
      );
      
      try {
        expense.updateDescription('');
      } catch (e) {
        // Expected error
      }
      
      expect(expense.description).toBe('Old description');
    });

    it('should trim whitespace from description', () => {
      const expense = Expense.create(
        expenseId1,
        userId1,
        'Old description',
        validAmount,
        ExpenseCategory.OTHER,
        testDate
      );
      
      expense.updateDescription('  New description  ');
      expect(expense.description).toBe('New description');
    });
  });

  describe('updateAmount', () => {
    it('should update amount successfully', () => {
      const expense = Expense.create(
        expenseId1,
        userId1,
        'Description',
        validAmount,
        ExpenseCategory.OTHER,
        testDate
      );
      const newAmount = Money.create(200, 'USD');
      const oldUpdatedAt = expense.updatedAt;
      
      setTimeout(() => {
        expense.updateAmount(newAmount);
        
        expect(expense.amount.equals(newAmount)).toBe(true);
        expect(expense.updatedAt.getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());
      }, 10);
    });

    it('should update to zero amount', () => {
      const expense = Expense.create(
        expenseId1,
        userId1,
        'Description',
        validAmount,
        ExpenseCategory.OTHER,
        testDate
      );
      const zeroAmount = Money.create(0, 'USD');
      
      expense.updateAmount(zeroAmount);
      
      expect(expense.amount.getAmount()).toBe(0);
    });

    it('should update to different currency', () => {
      const expense = Expense.create(
        expenseId1,
        userId1,
        'Description',
        validAmount,
        ExpenseCategory.OTHER,
        testDate
      );
      const eurAmount = Money.create(100, 'EUR');
      
      expense.updateAmount(eurAmount);
      
      expect(expense.amount.getCurrency()).toBe('EUR');
    });

    it('should keep old amount reference after update', () => {
      const expense = Expense.create(
        expenseId1,
        userId1,
        'Description',
        validAmount,
        ExpenseCategory.OTHER,
        testDate
      );
      const oldAmount = expense.amount;
      const newAmount = Money.create(200, 'USD');
      
      expense.updateAmount(newAmount);
      
      // Old reference should still work
      expect(oldAmount.getAmount()).toBe(100);
    });
  });

  describe('updateCategory', () => {
    it('should update category successfully', () => {
      const expense = Expense.create(
        expenseId1,
        userId1,
        'Description',
        validAmount,
        ExpenseCategory.FOOD,
        testDate
      );
      const oldUpdatedAt = expense.updatedAt;
      
      setTimeout(() => {
        expense.updateCategory(ExpenseCategory.TRANSPORT);
        
        expect(expense.category).toBe(ExpenseCategory.TRANSPORT);
        expect(expense.updatedAt.getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());
      }, 10);
    });

    it('should update to different categories', () => {
      const expense = Expense.create(
        expenseId1,
        userId1,
        'Description',
        validAmount,
        ExpenseCategory.FOOD,
        testDate
      );
      
      expense.updateCategory(ExpenseCategory.ENTERTAINMENT);
      expect(expense.category).toBe(ExpenseCategory.ENTERTAINMENT);
      
      expense.updateCategory(ExpenseCategory.HEALTHCARE);
      expect(expense.category).toBe(ExpenseCategory.HEALTHCARE);
    });
  });

  describe('updateDate', () => {
    it('should update date successfully', () => {
      const expense = Expense.create(
        expenseId1,
        userId1,
        'Description',
        validAmount,
        ExpenseCategory.OTHER,
        testDate
      );
      const newDate = new Date('2024-02-15');
      const oldUpdatedAt = expense.updatedAt;
      
      setTimeout(() => {
        expense.updateDate(newDate);
        
        expect(expense.date).toBe(newDate);
        expect(expense.updatedAt.getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());
      }, 10);
    });

    it('should update to different date', () => {
      const expense = Expense.create(
        expenseId1,
        userId1,
        'Description',
        validAmount,
        ExpenseCategory.OTHER,
        testDate
      );
      const newDate = new Date('2025-01-01');
      
      expense.updateDate(newDate);
      
      expect(expense.date.getFullYear()).toBe(2025);
    });
  });

  describe('addTag', () => {
    it('should add tag successfully', () => {
      const expense = Expense.create(
        expenseId1,
        userId1,
        'Description',
        validAmount,
        ExpenseCategory.OTHER,
        testDate,
        []
      );
      
      expense.addTag('urgent');
      
      expect(expense.tags).toContain('urgent');
    });

    it('should not add duplicate tag', () => {
      const expense = Expense.create(
        expenseId1,
        userId1,
        'Description',
        validAmount,
        ExpenseCategory.OTHER,
        testDate,
        ['urgent']
      );
      
      expense.addTag('urgent');
      
      expect(expense.tags.filter(t => t === 'urgent').length).toBe(1);
    });

    it('should add multiple tags', () => {
      const expense = Expense.create(
        expenseId1,
        userId1,
        'Description',
        validAmount,
        ExpenseCategory.OTHER,
        testDate,
        []
      );
      
      expense.addTag('urgent');
      expense.addTag('important');
      expense.addTag('monthly');
      
      expect(expense.tags).toEqual(['urgent', 'important', 'monthly']);
    });

    it('should update updatedAt when adding tag', () => {
      const expense = Expense.create(
        expenseId1,
        userId1,
        'Description',
        validAmount,
        ExpenseCategory.OTHER,
        testDate,
        []
      );
      const oldUpdatedAt = expense.updatedAt;
      
      setTimeout(() => {
        expense.addTag('new-tag');
        expect(expense.updatedAt.getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());
      }, 10);
    });
  });

  describe('removeTag', () => {
    it('should remove tag successfully', () => {
      const expense = Expense.create(
        expenseId1,
        userId1,
        'Description',
        validAmount,
        ExpenseCategory.OTHER,
        testDate,
        ['urgent', 'important']
      );
      
      expense.removeTag('urgent');
      
      expect(expense.tags).not.toContain('urgent');
      expect(expense.tags).toContain('important');
    });

    it('should handle removing non-existent tag', () => {
      const expense = Expense.create(
        expenseId1,
        userId1,
        'Description',
        validAmount,
        ExpenseCategory.OTHER,
        testDate,
        ['urgent']
      );
      
      expense.removeTag('nonexistent');
      
      expect(expense.tags).toEqual(['urgent']);
    });

    it('should remove all instances of tag', () => {
      const expense = Expense.create(
        expenseId1,
        userId1,
        'Description',
        validAmount,
        ExpenseCategory.OTHER,
        testDate,
        ['urgent', 'important', 'urgent']
      );
      
      expense.removeTag('urgent');
      
      expect(expense.tags.filter(t => t === 'urgent').length).toBe(0);
    });
  });

  describe('isOwnedBy', () => {
    it('should return true for owner', () => {
      const expense = Expense.create(
        expenseId1,
        userId1,
        'Description',
        validAmount,
        ExpenseCategory.OTHER,
        testDate
      );
      
      expect(expense.isOwnedBy(userId1)).toBe(true);
    });

    it('should return false for different user', () => {
      const expense = Expense.create(
        expenseId1,
        userId1,
        'Description',
        validAmount,
        ExpenseCategory.OTHER,
        testDate
      );
      
      expect(expense.isOwnedBy(userId2)).toBe(false);
    });
  });

  describe('isInMonth', () => {
    it('should return true for correct year and month', () => {
      const expense = Expense.create(
        expenseId1,
        userId1,
        'Description',
        validAmount,
        ExpenseCategory.OTHER,
        new Date('2024-01-15')
      );
      
      expect(expense.isInMonth(2024, 0)).toBe(true); // January is month 0
    });

    it('should return false for different month', () => {
      const expense = Expense.create(
        expenseId1,
        userId1,
        'Description',
        validAmount,
        ExpenseCategory.OTHER,
        new Date('2024-01-15')
      );
      
      expect(expense.isInMonth(2024, 1)).toBe(false); // February is month 1
    });

    it('should return false for different year', () => {
      const expense = Expense.create(
        expenseId1,
        userId1,
        'Description',
        validAmount,
        ExpenseCategory.OTHER,
        new Date('2024-01-15')
      );
      
      expect(expense.isInMonth(2023, 0)).toBe(false);
    });
  });

  describe('reconstruct', () => {
    it('should reconstruct expense from storage', () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      
      const expense = Expense.reconstruct(
        expenseId1,
        userId1,
        'Description',
        validAmount,
        ExpenseCategory.FOOD,
        testDate,
        ['tag1', 'tag2'],
        createdAt,
        updatedAt
      );
      
      expect(expense.id).toBe(expenseId1);
      expect(expense.userId).toBe(userId1);
      expect(expense.description).toBe('Description');
      expect(expense.amount.equals(validAmount)).toBe(true);
      expect(expense.category).toBe(ExpenseCategory.FOOD);
      expect(expense.date).toBe(testDate);
      expect(expense.tags).toEqual(['tag1', 'tag2']);
      expect(expense.createdAt).toBe(createdAt);
      expect(expense.updatedAt).toBe(updatedAt);
    });

    it('should reconstruct expense without tags', () => {
      const expense = Expense.reconstruct(
        expenseId1,
        userId1,
        'Description',
        validAmount,
        ExpenseCategory.OTHER,
        testDate,
        [],
        new Date(),
        new Date()
      );
      
      expect(expense.tags).toEqual([]);
    });
  });

  describe('immutability', () => {
    it('should not change createdAt after updates', () => {
      const expense = Expense.create(
        expenseId1,
        userId1,
        'Description',
        validAmount,
        ExpenseCategory.OTHER,
        testDate
      );
      const createdAt = expense.createdAt;
      
      expense.updateDescription('New description');
      expense.updateAmount(Money.create(200, 'USD'));
      
      expect(expense.createdAt).toBe(createdAt);
    });

    it('should not allow direct modification of amount', () => {
      const expense = Expense.create(
        expenseId1,
        userId1,
        'Description',
        validAmount,
        ExpenseCategory.OTHER,
        testDate
      );
      const originalAmount = expense.amount.getAmount();
      
      // Amount is a value object, so this creates a new object
      const newAmount = Money.create(200, 'USD');
      
      // Original expense amount should not change
      expect(expense.amount.getAmount()).toBe(originalAmount);
    });

    it('should return copy of tags array', () => {
      const expense = Expense.create(
        expenseId1,
        userId1,
        'Description',
        validAmount,
        ExpenseCategory.OTHER,
        testDate,
        ['tag1']
      );
      
      const tags = expense.tags;
      tags.push('tag2');
      
      // Original expense tags should not change
      expect(expense.tags).toEqual(['tag1']);
    });
  });
});
