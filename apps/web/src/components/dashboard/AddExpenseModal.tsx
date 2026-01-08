'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { ExpenseCategory } from 'hayahub-domain';
import { Container } from '@/infrastructure/di/Container';
import type { CreateExpenseDTO } from 'hayahub-business';
import { useToast } from '@/contexts/ToastContext';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSuccess: () => void;
}

const CATEGORIES = [
  { value: ExpenseCategory.FOOD, label: 'Ăn uống' },
  { value: ExpenseCategory.TRANSPORT, label: 'Di chuyển' },
  { value: ExpenseCategory.SHOPPING, label: 'Mua sắm' },
  { value: ExpenseCategory.ENTERTAINMENT, label: 'Giải trí' },
  { value: ExpenseCategory.UTILITIES, label: 'Tiện ích' },
  { value: ExpenseCategory.HEALTHCARE, label: 'Y tế' },
  { value: ExpenseCategory.EDUCATION, label: 'Giáo dục' },
  { value: ExpenseCategory.HOUSING, label: 'Nhà ở' },
  { value: ExpenseCategory.INSURANCE, label: 'Bảo hiểm' },
  { value: ExpenseCategory.SAVINGS, label: 'Tiết kiệm' },
  { value: ExpenseCategory.BILLS, label: 'Hóa đơn' },
  { value: ExpenseCategory.TRAVEL, label: 'Du lịch' },
  { value: ExpenseCategory.OTHER, label: 'Khác' },
];

export function AddExpenseModal({ isOpen, onClose, userId, onSuccess }: AddExpenseModalProps) {
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Get current date in Vietnam timezone (UTC+7)
  const getVietnamDate = () => {
    const now = new Date();
    // Convert to Vietnam timezone using Asia/Ho_Chi_Minh
    const vietnamTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
    const year = vietnamTime.getFullYear();
    const month = String(vietnamTime.getMonth() + 1).padStart(2, '0');
    const day = String(vietnamTime.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: ExpenseCategory.OTHER,
    date: getVietnamDate(),
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const container = Container.getInstance();
      const createExpenseUseCase = container.createExpenseUseCase;

      const dto: CreateExpenseDTO = {
        userId,
        description: formData.description,
        amount: parseFloat(formData.amount),
        currency: 'VND',
        category: formData.category,
        date: new Date(formData.date),
        tags: [],
      };

      const result = await createExpenseUseCase.execute(dto);

      if (result.isSuccess()) {
        // Reset form
        setFormData({
          description: '',
          amount: '',
          category: ExpenseCategory.OTHER,
          date: getVietnamDate(),
        });
        
        // Show success toast immediately
        showSuccess('Đã thêm chi tiêu thành công!');
        
        // Close modal and refresh
        onClose();
        onSuccess();
      } else {
        setError(result.error.message);
        showError(`Thất bại: ${result.error.message}`);
      }
    } catch (err) {
      const errorMessage = 'Có lỗi xảy ra khi thêm chi tiêu';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Thêm chi tiêu
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mô tả
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
              placeholder="Ví dụ: Ăn trưa"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Số tiền (VND)
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
              placeholder="50000"
              required
              min="0"
              step="1000"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Danh mục
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ngày
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang lưu...' : 'Thêm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
