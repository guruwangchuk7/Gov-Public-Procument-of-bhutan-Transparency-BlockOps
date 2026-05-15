import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Bhutan Procurement Transparency Platform",
  description: "A transparent and accountable government procurement platform powered by blockchain auditability and Bhutan NDI verification.",
  keywords: ["procurement", "transparency", "Bhutan", "government", "blockchain", "NDI"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-mint text-dark">
        {children}
      </body>
    </html>
  );
}
