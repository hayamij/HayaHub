'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Search, Moon, Sun, LogOut, User as UserIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserSettings } from '@/hooks/useUserSettings';

export function Header() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { settings, updateTheme } = useUserSettings();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync theme from settings on mount
  useEffect(() => {
    if (mounted && settings.theme && theme !== settings.theme) {
      setTheme(settings.theme);
    }
  }, [mounted, settings.theme, theme, setTheme]);

  // Handle theme toggle with database sync
  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    updateTheme(newTheme);
  };

  return (
    <header className="h-14 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between h-full px-6 gap-4">
        {/* Left section - Logo */}
        <div className="flex-1 flex items-center">
        </div>

        {/* Center section - Search bar */}
        <div className="flex-shrink-0 w-full max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right section - Dark mode toggle & User menu */}
        <div className="flex-1 flex items-center justify-end gap-3">
          {/* Dark/Light mode toggle */}
          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {mounted && (
              <>
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                )}
              </>
            )}
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-7 h-7 bg-gray-900 dark:bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-white dark:text-gray-900 text-xs font-semibold">
                  {user?.name.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.name || 'User'}
              </span>
            </button>

            {/* Dropdown menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-900 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  {/* User info */}
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                      {user?.email}
                    </p>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        router.push('/profile' as any);
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <UserIcon className="w-4 h-4" />
                      Hồ sơ
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
