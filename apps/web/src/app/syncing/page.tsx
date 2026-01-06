'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container } from '@/infrastructure/di/Container';

export default function SyncingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = (searchParams.get('redirect') || '/') as any;
  
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Preparing your data...');
  const [syncComplete, setSyncComplete] = useState(false);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let redirectTimer: NodeJS.Timeout;

    const startSync = async () => {
      // Get storage adapter
      const container = Container.getInstance();
      const storageService = container.storageService;

      // Check if it's HybridStorageAdapter with sync capabilities
      const hybridStorage = storageService as any;
      
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
            setSyncComplete(true);
            
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
          setSyncComplete(true);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
          {/* Animated logo/icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-indigo-200 dark:border-indigo-900"></div>
              <div
                className={`absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-indigo-600 border-t-transparent ${
                  syncComplete ? '' : 'animate-spin'
                }`}
                style={{ animationDuration: '1s' }}
              >
                {syncComplete && (
                  <div className="flex items-center justify-center h-full">
                    <svg
                      className="w-12 h-12 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Syncing with GitHub
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {message}
          </p>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-500">
            {progress}% complete
          </p>

          {/* Info message */}
          <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <p className="text-xs text-indigo-700 dark:text-indigo-300">
              💡 Your data is being backed up to GitHub for persistence across devices
            </p>
          </div>

          {/* Skip button (optional) */}
          <button
            onClick={() => router.push(redirectTo)}
            className="mt-4 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline"
          >
            Skip and continue →
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
