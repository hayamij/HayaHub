'use client';

import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useState, useEffect } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Load sidebar state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved !== null) {
      setSidebarCollapsed(saved === 'true');
    }
  }, []);

  // Save sidebar state to localStorage
  const handleToggleSidebar = () => {
    const newValue = !sidebarCollapsed;
    setSidebarCollapsed(newValue);
    localStorage.setItem('sidebar-collapsed', String(newValue));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar - Always visible, collapsible */}
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={handleToggleSidebar} />

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
