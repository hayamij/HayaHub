'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageLoader } from '@/components/layout/PageLoader';

export default function WishlistPage() {
  return (
    <PageLoader>
      <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Wishlist
          </h1>
        </div>

        <div className="flex items-center justify-center h-96 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
          <div className="text-center">
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-2">
              Coming soon...
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Save and manage your wish items
            </p>
          </div>
        </div>
      </div>
      </DashboardLayout>
    </PageLoader>
  );
}
