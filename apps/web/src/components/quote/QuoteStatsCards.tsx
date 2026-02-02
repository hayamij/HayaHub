'use client';

import { QuoteDTO } from 'hayahub-business';
import { Quote, Heart, Sparkles } from 'lucide-react';

interface QuoteStatsCardsProps {
  quotes: QuoteDTO[];
}

export function QuoteStatsCards({ quotes }: QuoteStatsCardsProps) {
  const favoriteQuotes = quotes.filter((q) => q.isFavorite);
  
  const categoryCounts = quotes.reduce((acc, quote) => {
    acc[quote.category] = (acc[quote.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Quotes Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng số quote</h3>
          <Quote className="w-5 h-5 text-blue-500" />
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {quotes.length}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {Object.keys(categoryCounts).length} danh mục
        </p>
      </div>

      {/* Favorite Quotes Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Yêu thích</h3>
          <Heart className="w-5 h-5 text-red-500" />
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {favoriteQuotes.length}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {quotes.length > 0 ? Math.round((favoriteQuotes.length / quotes.length) * 100) : 0}% tổng số
        </p>
      </div>

      {/* Top Category Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Danh mục phổ biến</h3>
          <Sparkles className="w-5 h-5 text-yellow-500" />
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {topCategory ? topCategory[1] : 0}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {topCategory ? topCategory[0] : 'Chưa có'}
        </p>
      </div>
    </div>
  );
}
