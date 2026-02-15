'use client';

import { useState, useCallback, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageLoader } from '@/components/layout/PageLoader';
import { LoginPromptModal } from '@/components/ui/LoginPromptModal';
import { useAuth } from '@/contexts/AuthContext';
import { useQuotes } from '@/hooks/useQuotes';
import { QuoteStatsCards } from '@/components/quote/QuoteStatsCards';
import { QuoteModal } from '@/components/quote/QuoteModal';
import { QuoteList } from '@/components/quote/QuoteList';
import { Plus, Filter, Heart } from 'lucide-react';
import type { QuoteDTO, CreateQuoteDTO, UpdateQuoteDTO } from 'hayahub-business';
import { Button } from '@/components/ui/Button';

type FilterType = 'all' | 'favorites' | 'MOTIVATION' | 'WISDOM' | 'INSPIRATION' | 'HUMOR' | 'LIFE' | 'SUCCESS' | 'OTHER';

const FILTER_LABELS: Record<FilterType, string> = {
  all: 'Tất cả',
  favorites: 'Yêu thích',
  MOTIVATION: 'Động lực',
  WISDOM: 'Trí tuệ',
  INSPIRATION: 'Cảm hứng',
  HUMOR: 'Hài hước',
  LIFE: 'Cuộc sống',
  SUCCESS: 'Thành công',
  OTHER: 'Khác',
};

export default function QuotePage() {
  const { user } = useAuth();
  const {
    quotes,
    isLoading,
    error,
    createQuote,
    updateQuote,
    deleteQuote,
  } = useQuotes(user?.id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<QuoteDTO | null>(null);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Show login prompt if not authenticated
  useEffect(() => {
    if (!user) {
      setShowLoginPrompt(true);
    }
  }, [user]);

  const handleAdd = useCallback(() => {
    setEditingQuote(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((quote: QuoteDTO) => {
    setEditingQuote(quote);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm('Bạn có chắc chắn muốn xóa quote này?')) return;
      await deleteQuote(id);
    },
    [deleteQuote]
  );

  const handleToggleFavorite = useCallback(
    async (id: string, isFavorite: boolean) => {
      await updateQuote(id, { isFavorite });
    },
    [updateQuote]
  );

  const handleSave = useCallback(
    async (data: CreateQuoteDTO | UpdateQuoteDTO): Promise<boolean> => {
      try {
        if (editingQuote) {
          await updateQuote(editingQuote.id, data as UpdateQuoteDTO);
        } else {
          await createQuote(data as CreateQuoteDTO);
        }
        setIsModalOpen(false);
        setEditingQuote(null);
        return true;
      } catch (error) {
        console.error('Failed to save quote:', error);
        return false;
      }
    },
    [editingQuote, createQuote, updateQuote]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingQuote(null);
  }, []);

  const filteredQuotes = quotes.filter((quote) => {
    if (filterType === 'favorites') return quote.isFavorite;
    if (filterType === 'all') return true;
    return quote.category === filterType;
  });

  if (isLoading) {
    return (
      <PageLoader>
        <DashboardLayout>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">Đang tải dữ liệu...</p>
            </div>
          </div>
        </DashboardLayout>
      </PageLoader>
    );
  }

  if (error) {
    return (
      <PageLoader>
        <DashboardLayout>
          <div className="flex items-center justify-center h-96">
            <div className="text-center text-red-600">
              <p>Lỗi tải dữ liệu: {error.message}</p>
            </div>
          </div>
        </DashboardLayout>
      </PageLoader>
    );
  }

  return (
    <PageLoader>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Bộ sưu tập Quote
            </h1>
            <Button
              onClick={handleAdd}
              variant="primary"
            >
              <Plus className="w-5 h-5" />
              Thêm Quote
            </Button>
          </div>

          {/* Stats */}
          <QuoteStatsCards quotes={quotes} />

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Lọc theo danh mục</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  filterType === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {FILTER_LABELS.all}
              </button>
              <button
                onClick={() => setFilterType('favorites')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  filterType === 'favorites'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Heart className="w-4 h-4" />
                {FILTER_LABELS.favorites}
              </button>
              {(['MOTIVATION', 'WISDOM', 'INSPIRATION', 'HUMOR', 'LIFE', 'SUCCESS', 'OTHER'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterType(filter)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    filterType === filter
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {FILTER_LABELS[filter]}
                  <span className="text-xs opacity-75">
                    ({quotes.filter((q) => q.category === filter).length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quote List */}
          <QuoteList
            quotes={filteredQuotes}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleFavorite={handleToggleFavorite}
          />

          {/* Modal */}
          {user && (
            <QuoteModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onSubmit={handleSave}
              editingQuote={editingQuote}
              userId={user.id}
            />
          )}

          {/* Login Prompt Modal */}
          <LoginPromptModal
            isOpen={showLoginPrompt}
            onClose={() => setShowLoginPrompt(false)}
            message="Bạn cần đăng nhập để quản lý quotes của mình"
          />
        </div>
      </DashboardLayout>
    </PageLoader>
  );
}
