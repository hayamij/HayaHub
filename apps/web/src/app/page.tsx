'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const action = searchParams.get('action');
    
    // Handle logout action - clear data immediately
    if (action === 'logout') {
      localStorage.removeItem('currentUser');
      // Will trigger auth reload and redirect to /home
      window.location.href = '/home';
      return;
    }

    if (!loading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/home');
      }
    }
  }, [user, loading, router, searchParams]);

  // Blank loading state - no flash, completely transparent
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        {/* Outer spinning ring */}
        <div className="absolute w-28 h-28 border-4 border-gray-200 dark:border-gray-800 border-t-gray-900 dark:border-t-gray-100 rounded-full animate-spin" />
        
        {/* Logo in center */}
        <div className="w-20 h-20 bg-gray-900 dark:bg-gray-100 rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-white dark:text-gray-900 font-bold text-4xl">H</span>
        </div>
      </div>
    </div>
  );
}
