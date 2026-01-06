/**
 * Generate unique IDs for entities
 */
export class IdGenerator {
  static generate(prefix: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `${prefix}_${timestamp}_${random}`;
  }

  static generateExpenseId(): string {
    return this.generate('exp');
  }

  static generateProjectId(): string {
    return this.generate('prj');
  }

  static generateTaskId(): string {
    return this.generate('tsk');
  }

  static generateEventId(): string {
    return this.generate('evt');
  }

  static generateWishItemId(): string {
    return this.generate('wsh');
  }

  static generateUserId(): string {
    return this.generate('usr');
  }
}
