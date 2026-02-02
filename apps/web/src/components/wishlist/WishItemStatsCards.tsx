'use client';

import { WishItemDTO } from 'hayahub-business';
import { Heart, ShoppingBag, TrendingUp } from 'lucide-react';

interface WishItemStatsCardsProps {
  wishItems: WishItemDTO[];
  formatCurrency: (amount: number, currency: string) => string;
}

export function WishItemStatsCards({ wishItems, formatCurrency }: WishItemStatsCardsProps) {
  const purchasedItems = wishItems.filter((item) => item.purchased);
  const unpurchasedItems = wishItems.filter((item) => !item.purchased);

  const totalValue = wishItems.reduce((sum, item) => {
    if (item.estimatedPrice) {
      return sum + item.estimatedPrice;
    }
    return sum;
  }, 0);

  const purchasedValue = purchasedItems.reduce((sum, item) => {
    if (item.estimatedPrice) {
      return sum + item.estimatedPrice;
    }
    return sum;
  }, 0);

  const unpurchasedValue = unpurchasedItems.reduce((sum, item) => {
    if (item.estimatedPrice) {
      return sum + item.estimatedPrice;
    }
    return sum;
  }, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Items Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng wishlist</h3>
          <Heart className="w-5 h-5 text-pink-500" />
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {wishItems.length}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Tổng giá trị: {formatCurrency(totalValue, 'VND')}
        </p>
      </div>

      {/* Purchased Items Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Đã mua</h3>
          <ShoppingBag className="w-5 h-5 text-green-500" />
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {purchasedItems.length}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Giá trị: {formatCurrency(purchasedValue, 'VND')}
        </p>
      </div>

      {/* Remaining Items Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Chưa mua</h3>
          <TrendingUp className="w-5 h-5 text-blue-500" />
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {unpurchasedItems.length}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Cần: {formatCurrency(unpurchasedValue, 'VND')}
        </p>
      </div>
    </div>
  );
}
