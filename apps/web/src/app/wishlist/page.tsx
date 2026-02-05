'use client';

import { useState, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageLoader } from '@/components/layout/PageLoader';
import { useAuth } from '@/contexts/AuthContext';
import { useWishItems } from '@/hooks/useWishItems';
import { WishItemStatsCards } from '@/components/wishlist/WishItemStatsCards';
import { WishItemModal } from '@/components/wishlist/WishItemModal';
import { WishItemGrid } from '@/components/wishlist/WishItemGrid';
import { Plus, Filter } from 'lucide-react';
import type { WishItemDTO, CreateWishItemDTO, UpdateWishItemDTO } from 'hayahub-business';
import { Button } from '@/components/ui/Button';

type FilterType = 'all' | 'purchased' | 'unpurchased';

export default function WishlistPage() {
  const { user } = useAuth();
  const {
    wishItems,
    isLoading,
    error,
    createWishItem,
    updateWishItem,
    deleteWishItem,
  } = useWishItems(user?.id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWishItem, setEditingWishItem] = useState<WishItemDTO | null>(null);
  const [filterType, setFilterType] = useState<FilterType>('all');

  const formatCurrency = useCallback((amount: number, currency: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency || 'VND',
    }).format(amount);
  }, []);

  const handleAdd = useCallback(() => {
    setEditingWishItem(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((wishItem: WishItemDTO) => {
    setEditingWishItem(wishItem);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi wishlist?')) return;
      await deleteWishItem(id);
    },
    [deleteWishItem]
  );

  const handleTogglePurchased = useCallback(
    async (id: string, purchased: boolean) => {
      await updateWishItem(id, { purchased });
    },
    [updateWishItem]
  );

  const handleSave = useCallback(
    async (data: CreateWishItemDTO | UpdateWishItemDTO): Promise<boolean> => {
      try {
        if (editingWishItem) {
          await updateWishItem(editingWishItem.id, data as UpdateWishItemDTO);
        } else {
          await createWishItem(data as CreateWishItemDTO);
        }
        setIsModalOpen(false);
        setEditingWishItem(null);
        return true;
      } catch (error) {
        console.error('Failed to save wish item:', error);
        return false;
      }
    },
    [editingWishItem, createWishItem, updateWishItem]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingWishItem(null);
  }, []);

  const filteredWishItems = wishItems.filter((item) => {
    if (filterType === 'purchased') return item.purchased;
    if (filterType === 'unpurchased') return !item.purchased;
    return true;
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
              Wishlist
            </h1>
            <Button
              onClick={handleAdd}
              variant="primary"
            >
              <Plus className="w-5 h-5" />
              Thêm
            </Button>
          </div>

          {/* Stats */}
          <WishItemStatsCards wishItems={wishItems} formatCurrency={formatCurrency} />

          {/* Filters */}
          <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filterType === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Tất cả ({wishItems.length})
              </button>
              <button
                onClick={() => setFilterType('unpurchased')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filterType === 'unpurchased'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Chưa mua ({wishItems.filter((i) => !i.purchased).length})
              </button>
              <button
                onClick={() => setFilterType('purchased')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filterType === 'purchased'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Đã mua ({wishItems.filter((i) => i.purchased).length})
              </button>
            </div>
          </div>

          {/* Grid */}
          <WishItemGrid
            wishItems={filteredWishItems}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onTogglePurchased={handleTogglePurchased}
            formatCurrency={formatCurrency}
          />

          {/* Modal */}
          {user && (
            <WishItemModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onSubmit={handleSave}
              editingWishItem={editingWishItem}
              userId={user.id}
            />
          )}
        </div>
      </DashboardLayout>
    </PageLoader>
  );
}
