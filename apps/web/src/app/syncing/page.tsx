'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { container } from '@/infrastructure/di/Container';

function SyncingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = (searchParams.get('redirect') || '/') as string;
  
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Preparing your data...');

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let redirectTimer: NodeJS.Timeout;

    const startSync = async () => {
      // Get storage adapter
      const storageService = container.storageService;

      // Check if it's HybridStorageAdapter with sync capabilities
      interface HybridStorageWithSync {
        syncToRemote?: () => Promise<void>;
        waitForSync?: (timeout: number) => Promise<boolean>;
      }
      const hybridStorage = storageService as HybridStorageWithSync;
      
      // Animate progress bar smoothly (slower for better UX)
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 80) return prev; // Stop at 80% until real sync completes
          return prev + 0.8; // Even slower increment
        });
      }, 180); // Slower interval

      // Update messages with longer delays
      setTimeout(() => setMessage('Connecting to GitHub...'), 1500);
      setTimeout(() => setMessage('Syncing your data...'), 3500);
      setTimeout(() => setMessage('Finalizing sync...'), 5500);

      // Check if sync methods exist
      if (typeof hybridStorage.waitForSync === 'function') {
        try {
          // Wait for actual GitHub sync (max 20 seconds)
          const syncSuccess = await hybridStorage.waitForSync(20000);
          
          if (syncSuccess) {
            setProgress(100);
            setMessage('All set! Redirecting...');
            
            // Redirect after longer delay - use window.location for full reload
            redirectTimer = setTimeout(() => {
              window.location.href = redirectTo;
            }, 2000); // Increased to 2 seconds
          } else {
            // Timeout - continue anyway
            setProgress(100);
            setMessage('Sync taking longer... Continuing offline mode');
            setTimeout(() => {
              window.location.href = redirectTo;
            }, 2500);
          }
        } catch (error) {
          console.error('Sync error:', error);
          setProgress(100);
          setMessage('Continuing in offline mode...');
          setTimeout(() => {
            window.location.href = redirectTo;
          }, 2500);
        }
      } else {
        // Fallback to timer-based progress (minimum 7 seconds)
        setTimeout(() => {
          setProgress(100);
          setMessage('All set! Redirecting...');
          redirectTimer = setTimeout(() => {
            window.location.href = redirectTo;
          }, 2000);
        }, 7000); // Increased from 5000ms
      }
    };

    startSync();

    return () => {
      if (progressInterval) clearInterval(progressInterval);
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [router, redirectTo]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress bar */}
        <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mb-4">
          <div
            className="absolute top-0 left-0 h-full bg-gray-900 dark:bg-gray-100 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress percentage */}
        <div className="text-center mb-2">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {Math.round(progress)}%
          </p>
        </div>

        {/* Status message */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SyncingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mb-4">
            <div className="absolute top-0 left-0 h-full bg-gray-900 dark:bg-gray-100 transition-all duration-300 ease-out" style={{ width: '0%' }} />
          </div>
          <div className="text-center mb-2">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">0%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <SyncingPageContent />
    </Suspense>
  );
}
