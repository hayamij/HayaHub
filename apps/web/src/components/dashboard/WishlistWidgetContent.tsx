'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { Container } from '@/infrastructure/di/Container';
import { useAuth } from '@/contexts/AuthContext';
import type { WishItemDTO } from 'hayahub-business';

export default function WishlistWidgetContent() {
  const { user } = useAuth();
  const [wishItems, setWishItems] = useState<WishItemDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalItems: 0,
    highPriority: 0,
    totalCost: 0,
  });

  useEffect(() => {
    const loadWishItems = async () => {
      if (!user?.id) return;

      setIsLoading(true);
      try {
        const getWishItemsUseCase = Container.getWishItemsUseCase();
        const result = await getWishItemsUseCase.execute(user.id);

        if (result.success) {
          const items = result.value;
          setWishItems(items);

          const highPriority = items.filter((item) => item.priority === 1);
          const totalCost = items.reduce((sum, item) => sum + (item.estimatedPrice || 0), 0);

          setStats({
            totalItems: items.length,
            highPriority: highPriority.length,
            totalCost,
          });
        }
      } catch (error) {
        console.error('Failed to load wish items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWishItems();
  }, [user]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-400">Đang tải...</div>
      </div>
    );
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const topItems = wishItems.sort((a, b) => a.priority - b.priority).slice(0, 5);

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-pink-50 dark:bg-pink-900/20 p-2 rounded-lg">
          <div className="text-xs text-pink-600 dark:text-pink-400 mb-1">Tổng</div>
          <div className="text-xl font-bold text-pink-700 dark:text-pink-300">{stats.totalItems}</div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
          <div className="text-xs text-red-600 dark:text-red-400 mb-1">Ưu tiên cao</div>
          <div className="text-xl font-bold text-red-700 dark:text-red-300">{stats.highPriority}</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg">
          <div className="text-xs text-purple-600 dark:text-purple-400 mb-1">Chi phí</div>
          <div className="text-sm font-bold text-purple-700 dark:text-purple-300">
            {(stats.totalCost / 1000000).toFixed(1)}M
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Ưu tiên cao nhất</h4>
        {topItems.length === 0 ? (
          <div className="text-sm text-gray-400 dark:text-gray-500">Chưa có mục nào</div>
        ) : (
          <div className="space-y-2">
            {topItems.map((item) => (
              <div
                key={item.id}
                className="p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start gap-2">
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {[...Array(item.priority)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</div>
                    {item.estimatedPrice && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatCurrency(item.estimatedPrice)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
