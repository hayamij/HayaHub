import { ValidationException } from '../exceptions/ValidationException';

/**
 * LayoutPosition Value Object
 * Represents position and size of a draggable/resizable item in workspace
 */
export interface LayoutPositionData {
  x: number;
  y: number;
  w: number;
  h: number;
}

export class LayoutPosition {
  private constructor(
    private readonly x: number,
    private readonly y: number,
    private readonly width: number,
    private readonly height: number
  ) {
    this.validate();
  }

  static create(x: number, y: number, width: number, height: number): LayoutPosition {
    return new LayoutPosition(x, y, width, height);
  }

  static fromData(data: LayoutPositionData): LayoutPosition {
    return new LayoutPosition(data.x, data.y, data.w, data.h);
  }

  static default(): LayoutPosition {
    return new LayoutPosition(0, 0, 300, 200);
  }

  private validate(): void {
    if (this.x < 0 || this.y < 0) {
      throw new ValidationException('Position coordinates cannot be negative');
    }
    if (this.width <= 0 || this.height <= 0) {
      throw new ValidationException('Width and height must be positive');
    }
  }

  getX(): number {
    return this.x;
  }

  getY(): number {
    return this.y;
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  toData(): LayoutPositionData {
    return {
      x: this.x,
      y: this.y,
      w: this.width,
      h: this.height,
    };
  }

  updatePosition(x: number, y: number): LayoutPosition {
    return new LayoutPosition(x, y, this.width, this.height);
  }

  updateSize(width: number, height: number): LayoutPosition {
    return new LayoutPosition(this.x, this.y, width, height);
  }

  equals(other: LayoutPosition): boolean {
    return (
      this.x === other.x &&
      this.y === other.y &&
      this.width === other.width &&
      this.height === other.height
    );
  }
}
