'use client';

import type { SubscriptionDTO } from 'hayahub-business';
import { SubscriptionFrequency, SubscriptionStatus } from 'hayahub-domain';
import { Pencil, Trash2, Play, Pause, Ban } from 'lucide-react';

interface SubscriptionTableProps {
  subscriptions: SubscriptionDTO[];
  onEdit: (subscription: SubscriptionDTO) => void;
  onDelete: (id: string) => void;
}

const FREQUENCY_LABELS: Record<SubscriptionFrequency, string> = {
  [SubscriptionFrequency.DAILY]: 'Hàng ngày',
  [SubscriptionFrequency.WEEKLY]: 'Hàng tuần',
  [SubscriptionFrequency.MONTHLY]: 'Hàng tháng',
  [SubscriptionFrequency.YEARLY]: 'Hàng năm',
};

const STATUS_LABELS: Record<SubscriptionStatus, string> = {
  [SubscriptionStatus.ACTIVE]: 'Hoạt động',
  [SubscriptionStatus.PAUSED]: 'Tạm dừng',
  [SubscriptionStatus.CANCELLED]: 'Đã hủy',
};

const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const getStatusColor = (status: SubscriptionStatus): string => {
  switch (status) {
    case SubscriptionStatus.ACTIVE:
      return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
    case SubscriptionStatus.PAUSED:
      return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
    case SubscriptionStatus.CANCELLED:
      return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
  }
};

const getStatusIcon = (status: SubscriptionStatus) => {
  switch (status) {
    case SubscriptionStatus.ACTIVE:
      return <Play className="w-3 h-3" />;
    case SubscriptionStatus.PAUSED:
      return <Pause className="w-3 h-3" />;
    case SubscriptionStatus.CANCELLED:
      return <Ban className="w-3 h-3" />;
  }
};

export function SubscriptionTable({ subscriptions, onEdit, onDelete }: SubscriptionTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-gray-200 dark:border-gray-800">
          <tr className="text-left">
            <th className="py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Tên</th>
            <th className="py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Số tiền</th>
            <th className="py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Tần suất</th>
            <th className="py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Ngày gia hạn</th>
            <th className="py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Trạng thái</th>
            <th className="py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-8 text-center text-gray-500 dark:text-gray-400">
                Chưa có subscription nào
              </td>
            </tr>
          ) : (
            subscriptions.map((sub) => (
              <tr
                key={sub.id}
                className="border-b border-gray-100 dark:border-gray-900 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {sub.icon && <span className="text-xl">{sub.icon}</span>}
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{sub.name}</div>
                      {sub.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {sub.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                  {formatCurrency(sub.amount, sub.currency)}
                </td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                  {FREQUENCY_LABELS[sub.frequency]}
                </td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                  {formatDate(sub.nextBillingDate)}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      sub.status
                    )}`}
                  >
                    {getStatusIcon(sub.status)}
                    {STATUS_LABELS[sub.status]}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(sub)}
                      className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(sub.id)}
                      className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
