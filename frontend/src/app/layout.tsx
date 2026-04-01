import type { Metadata } from 'next';
import ToastProvider from '@/components/ui/Toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'NexusAI - AI Model Marketplace | Discover, Compare & Deploy',
  description: 'Find your perfect AI model with guided discovery. Chat, compare, and deploy 400+ AI models.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
