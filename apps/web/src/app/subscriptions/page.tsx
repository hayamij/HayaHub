'use client';

import { useState, useCallback, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageLoader } from '@/components/layout/PageLoader';
import { LoginPromptModal } from '@/components/ui/LoginPromptModal';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { SubscriptionTable } from '@/components/subscriptions/SubscriptionTable';
import { SubscriptionWorkspace } from '@/components/subscriptions/SubscriptionWorkspace';
import { SubscriptionModal } from '@/components/subscriptions/SubscriptionModal';
import { SubscriptionStatsCards } from '@/components/subscriptions/SubscriptionStatsCards';
import { Plus, Table, Layout } from 'lucide-react';
import type { SubscriptionDTO, CreateSubscriptionDTO, UpdateSubscriptionDTO } from 'hayahub-business';
import { SubscriptionStatus } from 'hayahub-domain';
import type { LayoutPositionData } from 'hayahub-domain';
import { Button } from '@/components/ui/Button';

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
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Show login prompt if not authenticated
  useEffect(() => {
    if (!user) {
      setShowLoginPrompt(true);
    }
  }, [user]);

  const formatCurrency = useCallback((amount: number, currency: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency || 'VND',
    }).format(amount);
  }, []);

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

  const handlePause = useCallback(
    async (id: string) => {
      await updateSubscription(id, { status: SubscriptionStatus.PAUSED });
    },
    [updateSubscription]
  );

  const handleResume = useCallback(
    async (id: string) => {
      await updateSubscription(id, { status: SubscriptionStatus.ACTIVE });
    },
    [updateSubscription]
  );

  const handleSave = useCallback(
    async (data: CreateSubscriptionDTO | UpdateSubscriptionDTO): Promise<boolean> => {
      try {
        if (editingSubscription) {
          await updateSubscription(editingSubscription.id, data as UpdateSubscriptionDTO);
        } else {
          await createSubscription(data as CreateSubscriptionDTO);
        }
        setIsModalOpen(false);
        setEditingSubscription(null);
        return true;
      } catch (error) {
        console.error('Failed to save subscription:', error);
        return false;
      }
    },
    [editingSubscription, createSubscription, updateSubscription]
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
            <Button
              onClick={handleAdd}
              variant="primary"
            >
              <Plus className="w-5 h-5" />
              Thêm đăng ký
            </Button>
          </div>

          {/* Stats Cards */}
          <SubscriptionStatsCards subscriptions={subscriptions} formatCurrency={formatCurrency} />

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

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-800 border-t-gray-900 dark:border-t-gray-100 rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
              <p className="text-red-600 dark:text-red-400">Có lỗi xảy ra: {error.message}</p>
            </div>
          ) : viewMode === 'table' ? (
            <SubscriptionTable
              subscriptions={subscriptions}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPause={handlePause}
              onResume={handleResume}
              formatCurrency={formatCurrency}
            />
          ) : (
            <SubscriptionWorkspace
              subscriptions={subscriptions}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPause={handlePause}
              onResume={handleResume}
              onLayoutChange={handleLayoutChange}
              formatCurrency={formatCurrency}
            />
          )}
        </div>

        {/* Modal */}
        <SubscriptionModal
          isOpen={isModalOpen}
          editingSubscription={editingSubscription}
          onClose={handleCloseModal}
          onSubmit={handleSave}
          userId={user?.id || ''}
        />

        {/* Login Prompt Modal */}
        <LoginPromptModal
          isOpen={showLoginPrompt}
          onClose={() => setShowLoginPrompt(false)}
          message="Bạn cần đăng nhập để quản lý subscriptions của mình"
        />
      </DashboardLayout>
    </PageLoader>
  );
}
