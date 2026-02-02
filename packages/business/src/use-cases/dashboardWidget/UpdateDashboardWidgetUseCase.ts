import { DashboardWidget, LayoutPosition } from 'hayahub-domain';
import { success, failure, type Result } from 'hayahub-shared';
import type { IDashboardWidgetRepository } from '../../ports/IDashboardWidgetRepository';
import type { UpdateDashboardWidgetDTO } from '../../dtos/dashboardWidget';

export class UpdateDashboardWidgetUseCase {
  constructor(private readonly widgetRepository: IDashboardWidgetRepository) {}

  async execute(
    widgetId: string,
    updates: UpdateDashboardWidgetDTO
  ): Promise<Result<void, Error>> {
    try {
      const widget = await this.widgetRepository.findById(widgetId);

      if (!widget) {
        return failure(new Error('Widget not found'));
      }

      if (updates.isVisible !== undefined) {
        widget.setVisible(updates.isVisible);
      }

      if (updates.layoutPosition) {
        const layoutPosition = LayoutPosition.fromData(updates.layoutPosition);
        widget.updateLayoutPosition(layoutPosition);
      }

      await this.widgetRepository.update(widget);

      return success(undefined);
    } catch (error) {
      return failure(error as Error);
    }
  }
}
