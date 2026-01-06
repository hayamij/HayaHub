'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 text-gray-900 dark:text-white">
            Welcome to <span className="text-indigo-600 dark:text-indigo-400">HayaHub</span>
          </h1>
          {user ? (
            <div className="space-y-6">
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
                Hello, {user.name}! 👋
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Your all-in-one personal management hub
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => router.push('/expenses')}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-indigo-600 px-8 text-sm font-medium text-white shadow hover:bg-indigo-700"
                >
                  Manage Expenses
                </button>
                <button
                  onClick={logout}
                  className="inline-flex h-10 items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-8 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
                Master your life and finance
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
