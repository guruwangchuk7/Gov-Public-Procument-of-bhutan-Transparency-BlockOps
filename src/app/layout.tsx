import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-dark">
        {children}
      </body>
    </html>
  );
}
