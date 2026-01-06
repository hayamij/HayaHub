import { ValidationException } from '../exceptions/ValidationException';

/**
 * DateRange Value Object
 * Represents a time period with start and end dates
 */
export class DateRange {
  private constructor(
    private readonly startDate: Date,
    private readonly endDate: Date
  ) {
    this.validate();
  }

  static create(startDate: Date, endDate: Date): DateRange {
    return new DateRange(startDate, endDate);
  }

  private validate(): void {
    if (this.endDate < this.startDate) {
      throw new ValidationException('End date cannot be before start date');
    }
  }

  getStartDate(): Date {
    return this.startDate;
  }

  getEndDate(): Date {
    return this.endDate;
  }

  getDurationInDays(): number {
    const diff = this.endDate.getTime() - this.startDate.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  contains(date: Date): boolean {
    return date >= this.startDate && date <= this.endDate;
  }

  overlaps(other: DateRange): boolean {
    return this.startDate <= other.endDate && this.endDate >= other.startDate;
  }

  equals(other: DateRange): boolean {
    return (
      this.startDate.getTime() === other.startDate.getTime() &&
      this.endDate.getTime() === other.endDate.getTime()
    );
  }

  toString(): string {
    return `${this.startDate.toISOString()} - ${this.endDate.toISOString()}`;
  }
}
