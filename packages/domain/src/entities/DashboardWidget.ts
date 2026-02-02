import { ValidationException } from '../exceptions/ValidationException';
import type { LayoutPosition } from '../value-objects/LayoutPosition';
import { WidgetType } from '../enums/WidgetType';

export interface DashboardWidgetProps {
  id: string;
  userId: string;
  type: WidgetType;
  isVisible: boolean;
  layoutPosition: LayoutPosition | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DashboardWidget Entity
 * Represents a widget on user's dashboard with customizable position and visibility
 */
export class DashboardWidget {
  private constructor(
    private readonly id: string,
    private readonly userId: string,
    private readonly type: WidgetType,
    private isVisible: boolean,
    private layoutPosition: LayoutPosition | null,
    private readonly createdAt: Date,
    private updatedAt: Date
  ) {
    this.validate();
  }

  static create(
    id: string,
    userId: string,
    type: WidgetType,
    isVisible: boolean = true,
    layoutPosition: LayoutPosition | null = null
  ): DashboardWidget {
    const now = new Date();
    return new DashboardWidget(id, userId, type, isVisible, layoutPosition, now, now);
  }

  static fromProps(props: DashboardWidgetProps): DashboardWidget {
    return new DashboardWidget(
      props.id,
      props.userId,
      props.type,
      props.isVisible,
      props.layoutPosition,
      props.createdAt,
      props.updatedAt
    );
  }

  private validate(): void {
    if (!this.id || this.id.trim() === '') {
      throw new ValidationException('Widget ID is required');
    }
    if (!this.userId || this.userId.trim() === '') {
      throw new ValidationException('User ID is required');
    }
    if (!Object.values(WidgetType).includes(this.type)) {
      throw new ValidationException('Invalid widget type');
    }
  }

  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getType(): WidgetType {
    return this.type;
  }

  getIsVisible(): boolean {
    return this.isVisible;
  }

  getLayoutPosition(): LayoutPosition | null {
    return this.layoutPosition;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  setVisible(visible: boolean): void {
    this.isVisible = visible;
    this.updatedAt = new Date();
  }

  updateLayoutPosition(position: LayoutPosition): void {
    this.layoutPosition = position;
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      type: this.type,
      isVisible: this.isVisible,
      layoutPosition: this.layoutPosition,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
