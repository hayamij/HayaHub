'use client';

import type { SubscriptionDTO } from 'hayahub-business';
import { SubscriptionFrequency, SubscriptionStatus } from 'hayahub-domain';
import { Calendar, Edit2, Pause, Play, Trash2 } from 'lucide-react';

interface SubscriptionTableProps {
  subscriptions: SubscriptionDTO[];
  onEdit: (subscription: SubscriptionDTO) => void;
  onDelete: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  formatCurrency: (amount: number, currency: string) => string;
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

const STATUS_COLORS: Record<SubscriptionStatus, string> = {
  [SubscriptionStatus.ACTIVE]: 'bg-gray-300 text-gray-900 dark:bg-gray-600 dark:text-gray-100',
  [SubscriptionStatus.PAUSED]: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  [SubscriptionStatus.CANCELLED]: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

export function SubscriptionTable({
  subscriptions,
  onEdit,
  onDelete,
  onPause,
  onResume,
  formatCurrency,
}: SubscriptionTableProps) {
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

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Tên
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Số tiền
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Chu kỳ
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Ngày thanh toán kế
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {subscriptions.map((sub) => (
            <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  {sub.icon && (
                    <span className="text-2xl" aria-label="icon">
                      {sub.icon}
                    </span>
                  )}
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{sub.name}</div>
                    {sub.description && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">{sub.description}</div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 text-gray-900 dark:text-white font-medium">
                {formatCurrency(sub.amount, sub.currency)}
              </td>
              <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                {FREQUENCY_LABELS[sub.frequency]}
              </td>
              <td className="px-4 py-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS[sub.status]}`}>
                  {STATUS_LABELS[sub.status]}
                </span>
              </td>
              <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                {new Date(sub.nextBillingDate).toLocaleDateString('vi-VN')}
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(sub)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
                    title="Chỉnh sửa"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {sub.status === SubscriptionStatus.ACTIVE ? (
                    <button
                      onClick={() => onPause(sub.id)}
                      className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
                      title="Tạm dừng"
                    >
                      <Pause className="w-4 h-4" />
                    </button>
                  ) : sub.status === SubscriptionStatus.PAUSED ? (
                    <button
                      onClick={() => onResume(sub.id)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
                      title="Tiếp tục"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  ) : null}
                  <button
                    onClick={() => onDelete(sub.id)}
                    className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
