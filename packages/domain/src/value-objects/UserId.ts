import { ValidationException } from '../exceptions/ValidationException';

export type UserId = string;

export class UserIdFactory {
  static create(id: string): UserId {
    if (!id || id.trim().length === 0) {
      throw new ValidationException('UserId cannot be empty');
    }
    return id.trim();
  }

  static generate(): UserId {
    return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
