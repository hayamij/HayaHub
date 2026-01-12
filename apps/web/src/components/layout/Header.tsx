'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Search, Moon, Sun, LogOut, User as UserIcon, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserSettings } from '@/hooks/useUserSettings';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
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
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 z-50">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        {/* Left section - Hamburger + Logo */}
        <div className="flex items-center gap-3">
          {/* Hamburger menu - Mobile only */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Logo */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gray-900 dark:bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-white dark:text-gray-900 font-bold text-lg">H</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
              HayaHub
            </span>
          </Link>
        </div>

        {/* Center section - Search bar (hidden on small mobile) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right section - Dark mode toggle & User avatar */}
        <div className="flex items-center gap-4">
          {/* Dark/Light mode toggle */}
          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            aria-label="Toggle theme"
          >
            {mounted && (
              <>
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </>
            )}
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            >
              {/* Avatar */}
              <div className="w-8 h-8 bg-gray-900 dark:bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-white dark:text-gray-900 text-sm font-medium">
                  {user?.name.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">
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
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {user?.email}
                    </p>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        router.push('/profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <UserIcon className="w-4 h-4" />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
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
