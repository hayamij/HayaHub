import { ValidationException } from '../exceptions/ValidationException';

/**
 * Money Value Object
 * Represents monetary amounts with currency
 */
export class Money {
  private constructor(
    private readonly amount: number,
    private readonly currency: string
  ) {
    this.validate();
  }

  static create(amount: number, currency: string = 'VND'): Money {
    return new Money(amount, currency);
  }

  private validate(): void {
    if (this.amount < 0) {
      throw new ValidationException('Amount cannot be negative');
    }
    if (!this.currency || this.currency.trim().length === 0) {
      throw new ValidationException('Currency is required');
    }
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new ValidationException('Cannot add money with different currencies');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new ValidationException('Cannot subtract money with different currencies');
    }
    return new Money(this.amount - other.amount, this.currency);
  }

  multiply(multiplier: number): Money {
    return new Money(this.amount * multiplier, this.currency);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  isGreaterThan(other: Money): boolean {
    if (this.currency !== other.currency) {
      throw new ValidationException('Cannot compare money with different currencies');
    }
    return this.amount > other.amount;
  }

  isLessThan(other: Money): boolean {
    if (this.currency !== other.currency) {
      throw new ValidationException('Cannot compare money with different currencies');
    }
    return this.amount < other.amount;
  }

  format(): string {
    return `${this.amount.toLocaleString()} ${this.currency}`;
  }

  toString(): string {
    return this.format();
  }
}
