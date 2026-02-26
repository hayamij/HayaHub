import { success, failure, type Result } from 'hayahub-shared';
import type { IDashboardWidgetRepository } from '../../ports/IDashboardWidgetRepository';
import type { DashboardWidgetDTO } from '../../dtos/dashboardWidget';
import { dashboardWidgetMapper } from '../../mappers/DashboardWidgetMapper';

export class GetDashboardWidgetsUseCase {
  constructor(private readonly widgetRepository: IDashboardWidgetRepository) {}

  async execute(userId: string): Promise<Result<DashboardWidgetDTO[], Error>> {
    try {
      const widgets = await this.widgetRepository.findByUserId(userId);
      
      // If no widgets exist, initialize defaults
      if (widgets.length === 0) {
        await this.widgetRepository.initializeDefaultWidgets(userId);
        const defaultWidgets = await this.widgetRepository.findByUserId(userId);
        return success(dashboardWidgetMapper.toDTOs(defaultWidgets));
      }

      return success(dashboardWidgetMapper.toDTOs(widgets));
    } catch (error) {
      return failure(error as Error);
    }
  }
}
