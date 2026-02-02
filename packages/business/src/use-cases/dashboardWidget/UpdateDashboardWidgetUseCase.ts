import { LayoutPosition } from 'hayahub-domain';
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

      let updatedWidget = widget;

      if (updates.isVisible !== undefined) {
        updatedWidget = updatedWidget.withVisibility(updates.isVisible);
      }

      if (updates.layoutPosition) {
        const layoutPosition = LayoutPosition.fromData(updates.layoutPosition);
        updatedWidget = updatedWidget.withLayoutPosition(layoutPosition);
      }

      await this.widgetRepository.update(updatedWidget);

      return success(undefined);
    } catch (error) {
      return failure(error as Error);
    }
  }
}
