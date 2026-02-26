import type { DashboardWidget } from 'hayahub-domain';
import type { DashboardWidgetDTO } from '../dtos/dashboardWidget';
import { BaseMapper } from './BaseMapper';

/**
 * DashboardWidget Mapper
 * Centralized mapping logic for DashboardWidget entity
 */
export class DashboardWidgetMapper extends BaseMapper<DashboardWidget, DashboardWidgetDTO> {
  toDTO(widget: DashboardWidget): DashboardWidgetDTO {
    const layoutPos = widget.getLayoutPosition();
    return {
      id: widget.getId(),
      userId: widget.getUserId(),
      type: widget.getType(),
      isVisible: widget.getIsVisible(),
      layoutPosition: layoutPos ? layoutPos.toData() : null,
      createdAt: widget.getCreatedAt(),
      updatedAt: widget.getUpdatedAt(),
    };
  }
}

export const dashboardWidgetMapper = new DashboardWidgetMapper();
