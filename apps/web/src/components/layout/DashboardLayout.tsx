'use client';

import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useState, useEffect } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(true);

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const savedCollapsed = localStorage.getItem('sidebar-collapsed');
    const savedPinned = localStorage.getItem('sidebar-pinned');
    
    if (savedCollapsed !== null) {
      setSidebarCollapsed(savedCollapsed === 'true');
    }
    if (savedPinned !== null) {
      setSidebarPinned(savedPinned === 'true');
    }
  }, []);

  // Save sidebar state to localStorage
  const handleToggleCollapse = () => {
    const newValue = !sidebarCollapsed;
    setSidebarCollapsed(newValue);
    localStorage.setItem('sidebar-collapsed', String(newValue));
  };

  const handleTogglePin = () => {
    const newValue = !sidebarPinned;
    setSidebarPinned(newValue);
    localStorage.setItem('sidebar-pinned', String(newValue));
  };

  // Calculate padding based on sidebar state
  const shouldShowFullSidebar = sidebarPinned && !sidebarCollapsed;
  const mainPadding = shouldShowFullSidebar ? 'lg:pl-64' : 'lg:pl-16';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header - Full width, with hamburger button */}
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Sidebar - Collapsible and pinnable on desktop */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        isPinned={sidebarPinned}
        onToggleCollapse={handleToggleCollapse}
        onTogglePin={handleTogglePin}
      />

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area - Responsive padding based on sidebar state */}
      <div className={`transition-all duration-300 ${mainPadding}`}>
        {/* Page content */}
        <main className="pt-16">
          <div className="p-4 sm:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
