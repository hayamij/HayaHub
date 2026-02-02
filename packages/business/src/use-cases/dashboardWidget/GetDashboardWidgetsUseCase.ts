import type { DashboardWidget } from 'hayahub-domain';
import { success, failure, type Result } from 'hayahub-shared';
import type { IDashboardWidgetRepository } from '../../ports/IDashboardWidgetRepository';
import type { DashboardWidgetDTO } from '../../dtos/dashboardWidget';

export class GetDashboardWidgetsUseCase {
  constructor(private readonly widgetRepository: IDashboardWidgetRepository) {}

  async execute(userId: string): Promise<Result<DashboardWidgetDTO[], Error>> {
    try {
      const widgets = await this.widgetRepository.findByUserId(userId);
      
      // If no widgets exist, initialize defaults
      if (widgets.length === 0) {
        await this.widgetRepository.initializeDefaultWidgets(userId);
        const defaultWidgets = await this.widgetRepository.findByUserId(userId);
        return success(defaultWidgets.map((w) => this.toDTO(w)));
      }

      return success(widgets.map((w) => this.toDTO(w)));
    } catch (error) {
      return failure(error as Error);
    }
  }

  private toDTO(widget: DashboardWidget): DashboardWidgetDTO {
    const layoutPos = widget.getLayoutPosition();
    return {
      id: widget.getId(),
      userId: widget.getUserId(),
      type: widget.getType(),
      isVisible: widget.getIsVisible(),
      layoutPosition: layoutPos
        ? {
            x: layoutPos.getX(),
            y: layoutPos.getY(),
            w: layoutPos.getWidth(),
            h: layoutPos.getHeight(),
          }
        : null,
      createdAt: widget.getCreatedAt(),
      updatedAt: widget.getUpdatedAt(),
    };
  }
}
