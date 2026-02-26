'use client';

import { useRouter } from 'next/navigation';
import { Quote, Heart, TrendingUp, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuotesWidget } from '@/hooks/useQuotesWidget';

export default function QuoteWidget() {
  const router = useRouter();
  const { user } = useAuth();
  const { dailyQuote, stats, isLoading } = useQuotesWidget(user?.id);

  return (
    <div
      onClick={() => router.push('/quote' as any)}
      className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg group-hover:scale-110 transition-transform">
            <Quote className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quote
          </h3>
        </div>
        <TrendingUp className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-colors" />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Tổng số</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Yêu thích</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.favorites}</p>
            </div>
          </div>

          {/* Quote of the Day */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Quote trong ngày
              </p>
            </div>
            {dailyQuote ? (
              <div className="p-4 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-2 mb-3">
                  <Quote className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white italic leading-relaxed">
                    {dailyQuote.text}
                  </p>
                </div>
                {dailyQuote.author && (
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      &mdash; {dailyQuote.author}
                    </p>
                    {dailyQuote.isFavorite && (
                      <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    )}
                  </div>
                )}
                {dailyQuote.category && (
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded">
                      {dailyQuote.category}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                Chưa có quote nào
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

