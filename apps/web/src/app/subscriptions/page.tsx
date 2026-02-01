'use client';

import { useState, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageLoader } from '@/components/layout/PageLoader';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { SubscriptionTable } from '@/components/subscriptions/SubscriptionTable';
import { SubscriptionWorkspace } from '@/components/subscriptions/SubscriptionWorkspace';
import { SubscriptionModal } from '@/components/subscriptions/SubscriptionModal';
import { Plus, Table, Layout } from 'lucide-react';
import type { SubscriptionDTO } from 'hayahub-business';
import type { LayoutPositionData } from 'hayahub-domain';
import { SubscriptionFrequency } from 'hayahub-domain';

type ViewMode = 'table' | 'workspace';

export default function SubscriptionsPage() {
  const { user } = useAuth();
  const {
    subscriptions,
    isLoading,
    error,
    createSubscription,
    updateSubscription,
    deleteSubscription,
  } = useSubscriptions(user?.id);

  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<SubscriptionDTO | null>(null);

  const handleAdd = useCallback(() => {
    setEditingSubscription(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((subscription: SubscriptionDTO) => {
    setEditingSubscription(subscription);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm('Bạn có chắc chắn muốn xóa subscription này?')) return;
      await deleteSubscription(id);
    },
    [deleteSubscription]
  );

  const handleSave = useCallback(
    async (data: {
      name: string;
      amount: number;
      currency: string;
      frequency: SubscriptionFrequency;
      startDate: Date;
      description?: string;
      icon?: string;
    }) => {
      if (!user?.id) return;

      if (editingSubscription) {
        // Update existing
        await updateSubscription(editingSubscription.id, {
          name: data.name,
          amount: data.amount,
          currency: data.currency,
          frequency: data.frequency,
          description: data.description,
          icon: data.icon,
        });
      } else {
        // Create new
        await createSubscription({
          userId: user.id,
          name: data.name,
          amount: data.amount,
          currency: data.currency,
          frequency: data.frequency,
          startDate: data.startDate,
          description: data.description,
          icon: data.icon,
        });
      }
    },
    [user?.id, editingSubscription, createSubscription, updateSubscription]
  );

  const handleLayoutChange = useCallback(
    async (id: string, layout: LayoutPositionData) => {
      await updateSubscription(id, { layoutPosition: layout });
    },
    [updateSubscription]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingSubscription(null);
  }, []);

  return (
    <PageLoader>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Subscriptions</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Quản lý các gói đăng ký định kỳ của bạn
              </p>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Thêm mới
            </button>
          </div>

          {/* View Mode Switcher */}
          <div className="flex gap-2 bg-gray-100 dark:bg-gray-900 rounded-lg p-1 w-fit">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-gray-800 shadow text-gray-900 dark:text-gray-100'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <Table className="w-4 h-4" />
              Bảng
            </button>
            <button
              onClick={() => setViewMode('workspace')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                viewMode === 'workspace'
                  ? 'bg-white dark:bg-gray-800 shadow text-gray-900 dark:text-gray-100'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <Layout className="w-4 h-4" />
              Workspace
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <div className="text-sm text-gray-600 dark:text-gray-400">Tổng số Subscriptions</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {subscriptions.length}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <div className="text-sm text-gray-600 dark:text-gray-400">Đang hoạt động</div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                {subscriptions.filter((s) => s.status === 'ACTIVE').length}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <div className="text-sm text-gray-600 dark:text-gray-400">Chi phí hàng tháng</div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(
                  subscriptions
                    .filter((s) => s.status === 'ACTIVE' && s.frequency === 'MONTHLY')
                    .reduce((sum, s) => sum + s.amount, 0)
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-800 border-t-gray-900 dark:border-t-gray-100 rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
              <p className="text-red-600 dark:text-red-400">Có lỗi xảy ra: {error.message}</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              {viewMode === 'table' ? (
                <SubscriptionTable
                  subscriptions={subscriptions}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ) : (
                <div className="p-6">
                  <SubscriptionWorkspace
                    subscriptions={subscriptions}
                    onEdit={handleEdit}
                    onLayoutChange={handleLayoutChange}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal */}
        <SubscriptionModal
          isOpen={isModalOpen}
          subscription={editingSubscription}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      </DashboardLayout>
    </PageLoader>
  );
}
