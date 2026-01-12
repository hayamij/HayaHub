'use client';

import { useEffect, useState, type ReactNode } from 'react';

interface PageLoaderProps {
  children: ReactNode;
  minLoadingTime?: number; // milliseconds
}

/**
 * PageLoader - Ensures loading screen is always shown for minimum duration
 * Prevents flash of content and provides smooth loading experience
 */
export function PageLoader({ children, minLoadingTime = 100 }: PageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, minLoadingTime);

    return () => clearTimeout(timer);
  }, [minLoadingTime]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-800 border-t-gray-900 dark:border-t-gray-100 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
