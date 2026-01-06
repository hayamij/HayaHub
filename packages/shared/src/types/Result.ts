/**
 * Result type for functional error handling
 * Replaces throwing exceptions for expected errors
 */
export type Result<T, E = Error> = Success<T> | Failure<E>;

export class Success<T> {
  readonly success = true;
  constructor(readonly value: T) {}

  isSuccess(): this is Success<T> {
    return true;
  }

  isFailure(): this is Failure<never> {
    return false;
  }
}

export class Failure<E> {
  readonly success = false;
  constructor(readonly error: E) {}

  isSuccess(): this is Success<never> {
    return false;
  }

  isFailure(): this is Failure<E> {
    return true;
  }
}

export const success = <T>(value: T): Success<T> => new Success(value);
export const failure = <E>(error: E): Failure<E> => new Failure(error);
