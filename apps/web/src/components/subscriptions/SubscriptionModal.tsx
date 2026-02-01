'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { CreateSubscriptionDTO, SubscriptionDTO, UpdateSubscriptionDTO } from 'hayahub-business';
import { SubscriptionFrequency } from 'hayahub-domain';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateSubscriptionDTO | UpdateSubscriptionDTO) => Promise<boolean>;
  editingSubscription?: SubscriptionDTO | null;
  userId: string;
}

export function SubscriptionModal({
  isOpen,
  onClose,
  onSubmit,
  editingSubscription,
  userId,
}: SubscriptionModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    currency: 'VND',
    frequency: SubscriptionFrequency.MONTHLY as SubscriptionFrequency,
    startDate: new Date().toISOString().split('T')[0],
    description: '',
    icon: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingSubscription) {
      setFormData({
        name: editingSubscription.name,
        amount: editingSubscription.amount.toString(),
        currency: editingSubscription.currency,
        frequency: editingSubscription.frequency,
        startDate: new Date(editingSubscription.startDate).toISOString().split('T')[0],
        description: editingSubscription.description || '',
        icon: editingSubscription.icon || '',
      });
    } else {
      setFormData({
        name: '',
        amount: '',
        currency: 'VND',
        frequency: SubscriptionFrequency.MONTHLY,
        startDate: new Date().toISOString().split('T')[0],
        description: '',
        icon: '',
      });
    }
  }, [editingSubscription, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dto = editingSubscription
        ? ({
            name: formData.name,
            amount: parseFloat(formData.amount),
            currency: formData.currency,
            frequency: formData.frequency,
            description: formData.description || undefined,
            icon: formData.icon || undefined,
          } as UpdateSubscriptionDTO)
        : ({
            userId,
            name: formData.name,
            amount: parseFloat(formData.amount),
            currency: formData.currency,
            frequency: formData.frequency,
            startDate: new Date(formData.startDate),
            description: formData.description || undefined,
            icon: formData.icon || undefined,
          } as CreateSubscriptionDTO);

      const success = await onSubmit(dto);
      if (success) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {editingSubscription ? 'Chỉnh sửa Subscription' : 'Thêm Subscription Mới'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
              placeholder="Netflix, Spotify,..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Icon (Emoji)
            </label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="📺 🎵 ☁️..."
              maxLength={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Số tiền <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Đơn vị
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="VND">VND</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Chu kỳ <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.frequency}
                onChange={(e) =>
                  setFormData({ ...formData, frequency: e.target.value as SubscriptionFrequency })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value={SubscriptionFrequency.DAILY}>Hàng ngày</option>
                <option value={SubscriptionFrequency.WEEKLY}>Hàng tuần</option>
                <option value={SubscriptionFrequency.MONTHLY}>Hàng tháng</option>
                <option value={SubscriptionFrequency.YEARLY}>Hàng năm</option>
              </select>
            </div>
            {!editingSubscription && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ngày bắt đầu
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              rows={3}
              placeholder="Gói Premium, Gia đình,..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang xử lý...' : editingSubscription ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
