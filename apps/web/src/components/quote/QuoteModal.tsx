'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { CreateQuoteDTO, QuoteDTO, UpdateQuoteDTO } from 'hayahub-business';

// Import QuoteCategory from domain entity file
enum QuoteCategory {
  MOTIVATION = 'MOTIVATION',
  WISDOM = 'WISDOM',
  INSPIRATION = 'INSPIRATION',
  HUMOR = 'HUMOR',
  LIFE = 'LIFE',
  SUCCESS = 'SUCCESS',
  OTHER = 'OTHER',
}

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateQuoteDTO | UpdateQuoteDTO) => Promise<boolean>;
  editingQuote?: QuoteDTO | null;
  userId: string;
}

const CATEGORY_LABELS: Record<QuoteCategory, string> = {
  [QuoteCategory.MOTIVATION]: 'Động lực',
  [QuoteCategory.WISDOM]: 'Trí tuệ',
  [QuoteCategory.INSPIRATION]: 'Cảm hứng',
  [QuoteCategory.HUMOR]: 'Hài hước',
  [QuoteCategory.LIFE]: 'Cuộc sống',
  [QuoteCategory.SUCCESS]: 'Thành công',
  [QuoteCategory.OTHER]: 'Khác',
};

export function QuoteModal({
  isOpen,
  onClose,
  onSubmit,
  editingQuote,
  userId,
}: QuoteModalProps) {
  const [formData, setFormData] = useState({
    text: '',
    author: '',
    category: QuoteCategory.OTHER,
    tags: '',
    isFavorite: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingQuote) {
      setFormData({
        text: editingQuote.text,
        author: editingQuote.author,
        category: editingQuote.category as QuoteCategory,
        tags: editingQuote.tags?.join(', ') || '',
        isFavorite: editingQuote.isFavorite,
      });
    } else {
      setFormData({
        text: '',
        author: '',
        category: QuoteCategory.OTHER,
        tags: '',
        isFavorite: false,
      });
    }
  }, [editingQuote, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const tags = formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const dto = editingQuote
        ? ({
            text: formData.text,
            author: formData.author,
            category: formData.category,
            isFavorite: formData.isFavorite,
          } as UpdateQuoteDTO)
        : ({
            userId,
            text: formData.text,
            author: formData.author,
            category: formData.category,
            tags: tags.length > 0 ? tags : undefined,
          } as CreateQuoteDTO);

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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {editingQuote ? 'Chỉnh sửa quote' : 'Thêm quote mới'}
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
              Nội dung quote <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              rows={4}
              required
              placeholder="Nhập nội dung quote..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tác giả <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
              placeholder="Steve Jobs, Albert Einstein,..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Danh mục <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as QuoteCategory })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            >
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {!editingQuote && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags (phân cách bằng dấu phẩy)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="motivation, leadership, innovation"
              />
            </div>
          )}

          {editingQuote && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isFavorite"
                checked={formData.isFavorite}
                onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isFavorite" className="text-sm text-gray-700 dark:text-gray-300">
                Đánh dấu là yêu thích
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
              {editingQuote ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
