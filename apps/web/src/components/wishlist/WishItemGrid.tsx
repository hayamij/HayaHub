'use client';

import type { WishItemDTO } from 'hayahub-business';
import { Edit2, Trash2, ExternalLink, ShoppingBag, Star } from 'lucide-react';

interface WishItemGridProps {
  wishItems: WishItemDTO[];
  onEdit: (wishItem: WishItemDTO) => void;
  onDelete: (id: string) => void;
  onTogglePurchased: (id: string, purchased: boolean) => void;
  formatCurrency: (amount: number, currency: string) => string;
}

export function WishItemGrid({
  wishItems,
  onEdit,
  onDelete,
  onTogglePurchased,
  formatCurrency,
}: WishItemGridProps) {
  if (wishItems.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
        <p className="text-gray-500 dark:text-gray-400">Chưa có sản phẩm nào trong wishlist</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Thêm sản phẩm yêu thích để theo dõi
        </p>
      </div>
    );
  }

  const renderStars = (priority: number) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < priority
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {wishItems.map((item) => (
        <div
          key={item.id}
          className={`bg-white dark:bg-gray-800 rounded-lg border-2 shadow-sm hover:shadow-md transition ${
            item.purchased
              ? 'border-green-200 dark:border-green-800 opacity-75'
              : 'border-gray-200 dark:border-gray-700'
          }`}
        >
          {/* Header with purchased status */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between gap-2">
              <h3 className={`font-semibold text-gray-900 dark:text-white flex-1 ${
                item.purchased ? 'line-through' : ''
              }`}>
                {item.name}
              </h3>
              <button
                onClick={() => onTogglePurchased(item.id, !item.purchased)}
                className={`p-1.5 rounded transition ${
                  item.purchased
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-gray-100'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                title={item.purchased ? 'Đánh dấu chưa mua' : 'Đánh dấu đã mua'}
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3">
            {item.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {item.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div>
                {item.estimatedPrice ? (
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(item.estimatedPrice, item.currency || 'VND')}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 dark:text-gray-500">Chưa có giá</p>
                )}
              </div>
              {renderStars(item.priority)}
            </div>

            {item.purchased && item.purchasedAt && (
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Đã mua: {new Date(item.purchasedAt).toLocaleDateString('vi-VN')}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 pt-0 flex items-center justify-between">
            <div>
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  <ExternalLink className="w-4 h-4" />
                  Xem sản phẩm
                </a>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(item)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
                title="Chỉnh sửa"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
                title="Xóa"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
