import { ValidationException } from '../exceptions/ValidationException';

/**
 * Email Value Object
 * Ensures email validity at domain level
 */
export class Email {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(private readonly value: string) {
    this.validate();
  }

  static create(email: string): Email {
    return new Email(email);
  }

  private validate(): void {
    if (!this.value || !Email.EMAIL_REGEX.test(this.value)) {
      throw new ValidationException('Invalid email format');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value.toLowerCase() === other.value.toLowerCase();
  }

  toString(): string {
    return this.value;
  }
}
