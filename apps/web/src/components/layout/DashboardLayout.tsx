'use client';

import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useState, useEffect } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(true);

  // Load sidebar state from localStorage
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
  const handleToggleSidebar = () => {
    const newValue = !sidebarCollapsed;
    setSidebarCollapsed(newValue);
    localStorage.setItem('sidebar-collapsed', String(newValue));
  };

  const handleTogglePin = () => {
    const newValue = !sidebarPinned;
    setSidebarPinned(newValue);
    localStorage.setItem('sidebar-pinned', String(newValue));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar - Always visible, collapsible with hover */}
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        isPinned={sidebarPinned}
        onToggle={handleToggleSidebar}
        onTogglePin={handleTogglePin}
      />

      {/* Main content area with dynamic padding */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'pl-[60px]' : 'pl-60'}`}>
        {/* Header */}
        <Header />
        
        {/* Page content */}
        <main>
          <div className="p-4 sm:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
