import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from '@/app/state-provider';
import { AuthProvider } from '@/hooks/use-auth';
import './globals.css';

export const metadata: Metadata = {
  title: 'Coin Tracker',
  description: 'Track your income and expenses with ease.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet"></link>
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
