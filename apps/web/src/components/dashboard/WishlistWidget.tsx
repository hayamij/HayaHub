'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Star, TrendingUp } from 'lucide-react';
import { Container } from '@/infrastructure/di/Container';
import { useAuth } from '@/contexts/AuthContext';
import type { WishItemDTO } from 'hayahub-business';

export default function WishlistWidget() {
  const router = useRouter();
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

          const highPriority = items.filter(
            (item) => item.priority === 1
          );
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

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const topItems = wishItems
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 5);

  return (
    <div
      onClick={() => router.push('/wishlist')}
      className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg group-hover:scale-110 transition-transform">
            <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Wishlist
          </h3>
        </div>
        <TrendingUp className="w-4 h-4 text-gray-400 group-hover:text-pink-600 transition-colors" />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Tổng số</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalItems}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Ưu tiên</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.highPriority}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Tổng giá</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                {formatCurrency(stats.totalCost).replace('₫', '')}
              </p>
            </div>
          </div>

          {/* Top Items */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mong muốn hàng đầu
            </p>
            {topItems.length > 0 ? (
              topItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 group-hover:bg-pink-50 dark:group-hover:bg-pink-900/20 transition-colors"
                >
                  <Star
                    className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      item.priority === 1
                        ? 'text-red-500 fill-red-500'
                        : item.priority === 2
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-400'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatCurrency(item.estimatedPrice || 0)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                Chưa có mong muốn nào
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

