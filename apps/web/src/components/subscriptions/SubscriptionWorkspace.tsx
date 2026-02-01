'use client';

import { useState } from 'react';
import type { SubscriptionDTO } from 'hayahub-business';
import { SubscriptionFrequency, SubscriptionStatus } from 'hayahub-domain';
import { Edit2, Pause, Play, Trash2, Calendar, GripVertical } from 'lucide-react';
import type { LayoutPositionData } from 'hayahub-domain';

interface SubscriptionWorkspaceProps {
  subscriptions: SubscriptionDTO[];
  onEdit: (subscription: SubscriptionDTO) => void;
  onDelete: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onLayoutChange: (id: string, layout: LayoutPositionData) => void;
  formatCurrency: (amount: number, currency: string) => string;
}

const STATUS_COLORS: Record<SubscriptionStatus, string> = {
  [SubscriptionStatus.ACTIVE]: 'border-green-500 bg-green-50 dark:bg-green-900/20',
  [SubscriptionStatus.PAUSED]: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
  [SubscriptionStatus.CANCELLED]: 'border-gray-500 bg-gray-50 dark:bg-gray-800',
};

export function SubscriptionWorkspace({
  subscriptions,
  onEdit,
  onDelete,
  onPause,
  onResume,
  onLayoutChange,
  formatCurrency,
}: SubscriptionWorkspaceProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [resizingId, setResizingId] = useState<string | null>(null);

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
        <p className="text-gray-500 dark:text-gray-400">Chưa có subscription nào</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Thêm subscription đầu tiên để bắt đầu theo dõi
        </p>
      </div>
    );
  }

  const handleDragStart = (id: string, e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setDraggingId(id);

    const handleMove = (moveEvent: MouseEvent) => {
      const container = document.getElementById('workspace-container');
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const newX = moveEvent.clientX - containerRect.left - offsetX;
      const newY = moveEvent.clientY - containerRect.top - offsetY;

      target.style.left = `${Math.max(0, Math.min(newX, containerRect.width - rect.width))}px`;
      target.style.top = `${Math.max(0, Math.min(newY, containerRect.height - rect.height))}px`;
    };

    const handleUp = () => {
      setDraggingId(null);
      
      const subscription = subscriptions.find((s) => s.id === id);
      if (subscription) {
        const rect = target.getBoundingClientRect();
        const container = document.getElementById('workspace-container');
        if (container) {
          const containerRect = container.getBoundingClientRect();
          onLayoutChange(id, {
            x: rect.left - containerRect.left,
            y: rect.top - containerRect.top,
            w: rect.width,
            h: rect.height,
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
    e.stopPropagation();
    const target = e.currentTarget.parentElement as HTMLElement;
    const startWidth = target.offsetWidth;
    const startHeight = target.offsetHeight;
    const startX = e.clientX;
    const startY = e.clientY;

    setResizingId(id);

    const handleMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      const newHeight = startHeight + (moveEvent.clientY - startY);

      target.style.width = `${Math.max(200, newWidth)}px`;
      target.style.height = `${Math.max(150, newHeight)}px`;
    };

    const handleUp = () => {
      setResizingId(null);

      const subscription = subscriptions.find((s) => s.id === id);
      if (subscription) {
        const rect = target.getBoundingClientRect();
        const container = document.getElementById('workspace-container');
        if (container) {
          const containerRect = container.getBoundingClientRect();
          onLayoutChange(id, {
            x: rect.left - containerRect.left,
            y: rect.top - containerRect.top,
            w: rect.width,
            h: rect.height,
          });
        }
      }

      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  };

  return (
    <div
      id="workspace-container"
      className="relative min-h-[600px] bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 overflow-hidden"
    >
      {subscriptions.map((sub) => {
        const layout = sub.layoutPosition || { x: 0, y: 0, w: 280, h: 180 };
        const isDragging = draggingId === sub.id;
        const isResizing = resizingId === sub.id;

        return (
          <div
            key={sub.id}
            className={`absolute cursor-move select-none transition-shadow ${
              STATUS_COLORS[sub.status]
            } border-2 rounded-lg p-4 shadow-lg hover:shadow-xl ${
              isDragging || isResizing ? 'shadow-2xl z-50' : 'z-0'
            }`}
            style={{
              left: `${layout.x}px`,
              top: `${layout.y}px`,
              width: `${layout.w}px`,
              height: `${layout.h}px`,
            }}
            onMouseDown={(e) => handleDragStart(sub.id, e)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3 cursor-move">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
                {sub.icon && <span className="text-2xl flex-shrink-0">{sub.icon}</span>}
                <h3 className="font-bold text-gray-900 dark:text-white truncate">{sub.name}</h3>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(sub);
                  }}
                  className="p-1 hover:bg-white/50 dark:hover:bg-gray-700 rounded transition"
                  title="Chỉnh sửa"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                {sub.status === SubscriptionStatus.ACTIVE ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPause(sub.id);
                    }}
                    className="p-1 hover:bg-white/50 dark:hover:bg-gray-700 rounded transition"
                    title="Tạm dừng"
                  >
                    <Pause className="w-4 h-4" />
                  </button>
                ) : sub.status === SubscriptionStatus.PAUSED ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onResume(sub.id);
                    }}
                    className="p-1 hover:bg-white/50 dark:hover:bg-gray-700 rounded transition"
                    title="Tiếp tục"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                ) : null}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(sub.id);
                  }}
                  className="p-1 hover:bg-white/50 dark:hover:bg-gray-700 rounded transition"
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2 text-sm pointer-events-none">
              <div className="font-bold text-lg text-gray-900 dark:text-white">
                {formatCurrency(sub.amount, sub.currency)}
              </div>
              {sub.description && (
                <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2">
                  {sub.description}
                </p>
              )}
              <div className="text-gray-500 dark:text-gray-500 text-xs">
                <div>Chu kỳ: {
                  sub.frequency === SubscriptionFrequency.DAILY ? 'Hàng ngày' :
                  sub.frequency === SubscriptionFrequency.WEEKLY ? 'Hàng tuần' :
                  sub.frequency === SubscriptionFrequency.MONTHLY ? 'Hàng tháng' : 'Hàng năm'
                }</div>
                <div>Kế tiếp: {new Date(sub.nextBillingDate).toLocaleDateString('vi-VN')}</div>
              </div>
            </div>

            {/* Resize handle */}
            <div
              className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize pointer-events-auto"
              onMouseDown={(e) => handleResizeStart(sub.id, e)}
            >
              <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-gray-400 dark:border-gray-600" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
