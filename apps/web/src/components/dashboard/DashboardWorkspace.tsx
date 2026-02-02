'use client';

import { useState } from 'react';
import type { DashboardWidgetDTO } from 'hayahub-business';
import type { LayoutPositionData } from 'hayahub-domain';
import { WidgetType } from 'hayahub-domain';
import { GripVertical, Eye, EyeOff, Settings, Grid } from 'lucide-react';
import SpendingWidgetContent from './SpendingWidgetContent';
import CalendarWidgetContent from './CalendarWidgetContent';
import ProjectsWidgetContent from './ProjectsWidgetContent';
import WishlistWidgetContent from './WishlistWidgetContent';
import QuoteWidgetContent from './QuoteWidgetContent';
import SubscriptionsWidgetContent from './SubscriptionsWidgetContent';
import { WidgetConfigModal } from './WidgetConfigModal';

interface DashboardWorkspaceProps {
  widgets: DashboardWidgetDTO[];
  onLayoutChange: (id: string, layout: LayoutPositionData) => void | Promise<void>;
  onToggleVisibility: (id: string, visible: boolean) => void;
  onBatchLayoutChange: (updates: Array<{ id: string; layout: LayoutPositionData }>) => Promise<void>;
  userId: string;
}

const WIDGET_LABELS: Record<WidgetType, string> = {
  [WidgetType.SPENDING]: 'Chi tiêu',
  [WidgetType.CALENDAR]: 'Lịch',
  [WidgetType.PROJECTS]: 'Dự án',
  [WidgetType.WISHLIST]: 'Wishlist',
  [WidgetType.QUOTE]: 'Quote',
  [WidgetType.SUBSCRIPTIONS]: 'Đăng ký',
};

