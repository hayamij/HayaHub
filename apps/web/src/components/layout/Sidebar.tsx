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
  X,
  ChevronLeft,
  Pin,
  PinOff,
} from 'lucide-react';
import type { Route } from 'next';
import { /*useEffect,*/ useState } from 'react';

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
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  isPinned?: boolean;
  onToggleCollapse?: () => void;
  onTogglePin?: () => void;
}

export function Sidebar({ 
  isOpen = false, 
  onClose, 
  isCollapsed = false,
  isPinned = true,
  onToggleCollapse,
  onTogglePin 
}: SidebarProps) {
  const pathname = usePathname();
  const [hovering, setHovering] = useState(false);

  // Show sidebar when: mobile open, desktop pinned, or desktop hovering while collapsed
  const shouldShowFull = isOpen || (isPinned && !isCollapsed) || (!isPinned && hovering);
  const isDesktopCollapsed = !isOpen && isCollapsed;

  return (
    <aside
      onMouseEnter={() => !isPinned && setHovering(true)}
      onMouseLeave={() => !isPinned && setHovering(false)}
      className={`
        fixed left-0 top-0 h-screen bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 z-40
        transition-all duration-300 ease-in-out
        ${shouldShowFull ? 'w-64' : 'w-16'}
        ${isOpen ? 'translate-x-0' : 'lg:translate-x-0 -translate-x-full'}
      `}
    >
      {/* Control buttons */}
      <div className="absolute top-4 right-2 flex items-center gap-1">
        {/* Pin/Unpin button - Desktop only */}
        {onTogglePin && (
          <button
            onClick={onTogglePin}
            className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={isPinned ? 'Unpin sidebar' : 'Pin sidebar'}
            title={isPinned ? 'Ghim' : 'Bỏ ghim'}
          >
            {isPinned ? (
              <Pin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <PinOff className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        )}
        
        {/* Collapse button - Desktop only */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle sidebar"
            title="Thu gọn"
          >
            <ChevronLeft className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        )}
        
        {/* Close button - Mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Sidebar content */}
      <div className="flex flex-col h-full py-6">
        {/* Logo area */}
        <div className={`px-4 mb-8 transition-all ${isDesktopCollapsed ? 'opacity-0' : 'opacity-100'}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 dark:bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white dark:text-gray-900 font-bold text-lg">H</span>
            </div>
            {shouldShowFull && (
              <span className="text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
                HayaHub
              </span>
            )}
          </div>
        </div>

        {/* Menu items */}
        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative group
                  ${
                    isActive
                      ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
                title={isDesktopCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {shouldShowFull && (
                  <span className="font-medium text-sm whitespace-nowrap">{item.label}</span>
                )}
                
                {/* Tooltip for collapsed state */}
                {isDesktopCollapsed && !hovering && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {shouldShowFull && (
          <div className="px-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              v1.0.0
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
