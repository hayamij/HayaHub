'use client';

import { useState, useCallback, useEffect } from 'react';
import type { SubscriptionDTO } from 'hayahub-business';
import { SubscriptionFrequency, SubscriptionStatus } from 'hayahub-domain';
import type { LayoutPositionData } from 'hayahub-domain';
import { Pencil, Grip } from 'lucide-react';

interface SubscriptionCardProps {
  subscription: SubscriptionDTO;
  onEdit: (subscription: SubscriptionDTO) => void;
  onLayoutChange: (id: string, layout: LayoutPositionData) => void;
}

interface SubscriptionWorkspaceProps {
  subscriptions: SubscriptionDTO[];
  onEdit: (subscription: SubscriptionDTO) => void;
  onLayoutChange: (id: string, layout: LayoutPositionData) => void;
}

const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const FREQUENCY_SHORT: Record<SubscriptionFrequency, string> = {
  [SubscriptionFrequency.DAILY]: '/ngày',
  [SubscriptionFrequency.WEEKLY]: '/tuần',
  [SubscriptionFrequency.MONTHLY]: '/tháng',
  [SubscriptionFrequency.YEARLY]: '/năm',
};

function SubscriptionCard({ subscription, onEdit, onLayoutChange }: SubscriptionCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, w: 0, h: 0 });

  const layout = subscription.layoutPosition || { x: 0, y: 0, w: 300, h: 180 };

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('.resize-handle')) return;
      setIsDragging(true);
      setDragStart({ x: e.clientX - layout.x, y: e.clientY - layout.y });
      e.preventDefault();
    },
    [layout.x, layout.y]
  );

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsResizing(true);
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        w: layout.w,
        h: layout.h,
      });
      e.stopPropagation();
      e.preventDefault();
    },
    [layout.w, layout.h]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, e.clientX - dragStart.x);
        const newY = Math.max(0, e.clientY - dragStart.y);
        onLayoutChange(subscription.id, { x: newX, y: newY, w: layout.w, h: layout.h });
      } else if (isResizing) {
        const deltaW = e.clientX - resizeStart.x;
        const deltaH = e.clientY - resizeStart.y;
        const newW = Math.max(250, resizeStart.w + deltaW);
        const newH = Math.max(150, resizeStart.h + deltaH);
        onLayoutChange(subscription.id, { x: layout.x, y: layout.y, w: newW, h: newH });
      }
    },
    [isDragging, isResizing, dragStart, resizeStart, layout, subscription.id, onLayoutChange]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  // Add event listeners
  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
    return undefined;
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const isActive = subscription.status === SubscriptionStatus.ACTIVE;
  const isPaused = subscription.status === SubscriptionStatus.PAUSED;

  return (
    <div
      className={`absolute bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 overflow-hidden transition-shadow
        ${isActive ? 'border-green-500' : isPaused ? 'border-yellow-500' : 'border-gray-400'}
        ${isDragging || isResizing ? 'shadow-2xl cursor-move' : 'hover:shadow-xl'}
      `}
      style={{
        left: `${layout.x}px`,
        top: `${layout.y}px`,
        width: `${layout.w}px`,
        height: `${layout.h}px`,
      }}
    >
      {/* Header */}
      <div
        className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-3 cursor-move border-b border-gray-200 dark:border-gray-700"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Grip className="w-4 h-4 text-gray-400 flex-shrink-0" />
            {subscription.icon && <span className="text-2xl flex-shrink-0">{subscription.icon}</span>}
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
              {subscription.name}
            </h3>
          </div>
          <button
            onClick={() => onEdit(subscription)}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors flex-shrink-0"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 h-[calc(100%-56px)] flex flex-col">
        <div className="space-y-3 flex-1">
          {/* Amount */}
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formatCurrency(subscription.amount, subscription.currency)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {FREQUENCY_SHORT[subscription.frequency]}
            </div>
          </div>

          {/* Description */}
          {subscription.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {subscription.description}
            </p>
          )}

          {/* Next Billing */}
          <div className="mt-auto">
            <div className="text-xs text-gray-500 dark:text-gray-400">Gia hạn tiếp theo</div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {formatDate(subscription.nextBillingDate)}
            </div>
          </div>
        </div>
      </div>

      {/* Resize Handle */}
      <div
        className="resize-handle absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
        onMouseDown={handleResizeMouseDown}
        style={{
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
        }}
      />
    </div>
  );
}

export function SubscriptionWorkspace({ subscriptions, onEdit, onLayoutChange }: SubscriptionWorkspaceProps) {
  // Calculate workspace dimensions based on subscriptions
  const workspaceHeight = subscriptions.reduce((max, sub) => {
    const layout = sub.layoutPosition || { x: 0, y: 0, w: 300, h: 180 };
    return Math.max(max, layout.y + layout.h + 20);
  }, 800);

  return (
    <div
      className="relative bg-gray-50 dark:bg-gray-950 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 overflow-auto"
      style={{ minHeight: `${workspaceHeight}px` }}
    >
      {subscriptions.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p className="text-lg font-medium mb-2">Workspace trống</p>
            <p className="text-sm">Thêm subscription mới để bắt đầu</p>
          </div>
        </div>
      ) : (
        subscriptions.map((sub) => (
          <SubscriptionCard
            key={sub.id}
            subscription={sub}
            onEdit={onEdit}
            onLayoutChange={onLayoutChange}
          />
        ))
      )}
    </div>
  );
}
