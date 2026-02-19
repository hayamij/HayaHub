'use client';

import type { QuoteDTO } from 'hayahub-business';
import { Heart, Quote as QuoteIcon } from 'lucide-react';

interface QuoteCardProps {
  quote: QuoteDTO;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  MOTIVATION: 'bg-gray-300 text-gray-900 dark:bg-gray-600 dark:text-gray-100',
  WISDOM: 'bg-gray-400 text-gray-50 dark:bg-gray-500 dark:text-gray-50',
  INSPIRATION: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  HUMOR: 'bg-gray-250 text-gray-850 dark:bg-gray-650 dark:text-gray-150',
  LIFE: 'bg-gray-300 text-gray-900 dark:bg-gray-600 dark:text-gray-100',
  SUCCESS: 'bg-gray-350 text-gray-900 dark:bg-gray-550 dark:text-gray-100',
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
        <QuoteIcon className="w-8 h-8 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-1" />
        
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
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-gray-100'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
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
