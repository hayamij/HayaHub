'use client';

import { useEffect, useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { Container } from '@/infrastructure/di/Container';
import { useAuth } from '@/contexts/AuthContext';
import type { QuoteDTO } from 'hayahub-business';

export default function QuoteWidgetContent() {
  const { user } = useAuth();
  const [dailyQuote, setDailyQuote] = useState<QuoteDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    favorites: 0,
  });

  useEffect(() => {
    const loadQuotes = async () => {
      if (!user?.id) return;

      setIsLoading(true);
      try {
        const getQuotesUseCase = Container.getQuotesUseCase();
        const result = await getQuotesUseCase.execute(user.id);

        if (result.success) {
          const allQuotes = result.value;
          const favorites = allQuotes.filter((q) => q.isFavorite);

          setStats({
            total: allQuotes.length,
            favorites: favorites.length,
          });

          if (allQuotes.length > 0) {
            const today = new Date();
            const dayOfYear = Math.floor(
              (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
            );
            const index = dayOfYear % allQuotes.length;
            setDailyQuote(allQuotes[index]);
          }
        }
      } catch (error) {
        console.error('Failed to load quotes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuotes();
  }, [user]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-400">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg">
          <div className="text-xs text-amber-600 dark:text-amber-400 mb-1">Tổng số</div>
          <div className="text-xl font-bold text-amber-700 dark:text-amber-300">{stats.total}</div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
          <div className="text-xs text-red-600 dark:text-red-400 mb-1 flex items-center gap-1">
            <Heart className="w-3 h-3" />
            Yêu thích
          </div>
          <div className="text-xl font-bold text-red-700 dark:text-red-300">{stats.favorites}</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {dailyQuote ? (
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Quote hôm nay</span>
            </div>
            <blockquote className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3 italic">
              "{dailyQuote.text}"
            </blockquote>
            {dailyQuote.author && (
              <div className="text-xs text-gray-500 dark:text-gray-400 text-right">— {dailyQuote.author}</div>
            )}
            {dailyQuote.isFavorite && (
              <div className="mt-3 flex items-center justify-center">
                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-400 dark:text-gray-500 text-center">Chưa có quote nào</div>
        )}
      </div>
    </div>
  );
}
