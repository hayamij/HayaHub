'use client';

import { useRouter } from 'next/navigation';
import { X, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export function LoginPromptModal({ isOpen, onClose, message = 'Bạn cần đăng nhập để thực hiện thao tác này' }: LoginPromptModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleLogin = () => {
    router.push('/login' as any);
  };

  const handleRegister = () => {
    router.push('/register' as any);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-gray-200 dark:border-gray-800">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gray-900 dark:bg-gray-100 rounded-full flex items-center justify-center">
              <LogIn className="w-8 h-8 text-white dark:text-gray-900" />
            </div>
          </div>

          {/* Title & Message */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-3">
            Yêu cầu đăng nhập
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleLogin}
              className="w-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:opacity-90 py-3 rounded-lg font-medium flex items-center justify-center gap-2 shadow-sm"
            >
              <LogIn className="w-5 h-5" />
              Đăng nhập
            </Button>
            
            <Button
              onClick={handleRegister}
              variant="secondary"
              className="w-full border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Đăng ký tài khoản
            </Button>
          </div>

          {/* Skip button */}
          <button
            onClick={onClose}
            className="w-full mt-4 text-sm text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            Để sau
          </button>
        </div>
      </div>
    </div>
  );
}
