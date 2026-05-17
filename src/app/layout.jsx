import { Inter } from 'next/font/google';
import './globals.css';
import { BgpsProvider } from '@/hooks/useBgpsFlowState';
import { Toaster } from 'sonner';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'BGPS - Blockchain-Based Government Procurement System',
  description: 'A transparent, auditable, and verifiable procurement platform for Bhutan.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <BgpsProvider>
          <div className="min-h-screen selection:bg-zinc-900 selection:text-white">
            {children}
            <Toaster position="top-right" expand={true} richColors />
          </div>
        </BgpsProvider>
      </body>
    </html>
  );
}
