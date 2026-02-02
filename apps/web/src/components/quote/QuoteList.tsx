'use client';

import type { QuoteDTO } from 'hayahub-business';
import { QuoteCard } from './QuoteCard';
import { Edit2, Trash2, Quote as QuoteIcon } from 'lucide-react';

interface QuoteListProps {
  quotes: QuoteDTO[];
  onEdit: (quote: QuoteDTO) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
}

export function QuoteList({ quotes, onEdit, onDelete, onToggleFavorite }: QuoteListProps) {
  if (quotes.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <QuoteIcon className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
        <p className="text-gray-500 dark:text-gray-400">Chưa có quote nào</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Thêm quote đầu tiên để lưu giữ cảm hứng
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {quotes.map((quote) => (
        <div key={quote.id} className="relative group">
          <QuoteCard quote={quote} onToggleFavorite={onToggleFavorite} />
          
          {/* Action buttons overlay */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(quote)}
              className="p-2 bg-white dark:bg-gray-800 text-blue-600 rounded-lg shadow-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
              title="Chỉnh sửa"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(quote.id)}
              className="p-2 bg-white dark:bg-gray-800 text-red-600 rounded-lg shadow-md hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              title="Xóa"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
