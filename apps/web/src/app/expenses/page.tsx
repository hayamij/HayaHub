'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useSyncToast } from '@/hooks/useSyncToast';

export default function ExpensesPage() {
  const { user } = useAuth();
  const router = useRouter();
  useSyncToast(); // Auto show toast when syncing completes

  if (!user) {
    return null; // AuthContext will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            Expense Management
          </h1>
          <button
            onClick={() => router.push('/' as any)}
            className="inline-flex h-10 items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-6 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Back to Home
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <p className="text-gray-600 dark:text-gray-400">
            Expense tracking features coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}
