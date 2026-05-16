import { Outfit } from 'next/font/google';
import './globals.css';
import { BgpsProvider } from '@/hooks/useBgpsFlowState';
import FlowModeBadge from '@/components/flow/FlowModeBadge';
import { Toaster } from 'sonner';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata = {
  title: 'BGPS - Blockchain-Based Government Procurement System',
  description: 'A transparent, auditable, and verifiable procurement platform for Bhutan.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <BgpsProvider>
          <div className="min-h-screen selection:bg-primary/30">
            {children}
            <FlowModeBadge />
            <Toaster position="top-right" expand={true} richColors />
          </div>
        </BgpsProvider>
      </body>
    </html>
  );
}
