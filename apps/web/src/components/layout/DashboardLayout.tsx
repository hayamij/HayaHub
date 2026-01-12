'use client';

import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useState } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header - Full width, with hamburger button */}
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Sidebar - Hidden on mobile, toggleable */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area - Responsive padding */}
      <div className="lg:pl-64">
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
