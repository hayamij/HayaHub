import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ToastProvider } from '@/contexts/ToastContext';
import { OnlineSyncProvider } from '@/components/OnlineSyncProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HayaHub - Personal Management Hub',
  description: 'All-in-one personal management system',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <AuthProvider>
              <OnlineSyncProvider>{children}</OnlineSyncProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