export function DashboardWorkspace({
  widgets,
  onLayoutChange,
  onToggleVisibility,
  onBatchLayoutChange,
  userId,
}: DashboardWorkspaceProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [resizingId, setResizingId] = useState<string | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [isArranging, setIsArranging] = useState(false);

  const handleDragStart = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const header = e.currentTarget as HTMLElement;
    const widgetElement = header.parentElement as HTMLElement;
    
    if (!widgetElement) return;

    const rect = widgetElement.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setDraggingId(id);

    const handleMove = (moveEvent: MouseEvent) => {
      const container = document.getElementById('dashboard-workspace-container');
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const newX = moveEvent.clientX - containerRect.left - offsetX;
      const newY = moveEvent.clientY - containerRect.top - offsetY;

      const maxX = containerRect.width - rect.width;
      const maxY = containerRect.height - rect.height;

      widgetElement.style.left = `${Math.max(0, Math.min(newX, maxX))}px`;
      widgetElement.style.top = `${Math.max(0, Math.min(newY, maxY))}px`;
    };

    const handleUp = () => {
      setDraggingId(null);
      
      const widget = widgets.find((w) => w.id === id);
      if (widget) {
        const finalRect = widgetElement.getBoundingClientRect();
        const container = document.getElementById('dashboard-workspace-container');
        if (container) {
          const containerRect = container.getBoundingClientRect();
          onLayoutChange(id, {
            x: finalRect.left - containerRect.left,
            y: finalRect.top - containerRect.top,
            w: finalRect.width,
            h: finalRect.height,
          });
        }
      }

      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  };

  const handleResizeStart = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const resizeHandle = e.currentTarget as HTMLElement;
    const widgetElement = resizeHandle.parentElement as HTMLElement;
    
    if (!widgetElement) return;

    const startWidth = widgetElement.offsetWidth;
    const startHeight = widgetElement.offsetHeight;
    const startX = e.clientX;
    const startY = e.clientY;

    setResizingId(id);

    const handleMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      const newWidth = startWidth + deltaX;
      const newHeight = startHeight + deltaY;

      widgetElement.style.width = `${Math.max(280, newWidth)}px`;
      widgetElement.style.height = `${Math.max(200, newHeight)}px`;
    };

    const handleUp = () => {
      setResizingId(null);

      const widget = widgets.find((w) => w.id === id);
      if (widget) {
        const finalRect = widgetElement.getBoundingClientRect();
        const container = document.getElementById('dashboard-workspace-container');
        if (container) {
          const containerRect = container.getBoundingClientRect();
          onLayoutChange(id, {
            x: finalRect.left - containerRect.left,
            y: finalRect.top - containerRect.top,
            w: finalRect.width,
            h: finalRect.height,
          });
        }
      }

      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  };

  const handleAutoArrange = async () => {
    setIsArranging(true);
    const visibleWidgets = widgets.filter((w) => w.isVisible);
    const gap = 5;
    const startX = 20;
    const startY = 60;

    // Grid layout with 3 columns
    const maxColumns = 3;
    
    // Track height and max width of each column
    const columnHeights: number[] = Array(maxColumns).fill(startY);
    const columnWidths: number[] = Array(maxColumns).fill(0);
    const columnXPositions: number[] = Array(maxColumns).fill(0);

    // First pass: calculate max width for each column and X positions
    visibleWidgets.forEach((widget, index) => {
      const currentLayout = widget.layoutPosition || { x: 0, y: 0, w: 380, h: 300 };
      const col = index % maxColumns;
      
      // Track max width in this column
      columnWidths[col] = Math.max(columnWidths[col], currentLayout.w);
    });

    // Calculate X position for each column based on actual widths
    columnXPositions[0] = startX;
    for (let i = 1; i < maxColumns; i++) {
      columnXPositions[i] = columnXPositions[i - 1] + columnWidths[i - 1] + gap;
    }

    // Second pass: place widgets and collect all updates for batch save
    const updates: Array<{ id: string; layout: LayoutPositionData }> = [];

    visibleWidgets.forEach((widget, index) => {
      const currentLayout = widget.layoutPosition || { x: 0, y: 0, w: 380, h: 300 };
      const col = index % maxColumns;
      
      // Get X position from pre-calculated column positions
      const x = columnXPositions[col];
      
      // Get Y position from column height
      const y = columnHeights[col];
      
      // Update column height for next widget in this column
      columnHeights[col] += currentLayout.h + gap;

      // Collect update for batch save
      updates.push({
        id: widget.id,
        layout: {
          x,
          y,
          w: currentLayout.w,
          h: currentLayout.h,
        },
      });
    });

    // Batch update all widget positions in one call
    try {
      await onBatchLayoutChange(updates);
    } catch (error) {
      console.error('Failed to save auto-arrange:', error);
    } finally {
      setIsArranging(false);
    }
  };

  const renderWidgetContent = (widget: DashboardWidgetDTO) => {
    switch (widget.type) {
      case WidgetType.SPENDING:
        return <SpendingWidgetContent userId={userId} />;
      case WidgetType.CALENDAR:
        return <CalendarWidgetContent />;
      case WidgetType.PROJECTS:
        return <ProjectsWidgetContent />;
      case WidgetType.WISHLIST:
        return <WishlistWidgetContent />;
      case WidgetType.QUOTE:
        return <QuoteWidgetContent />;
      case WidgetType.SUBSCRIPTIONS:
        return <SubscriptionsWidgetContent />;
      default:
        return <div>Unknown widget type</div>;
    }
  };

  const visibleWidgets = widgets.filter((w) => w.isVisible);

  if (visibleWidgets.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <Eye className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
        <p className="text-gray-500 dark:text-gray-400">Không có widget nào hiển thị</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Nhấn vào biểu tượng cài đặt để hiển thị widgets
        </p>
      </div>
    );
  }

  return (
    <div
      id="dashboard-workspace-container"
      className="relative min-h-[1200px] bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 overflow-auto"
    >
      {/* Floating action buttons */}
      <div className="absolute top-4 right-4 z-40 flex gap-2">
        <button
          onClick={handleAutoArrange}
          disabled={isArranging}
          className="p-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg hover:shadow-xl transition text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title={isArranging ? 'Đang sắp xếp...' : 'Tự động sắp xếp'}
        >
          {isArranging ? (
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Grid className="w-5 h-5" />
          )}
        </button>
        <button
          onClick={() => setShowConfigModal(true)}
          className="p-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg hover:shadow-xl transition text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          title="Cấu hình widgets"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {visibleWidgets.map((widget) => {
        const layout = widget.layoutPosition || { x: 0, y: 0, w: 350, h: 300 };
        const isDragging = draggingId === widget.id;
        const isResizing = resizingId === widget.id;

        return (
          <div
            key={widget.id}
            className={`absolute select-none transition-shadow bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg hover:shadow-xl ${
              isDragging || isResizing ? 'shadow-2xl z-50' : 'z-0'
            }`}
            style={{
              left: `${layout.x}px`,
              top: `${layout.y}px`,
              width: `${layout.w}px`,
              height: `${layout.h}px`,
            }}
          >
            {/* Header with drag handle */}
            <div
              className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 cursor-move bg-gray-50 dark:bg-gray-800/50"
              onMouseDown={(e) => handleDragStart(widget.id, e)}
            >
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  {WIDGET_LABELS[widget.type]}
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisibility(widget.id, false);
                  }}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition"
                  title="Ẩn widget"
                >
                  <EyeOff className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 overflow-auto" style={{ height: 'calc(100% - 48px)' }}>
              {renderWidgetContent(widget)}
            </div>

            {/* Resize handle */}
            <div
              className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
              onMouseDown={(e) => handleResizeStart(widget.id, e)}
              style={{
                background: 'linear-gradient(135deg, transparent 50%, #9ca3af 50%)',
              }}
            />
          </div>
        );
      })}

      {/* Widget config modal */}
      {showConfigModal && (
        <WidgetConfigModal
          widgets={widgets}
          onToggleVisibility={onToggleVisibility}
          onClose={() => setShowConfigModal(false)}
        />
      )}
    </div>
  );
}
