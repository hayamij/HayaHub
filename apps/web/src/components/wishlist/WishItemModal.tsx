'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { CreateWishItemDTO, WishItemDTO, UpdateWishItemDTO } from 'hayahub-business';
import { Button } from '@/components/ui/Button';

interface WishItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateWishItemDTO | UpdateWishItemDTO) => Promise<boolean>;
  editingWishItem?: WishItemDTO | null;
  userId: string;
}

export function WishItemModal({
  isOpen,
  onClose,
  onSubmit,
  editingWishItem,
  userId,
}: WishItemModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    estimatedPrice: '',
    currency: 'VND',
    priority: '3',
    url: '',
    purchased: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingWishItem) {
      setFormData({
        name: editingWishItem.name,
        description: editingWishItem.description || '',
        estimatedPrice: editingWishItem.estimatedPrice?.toString() || '',
        currency: editingWishItem.currency || 'VND',
        priority: editingWishItem.priority.toString(),
        url: editingWishItem.url || '',
        purchased: editingWishItem.purchased,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        estimatedPrice: '',
        currency: 'VND',
        priority: '3',
        url: '',
        purchased: false,
      });
    }
  }, [editingWishItem, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dto = editingWishItem
        ? ({
            name: formData.name,
            description: formData.description || undefined,
            estimatedPrice: formData.estimatedPrice ? parseFloat(formData.estimatedPrice) : undefined,
            currency: formData.currency,
            priority: parseInt(formData.priority),
            url: formData.url || undefined,
            purchased: formData.purchased,
          } as UpdateWishItemDTO)
        : ({
            userId,
            name: formData.name,
            description: formData.description || undefined,
            estimatedPrice: formData.estimatedPrice ? parseFloat(formData.estimatedPrice) : undefined,
            currency: formData.currency,
            priority: parseInt(formData.priority),
            url: formData.url || undefined,
          } as CreateWishItemDTO);

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
            {editingWishItem ? 'Chỉnh sửa wishlist' : 'Thêm vào wishlist'}
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
              Tên sản phẩm <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
              placeholder="iPhone 15 Pro, MacBook Air,..."
            />
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
              placeholder="Chi tiết về sản phẩm..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Giá dự kiến
              </label>
              <input
                type="number"
                value={formData.estimatedPrice}
                onChange={(e) => setFormData({ ...formData, estimatedPrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                min="0"
                step="1000"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tiền tệ
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

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Độ ưu tiên (1-5)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: priority.toString() })}
                  className={`flex-1 py-2 px-3 rounded-lg border-2 transition ${
                    formData.priority === priority.toString()
                      ? 'border-gray-900 dark:border-gray-100 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  }`}
                >
                  {'⭐'.repeat(priority)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL sản phẩm
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="https://..."
            />
          </div>

          {editingWishItem && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="purchased"
                checked={formData.purchased}
                onChange={(e) => setFormData({ ...formData, purchased: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="purchased" className="text-sm text-gray-700 dark:text-gray-300">
                Đã mua sản phẩm này
              </label>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              {editingWishItem ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
