import { DomainException } from './DomainException';

/**
 * Validation Exception - Thrown when domain validation fails
 */
export class ValidationException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationException';
    Object.setPrototypeOf(this, ValidationException.prototype);
  }
}
