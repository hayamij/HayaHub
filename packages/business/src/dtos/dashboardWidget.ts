import type { WidgetType, LayoutPositionData } from 'hayahub-domain';

export interface CreateDashboardWidgetDTO {
  userId: string;
  type: WidgetType;
  isVisible?: boolean;
  layoutPosition?: LayoutPositionData | null;
}

export interface UpdateDashboardWidgetDTO {
  isVisible?: boolean;
  layoutPosition?: LayoutPositionData | null;
}

export interface DashboardWidgetDTO {
  id: string;
  userId: string;
  type: WidgetType;
  isVisible: boolean;
  layoutPosition: LayoutPositionData | null;
  createdAt: Date;
  updatedAt: Date;
}
