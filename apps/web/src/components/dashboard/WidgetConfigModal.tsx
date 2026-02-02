'use client';

import { Eye, EyeOff } from 'lucide-react';
import type { DashboardWidgetDTO } from 'hayahub-business';
import { WidgetType } from 'hayahub-domain';

interface WidgetConfigModalProps {
  widgets: DashboardWidgetDTO[];
  onToggleVisibility: (id: string, visible: boolean) => void;
  onClose: () => void;
}

const WIDGET_LABELS: Record<WidgetType, string> = {
  [WidgetType.SPENDING]: 'Chi tiêu',
  [WidgetType.CALENDAR]: 'Lịch',
  [WidgetType.PROJECTS]: 'Dự án',
  [WidgetType.WISHLIST]: 'Wishlist',
  [WidgetType.QUOTE]: 'Quote',
  [WidgetType.SUBSCRIPTIONS]: 'Đăng ký',
};

export function WidgetConfigModal({ widgets, onToggleVisibility, onClose }: WidgetConfigModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cấu hình Widgets</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2">
          {widgets.map((widget) => (
            <div
              key={widget.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {WIDGET_LABELS[widget.type]}
              </span>
              <button
                onClick={() => onToggleVisibility(widget.id, !widget.isVisible)}
                className={`p-2 rounded-lg transition ${
                  widget.isVisible
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-500'
                }`}
                title={widget.isVisible ? 'Ẩn widget' : 'Hiện widget'}
              >
                {widget.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:opacity-90 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
