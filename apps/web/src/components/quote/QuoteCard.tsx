'use client';

import type { QuoteDTO } from 'hayahub-business';
import { Heart, Quote as QuoteIcon } from 'lucide-react';

interface QuoteCardProps {
  quote: QuoteDTO;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  MOTIVATION: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  WISDOM: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  INSPIRATION: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  HUMOR: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  LIFE: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  SUCCESS: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
  OTHER: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

const CATEGORY_LABELS: Record<string, string> = {
  MOTIVATION: 'Động lực',
  WISDOM: 'Trí tuệ',
  INSPIRATION: 'Cảm hứng',
  HUMOR: 'Hài hước',
  LIFE: 'Cuộc sống',
  SUCCESS: 'Thành công',
  OTHER: 'Khác',
};

export function QuoteCard({ quote, onToggleFavorite }: QuoteCardProps) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <QuoteIcon className="w-8 h-8 text-blue-500 flex-shrink-0 mt-1" />
        
        <div className="flex-1 min-w-0">
          <p className="text-lg text-gray-900 dark:text-white leading-relaxed mb-4 italic">
            &ldquo;{quote.text}&rdquo;
          </p>
          
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                — {quote.author}
              </p>
              
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  CATEGORY_COLORS[quote.category] || CATEGORY_COLORS.OTHER
                }`}
              >
                {CATEGORY_LABELS[quote.category] || quote.category}
              </span>
            </div>

            <button
              onClick={() => onToggleFavorite(quote.id, !quote.isFavorite)}
              className={`p-2 rounded-full transition ${
                quote.isFavorite
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-red-600'
              }`}
              title={quote.isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
            >
              <Heart className={`w-5 h-5 ${quote.isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {quote.tags && quote.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {quote.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
