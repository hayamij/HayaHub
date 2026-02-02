import { success, failure, type Result } from 'hayahub-shared';
import type { IDashboardWidgetRepository } from '../../ports/IDashboardWidgetRepository';
import type { UpdateDashboardWidgetDTO } from '../../dtos/dashboardWidget';
import { LayoutPosition } from 'hayahub-domain';

export interface WidgetUpdate {
  id: string;
  updates: UpdateDashboardWidgetDTO;
}

export class UpdateManyDashboardWidgetsUseCase {
  constructor(private readonly widgetRepository: IDashboardWidgetRepository) {}

  async execute(userId: string, widgetUpdates: WidgetUpdate[]): Promise<Result<void, Error>> {
    try {
      // Fetch all widgets at once
      const allWidgets = await this.widgetRepository.findByUserId(userId);
      
      // Apply updates to each widget
      const updatedWidgets = allWidgets.map((widget) => {
        const update = widgetUpdates.find((u) => u.id === widget.getId());
        if (!update) return widget;

        let updated = widget;

        if (update.updates.isVisible !== undefined) {
          updated = updated.withVisibility(update.updates.isVisible);
        }

        if (update.updates.layoutPosition) {
          const pos = LayoutPosition.fromData(update.updates.layoutPosition);
          updated = updated.withLayoutPosition(pos);
        }

        return updated;
      });

      // Single batch update
      await this.widgetRepository.updateMany(updatedWidgets);

      return success(undefined);
    } catch (error) {
      return failure(error as Error);
    }
  }
}
