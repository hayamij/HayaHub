import type { IDashboardWidgetRepository } from 'hayahub-business';
import type { DashboardWidget } from 'hayahub-domain';
import { DashboardWidget as DashboardWidgetDomain, LayoutPosition, WidgetType } from 'hayahub-domain';
import type { IStorageService } from 'hayahub-business';
import type { LayoutPositionData } from 'hayahub-domain';

const STORAGE_KEY = 'hayahub_dashboard_widgets';

interface DashboardWidgetStorage {
  id: string;
  userId: string;
  type: WidgetType;
  isVisible: boolean;
  layoutPosition: LayoutPositionData | null;
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_WIDGET_LAYOUTS: Record<WidgetType, LayoutPositionData> = {
  [WidgetType.SPENDING]: { x: 20, y: 20, w: 400, h: 280 },
  [WidgetType.CALENDAR]: { x: 440, y: 20, w: 380, h: 320 },
  [WidgetType.PROJECTS]: { x: 20, y: 320, w: 380, h: 300 },
  [WidgetType.WISHLIST]: { x: 840, y: 20, w: 360, h: 320 },
  [WidgetType.QUOTE]: { x: 420, y: 360, w: 380, h: 260 },
  [WidgetType.SUBSCRIPTIONS]: { x: 820, y: 360, w: 380, h: 260 },
};

export class DashboardWidgetRepositoryAdapter implements IDashboardWidgetRepository {
  constructor(private readonly storage: IStorageService) {}

  async findByUserId(userId: string): Promise<DashboardWidget[]> {
    const widgets = await this.loadAll();
    return widgets.filter((w) => w.userId === userId).map(this.toDomain);
  }

  async findById(id: string): Promise<DashboardWidget | null> {
    const widgets = await this.loadAll();
    const widget = widgets.find((w) => w.id === id);
    return widget ? this.toDomain(widget) : null;
  }

  async save(widget: DashboardWidget): Promise<void> {
    const widgets = await this.loadAll();
    const index = widgets.findIndex((w) => w.id === widget.getId());

    if (index !== -1) {
      widgets[index] = this.toStorage(widget);
    } else {
      widgets.push(this.toStorage(widget));
    }

    await this.storage.set(STORAGE_KEY, widgets);
  }

  async update(widget: DashboardWidget): Promise<void> {
    const widgets = await this.loadAll();
    const index = widgets.findIndex((w) => w.id === widget.getId());
    
    if (index !== -1) {
      widgets[index] = this.toStorage(widget);
      await this.storage.set(STORAGE_KEY, widgets);
    }
  }

  async delete(id: string): Promise<void> {
    const widgets = await this.loadAll();
    const filtered = widgets.filter((w) => w.id !== id);
    await this.storage.set(STORAGE_KEY, filtered);
  }

  async initializeDefaultWidgets(userId: string): Promise<void> {
    const widgets: DashboardWidgetStorage[] = Object.values(WidgetType).map((type, index) => ({
      id: `${userId}-widget-${type}-${Date.now()}-${index}`,
      userId,
      type,
      isVisible: true,
      layoutPosition: DEFAULT_WIDGET_LAYOUTS[type],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    const existing = await this.loadAll();
    const updated = [...existing, ...widgets];
    await this.storage.set(STORAGE_KEY, updated);
  }

  async updateMany(widgets: DashboardWidget[]): Promise<void> {
    const allWidgets = await this.loadAll();
    
    // Update each widget in the array
    widgets.forEach((widget) => {
      const index = allWidgets.findIndex((w) => w.id === widget.getId());
      if (index !== -1) {
        allWidgets[index] = this.toStorage(widget);
      }
    });

    // Single write operation
    await this.storage.set(STORAGE_KEY, allWidgets);
  }

  private async loadAll(): Promise<DashboardWidgetStorage[]> {
    const data = (await this.storage.get<DashboardWidgetStorage[]>(STORAGE_KEY)) || [];
    
    // Deduplicate by ID (keep last occurrence)
    const uniqueMap = new Map<string, DashboardWidgetStorage>();
    data.forEach((widget) => {
      uniqueMap.set(widget.id, widget);
    });
    
    const deduplicated = Array.from(uniqueMap.values());
    
    // If we removed duplicates, save the cleaned data
    if (deduplicated.length !== data.length) {
      await this.storage.set(STORAGE_KEY, deduplicated);
    }
    
    return deduplicated;
  }

  private toStorage(widget: DashboardWidget): DashboardWidgetStorage {
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
      createdAt: widget.getCreatedAt().toISOString(),
      updatedAt: widget.getUpdatedAt().toISOString(),
    };
  }

  private toDomain(storage: DashboardWidgetStorage): DashboardWidget {
    return DashboardWidgetDomain.fromProps({
      id: storage.id,
      userId: storage.userId,
      type: storage.type,
      isVisible: storage.isVisible,
      layoutPosition: storage.layoutPosition ? LayoutPosition.fromData(storage.layoutPosition) : null,
      createdAt: new Date(storage.createdAt),
      updatedAt: new Date(storage.updatedAt),
    });
  }
}
