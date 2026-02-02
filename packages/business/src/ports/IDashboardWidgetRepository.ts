import type { DashboardWidget } from 'hayahub-domain';

export interface IDashboardWidgetRepository {
  /**
   * Find all dashboard widgets for a user
   */
  findByUserId(userId: string): Promise<DashboardWidget[]>;

  /**
   * Save a new dashboard widget
   */
  save(widget: DashboardWidget): Promise<void>;

  /**
   * Update an existing dashboard widget
   */
  update(widget: DashboardWidget): Promise<void>;

  /**
   * Delete a dashboard widget by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Find a widget by ID
   */
  findById(id: string): Promise<DashboardWidget | null>;

  /**
   * Initialize default widgets for a new user
   */
  initializeDefaultWidgets(userId: string): Promise<void>;

  /**
   * Update multiple widgets at once (batch update)
   */
  updateMany(widgets: DashboardWidget[]): Promise<void>;
}
