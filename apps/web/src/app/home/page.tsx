'use client';

import Link from 'next/link';
import { PublicHeader } from '@/components/layout/PublicHeader';

export default function LandingPage() {
  return (
    <>
      <PublicHeader />
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 pt-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gray-900 dark:bg-gray-100 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white dark:text-gray-900 font-bold text-4xl">H</span>
              </div>
            </div>

            {/* Hero section */}
            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl mb-6 text-gray-900 dark:text-white">
              Welcome to <span className="text-gray-900 dark:text-gray-100">HayaHub</span>
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">
              Your all-in-one personal management hub
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
              Master your life and finance with powerful tools and insights
            </p>

            {/* CTA buttons */}
            <div className="flex gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-gray-900 dark:bg-gray-100 px-8 text-base font-medium text-white dark:text-gray-900 shadow-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-gray-900 dark:border-gray-100 bg-transparent px-8 text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              >
                Sign In
              </Link>
            </div>

            {/* Features */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Expense Tracking
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Track your expenses effortlessly and gain insights into your spending habits
                </p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">☁️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Cloud Sync
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Your data synced securely to GitHub, accessible from anywhere
                </p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Analytics
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Visualize your data with beautiful charts and detailed reports
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
