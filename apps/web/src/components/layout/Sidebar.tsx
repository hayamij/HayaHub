'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Wallet,
  CreditCard,
  Calendar,
  Folder,
  Heart,
  Quote,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import type { Route } from 'next';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: Route;
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    id: 'spending',
    label: 'Spending',
    icon: Wallet,
    href: '/spending',
  },
  {
    id: 'subscriptions',
    label: 'Subscriptions',
    icon: CreditCard,
    href: '/subscriptions',
  },
  {
    id: 'calendar',
    label: 'Calendar',
    icon: Calendar,
    href: '/calendar',
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: Folder,
    href: '/projects',
  },
  {
    id: 'wishlist',
    label: 'Wishlists',
    icon: Heart,
    href: '/wishlist',
  },
  {
    id: 'quote',
    label: 'Quotes',
    icon: Quote,
    href: '/quote',
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 z-50
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-[60px]' : 'w-60'}
      `}
    >
      <div className="flex flex-col h-full">
        {/* Toggle button */}
        <div className="h-14 flex items-center justify-between px-3 border-b border-gray-200 dark:border-gray-800">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gray-900 dark:bg-gray-100 rounded-md flex items-center justify-center">
                <span className="text-white dark:text-gray-900 font-bold text-sm">H</span>
              </div>
              <span className="text-base font-semibold text-gray-900 dark:text-white">
                HayaHub
              </span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={isCollapsed ? 'Mở rộng' : 'Thu gọn'}
          >
            {isCollapsed ? (
              <PanelLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <PanelLeftClose className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>

        {/* Menu items */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`
                  flex items-center gap-3 mx-2 my-1 px-3 py-2.5 rounded-md transition-all group relative
                  ${isCollapsed ? 'justify-center' : ''}
                  ${
                    isActive
                      ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                )}
                
                {/* Tooltip khi collapsed */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-500">v1.0.0</p>
          </div>
        )}
      </div>
    </aside>
  );
}
